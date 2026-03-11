import { spawn } from 'node:child_process';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';

const PROJECT_ROOT = process.cwd();
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VIEWPORT = { width: 1440, height: 900 };
const INIT_SCRIPT = `
(() => {
  const errors = [];
  const pushError = (type, detail) => {
    errors.push({
      type,
      detail: typeof detail === 'string' ? detail : JSON.stringify(detail),
      timestamp: Date.now(),
    });
  };

  window.__themeValidationErrors = errors;

  window.addEventListener('error', (event) => {
    pushError('error', {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    pushError('unhandledrejection', String(event.reason ?? 'unknown'));
  });

  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    pushError('console.error', args.map((arg) => String(arg)).join(' '));
    originalConsoleError(...args);
  };

  class FakeAudioContext {
    constructor() {
      this.currentTime = 0;
      this.destination = {};
    }

    createOscillator() {
      return {
        connect() {},
        start() {},
        stop() {},
        frequency: {
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
      };
    }

    createGain() {
      return {
        connect() {},
        gain: {
          setValueAtTime() {},
          exponentialRampToValueAtTime() {},
        },
      };
    }
  }

  window.AudioContext = FakeAudioContext;
  window.webkitAudioContext = FakeAudioContext;
})();
`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to acquire a free port.'));
        return;
      }
      server.close(() => resolve(address.port));
    });
    server.on('error', reject);
  });
}

async function waitForHttp(url, timeoutMs = 20000) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`Unexpected status ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(250);
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

function spawnProcess(command, args, label) {
  const child = spawn(command, args, {
    cwd: PROJECT_ROOT,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let log = '';
  const append = (chunk) => {
    const text = chunk.toString();
    log += text;
    if (log.length > 12000) {
      log = log.slice(-12000);
    }
  };

  child.stdout.on('data', append);
  child.stderr.on('data', append);
  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`[${label}] exited with code ${code}`);
    }
  });

  return {
    child,
    getLog: () => log,
  };
}

async function runCommand(command, args, label) {
  const proc = spawnProcess(command, args, label);
  const exitCode = await new Promise((resolve, reject) => {
    proc.child.on('exit', resolve);
    proc.child.on('error', reject);
  });

  if (exitCode !== 0) {
    throw new Error(`${label} failed with exit code ${exitCode}\n${proc.getLog()}`);
  }

  return proc.getLog();
}

async function terminateProcess(child) {
  if (child.exitCode !== null) return;

  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    sleep(3000),
  ]);

  if (child.exitCode === null) {
    child.kill('SIGKILL');
    await new Promise((resolve) => child.once('exit', resolve));
  }
}

class CDPConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.nextId = 1;
    this.pending = new Map();
    this.waiters = new Set();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timed out connecting to Chrome DevTools.')), 10000);
      this.ws.addEventListener('open', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.addEventListener('error', (event) => {
        clearTimeout(timer);
        reject(event.error ?? new Error('Failed to connect to Chrome DevTools.'));
      }, { once: true });
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data.toString());
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) {
          pending.reject(new Error(message.error.message));
          return;
        }
        pending.resolve(message.result ?? {});
        return;
      }

      for (const waiter of [...this.waiters]) {
        if (waiter.matches(message)) {
          this.waiters.delete(waiter);
          waiter.resolve(message);
        }
      }
    });
  }

  async close() {
    if (!this.ws) return;
    if (this.ws.readyState === WebSocket.CLOSED) return;
    this.ws.close();
    await Promise.race([
      new Promise((resolve) => {
        this.ws.addEventListener('close', resolve, { once: true });
      }),
      sleep(1000),
    ]);
  }

  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
    });
  }

  waitForEvent(method, matcher, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.waiters.delete(waiter);
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const waiter = {
        matches: (message) => {
          if (message.method !== method) return false;
          if (!matcher) return true;
          return matcher(message);
        },
        resolve: (message) => {
          clearTimeout(timeout);
          resolve(message);
        },
      };

      this.waiters.add(waiter);
    });
  }
}

class PageSession {
  constructor(connection, sessionId, targetId) {
    this.connection = connection;
    this.sessionId = sessionId;
    this.targetId = targetId;
  }

  async init() {
    await this.connection.send('Page.enable', {}, this.sessionId);
    await this.connection.send('Runtime.enable', {}, this.sessionId);
    await this.connection.send('Emulation.setDeviceMetricsOverride', {
      width: VIEWPORT.width,
      height: VIEWPORT.height,
      deviceScaleFactor: 1,
      mobile: false,
    }, this.sessionId);
    await this.connection.send('Page.addScriptToEvaluateOnNewDocument', { source: INIT_SCRIPT }, this.sessionId);
  }

  async navigate(url) {
    const loaded = this.connection.waitForEvent(
      'Page.loadEventFired',
      (message) => message.sessionId === this.sessionId,
      15000,
    );
    await this.connection.send('Page.navigate', { url }, this.sessionId);
    await loaded;
    await sleep(1200);
  }

  async reload() {
    const loaded = this.connection.waitForEvent(
      'Page.loadEventFired',
      (message) => message.sessionId === this.sessionId,
      15000,
    );
    await this.connection.send('Page.reload', {}, this.sessionId);
    await loaded;
    await sleep(1200);
  }

  async evaluate(expression) {
    const result = await this.connection.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    }, this.sessionId);

    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed.');
    }

    return result.result?.value;
  }

  async call(fn, ...args) {
    const expression = `(${fn.toString()})(${args.map((arg) => JSON.stringify(arg)).join(',')})`;
    return this.evaluate(expression);
  }

  async screenshot(filePath) {
    const result = await this.connection.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
    }, this.sessionId);
    await writeFile(filePath, Buffer.from(result.data, 'base64'));
  }

  async close() {
    await this.connection.send('Target.closeTarget', { targetId: this.targetId });
  }
}

async function launchChrome() {
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), 'theme-validation-chrome-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-renderer-backgrounding',
    '--mute-audio',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], {
    cwd: PROJECT_ROOT,
    env: process.env,
    stdio: ['ignore', 'ignore', 'pipe'],
  });

  const wsUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out launching Chrome.')), 10000);
    chrome.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      const match = text.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
    chrome.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    chrome.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Chrome exited early with code ${code}`));
    });
  });

  const connection = new CDPConnection(wsUrl);
  await connection.connect();

  return {
    chrome,
    connection,
    userDataDir,
    async cleanup() {
      try {
        await connection.close();
      } catch {}
      try {
        chrome.kill('SIGKILL');
      } catch {}
      await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
    },
  };
}

async function createPage(connection, browserContextId) {
  const { targetId } = await connection.send('Target.createTarget', {
    url: 'about:blank',
    browserContextId,
  });
  const { sessionId } = await connection.send('Target.attachToTarget', {
    targetId,
    flatten: true,
  });
  const page = new PageSession(connection, sessionId, targetId);
  await page.init();
  return page;
}

function collectSnapshot() {
  const bodyThemeId = document.body.dataset.osThemeId ?? null;
  const taskbar = document.querySelector('[data-testid="taskbar"]');
  const startButton = document.querySelector('[data-testid="start-button"]');
  const startMenu = document.querySelector('[data-testid="start-menu"]');
  const taskbarRect = taskbar?.getBoundingClientRect() ?? null;

  return {
    bodyThemeId,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    portfolioVisible: Boolean(document.querySelector('.portfolio-layer:not(.switched-off)')),
    taskbar: taskbarRect ? {
      top: taskbarRect.top,
      bottom: taskbarRect.bottom,
      height: taskbarRect.height,
      visible: taskbarRect.bottom <= window.innerHeight + 1 && taskbarRect.top >= 0,
      background: taskbar ? getComputedStyle(taskbar).backgroundImage || getComputedStyle(taskbar).backgroundColor : null,
    } : null,
    startButton: startButton ? {
      text: startButton.textContent.replace(/\\s+/g, ' ').trim(),
      background: startButton.style.background || getComputedStyle(startButton).backgroundImage || getComputedStyle(startButton).backgroundColor,
      color: getComputedStyle(startButton).color,
    } : null,
    startMenu: startMenu ? {
      open: true,
      themeId: startMenu.dataset.themeId ?? null,
      osLabel: startMenu.querySelector('[data-testid="start-menu-os-label"]')?.textContent?.trim() ?? null,
      rect: (() => {
        const rect = startMenu.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          fullyVisible: rect.left >= 0 && rect.top >= 0 && rect.right <= window.innerWidth + 1 && rect.bottom <= window.innerHeight + 1,
        };
      })(),
    } : {
      open: false,
      themeId: null,
      osLabel: null,
      rect: null,
    },
    windows: [...document.querySelectorAll('[data-testid="window"]')].map((windowEl) => {
      const rect = windowEl.getBoundingClientRect();
      const titlebar = windowEl.querySelector('[data-testid="window-titlebar"]');
      const controls = windowEl.querySelector('[data-testid="window-controls"]');
      return {
        id: windowEl.dataset.windowId,
        title: windowEl.dataset.windowTitle,
        themeId: windowEl.dataset.themeId,
        controlStyle: windowEl.dataset.controlStyle,
        controlPosition: windowEl.dataset.controlPosition,
        titleCentered: windowEl.dataset.titleCentered,
        maximized: windowEl.dataset.windowMaximized,
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        titlebarBackground: titlebar ? getComputedStyle(titlebar).backgroundImage || getComputedStyle(titlebar).backgroundColor : null,
        controlsCount: controls ? controls.querySelectorAll('button').length : 0,
      };
    }),
    taskbarTabs: [...document.querySelectorAll('[data-testid="taskbar-tab"]')].map((tab) => ({
      id: tab.dataset.windowId,
      title: tab.dataset.windowTitle,
      focused: tab.dataset.windowFocused,
      minimized: tab.dataset.windowMinimized,
    })),
    dockItems: [...document.querySelectorAll('[data-testid="dock-item"]')].map((item) => ({
      id: item.dataset.dockId,
      kind: item.dataset.dockKind,
      label: item.dataset.dockLabel,
      appId: item.dataset.appId,
      windowId: item.dataset.windowId,
      running: item.dataset.running,
      focused: item.dataset.focused,
      minimized: item.dataset.minimized,
    })),
    validationErrors: Array.isArray(window.__themeValidationErrors) ? window.__themeValidationErrors : [],
  };
}

function clickSelector(selector) {
  const target = document.querySelector(selector);
  if (!target) return false;
  target.click();
  return true;
}

async function dragSelector(selector, deltaX, deltaY, steps = 8) {
  const target = document.querySelector(selector);
  if (!target) return false;
  const rect = target.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;
  target.dispatchEvent(new MouseEvent('mousedown', {
    bubbles: true,
    cancelable: true,
    clientX: startX,
    clientY: startY,
    button: 0,
    buttons: 1,
  }));
  await new Promise((resolve) => setTimeout(resolve, 50));
  for (let index = 1; index <= steps; index += 1) {
    const nextX = startX + (deltaX * index) / steps;
    const nextY = startY + (deltaY * index) / steps;
    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      clientX: nextX,
      clientY: nextY,
      button: 0,
      buttons: 1,
    }));
    await new Promise((resolve) => setTimeout(resolve, 16));
  }
  document.dispatchEvent(new MouseEvent('mouseup', {
    bubbles: true,
    cancelable: true,
    clientX: startX + deltaX,
    clientY: startY + deltaY,
    button: 0,
    buttons: 0,
  }));
  return true;
}

async function callPage(page, fn, ...args) {
  const result = await page.call(fn, ...args);
  await sleep(250);
  return result;
}

async function requireClick(page, selector) {
  const ok = await callPage(page, clickSelector, selector);
  assert(ok, `Missing element for click: ${selector}`);
}

async function requireDrag(page, selector, deltaX, deltaY) {
  const ok = await callPage(page, dragSelector, selector, deltaX, deltaY);
  assert(ok, `Missing element for drag: ${selector}`);
}

async function snapshot(page) {
  return page.call(collectSnapshot);
}

async function switchTheme(page, themeId) {
  const startMenuOpen = await page.call(() => Boolean(document.querySelector('[data-testid="start-menu"]')));
  if (!startMenuOpen) {
    await requireClick(page, '[data-testid="start-button"]');
  }
  await waitFor(page, () => Boolean(document.querySelector('[data-testid="start-menu"]')), 5000, 'Start menu did not open.');
  const themePickerOpen = await page.call(
    (expectedThemeId) => Boolean(document.querySelector(`[data-testid="theme-option-${expectedThemeId}"]`)),
    themeId,
  );
  if (!themePickerOpen) {
    await requireClick(page, '[data-testid="change-theme-button"]');
  }
  await waitFor(
    page,
    (expectedThemeId) => Boolean(document.querySelector(`[data-testid="theme-option-${expectedThemeId}"]`)),
    5000,
    `Theme picker did not expose ${themeId}.`,
    themeId,
  );
  await requireClick(page, `[data-testid="theme-option-${themeId}"]`);
  await waitFor(
    page,
    (expectedThemeId) => document.body.dataset.osThemeId === expectedThemeId,
    5000,
    `Theme did not switch to ${themeId}.`,
    themeId,
  );
}

async function waitFor(page, predicate, timeoutMs, message, ...args) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const passed = await page.call(predicate, ...args);
    if (passed) return;
    await sleep(200);
  }
  throw new Error(message);
}

async function openProgram(page, appId) {
  await requireClick(page, '[data-testid="start-button"]');
  await waitFor(page, () => Boolean(document.querySelector('[data-testid="start-menu"]')), 5000, 'Start menu did not open.');
  await requireClick(page, `[data-testid="start-program-${appId}"]`);
  await waitFor(
    page,
    (expectedTitle) => [...document.querySelectorAll('[data-testid="window"]')].some((windowEl) => windowEl.dataset.windowTitle === expectedTitle),
    5000,
    `Window for ${appId} did not open.`,
    appId === 'projects' ? 'Projects' : 'Tasks',
  );
}

async function runModeValidation(modeName, serverScript, basePort, artifactsDir) {
  const modeDir = path.join(artifactsDir, modeName);
  await mkdir(modeDir, { recursive: true });

  if (serverScript === 'preview') {
    await runCommand('npm', ['run', 'build'], 'npm run build');
  }

  const server = spawnProcess('npm', ['run', serverScript, '--', '--host', '127.0.0.1', '--port', String(basePort)], `npm run ${serverScript}`);

  try {
    await waitForHttp(`http://127.0.0.1:${basePort}/os`);

    const browser = await launchChrome();
    try {
      const page = await createPage(browser.connection);
      await page.navigate(`http://127.0.0.1:${basePort}/os`);
      await waitFor(
        page,
        () => document.body.dataset.osThemeId === 'xp' && Boolean(document.querySelector('[data-testid="taskbar"]')),
        10000,
        `${modeName}: OS shell did not hydrate in time.`,
      );

      const initial = await snapshot(page);
      assert(initial.bodyThemeId === 'xp', `${modeName}: expected default theme to be xp.`);
      assert(initial.taskbar?.visible, `${modeName}: taskbar is clipped or off-screen.`);
      assert(initial.startButton?.text === 'START', `${modeName}: unexpected default start button label.`);
      assert(initial.startButton?.background.includes('linear-gradient'), `${modeName}: XP start button is missing the themed gradient on first load.`);
      await page.screenshot(path.join(modeDir, 'xp.png'));

      await requireClick(page, '[data-testid="start-button"]');
      await waitFor(page, () => Boolean(document.querySelector('[data-testid="start-menu"]')), 5000, `${modeName}: XP start menu did not open.`);
      const xpStartMenu = await snapshot(page);
      assert(xpStartMenu.startMenu.open, `${modeName}: XP start menu snapshot missing.`);
      assert(xpStartMenu.startMenu.themeId === 'xp', `${modeName}: XP start menu has the wrong theme id.`);
      assert(xpStartMenu.startMenu.rect?.fullyVisible, `${modeName}: XP start menu is not fully visible in the viewport.`);
      await page.screenshot(path.join(modeDir, 'xp-start-menu.png'));
      await requireClick(page, '[data-testid="start-button"]');
      await waitFor(page, () => !document.querySelector('[data-testid="start-menu"]'), 5000, `${modeName}: XP start menu did not close.`);

      await openProgram(page, 'projects');
      await openProgram(page, 'tasks');

      let working = await snapshot(page);
      assert(working.windows.length >= 2, `${modeName}: expected two open windows.`);
      assert(working.taskbarTabs.length >= 2, `${modeName}: expected matching taskbar tabs for open windows.`);

      const projectsWindow = working.windows.find((windowInfo) => windowInfo.title === 'Projects');
      assert(projectsWindow, `${modeName}: missing Projects window after open.`);

      await requireDrag(page, '[data-testid="window"][data-window-title="Projects"] [data-testid="window-titlebar"]', 120, 70);
      working = await snapshot(page);
      const draggedProjectsWindow = working.windows.find((windowInfo) => windowInfo.title === 'Projects');
      assert(draggedProjectsWindow.rect.left > projectsWindow.rect.left, `${modeName}: window drag did not move Projects horizontally.`);
      assert(draggedProjectsWindow.rect.top > projectsWindow.rect.top, `${modeName}: window drag did not move Projects vertically.`);

      await requireDrag(page, '[data-testid="window"][data-window-title="Projects"] [data-testid="window-resize-handle"]', 120, 80);
      working = await snapshot(page);
      const resizedProjectsWindow = working.windows.find((windowInfo) => windowInfo.title === 'Projects');
      assert(resizedProjectsWindow.rect.width > draggedProjectsWindow.rect.width, `${modeName}: window resize did not increase width.`);
      assert(resizedProjectsWindow.rect.height > draggedProjectsWindow.rect.height, `${modeName}: window resize did not increase height.`);

      await requireClick(page, '[data-testid="window"][data-window-title="Projects"] [data-testid="window-control-minimize"]');
      await waitFor(
        page,
        () => !document.querySelector('[data-testid="window"][data-window-title="Projects"]'),
        5000,
        `${modeName}: Projects window did not minimize.`,
      );

      working = await snapshot(page);
      const minimizedTab = working.taskbarTabs.find((tab) => tab.title === 'Projects');
      assert(minimizedTab?.minimized === 'true', `${modeName}: minimized window tab state was not reflected.`);

      await requireClick(page, '[data-testid="taskbar-tab"][data-window-title="Projects"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="Projects"]')),
        5000,
        `${modeName}: clicking the minimized taskbar tab did not restore the window.`,
      );

      await requireClick(page, '[data-testid="window"][data-window-title="Projects"] [data-testid="window-control-maximize"]');
      await waitFor(
        page,
        () => document.querySelector('[data-testid="window"][data-window-title="Projects"]')?.dataset.windowMaximized === 'true',
        5000,
        `${modeName}: maximize did not take effect.`,
      );

      await requireClick(page, '[data-testid="window"][data-window-title="Projects"] [data-testid="window-control-maximize"]');
      await waitFor(
        page,
        () => document.querySelector('[data-testid="window"][data-window-title="Projects"]')?.dataset.windowMaximized === 'false',
        5000,
        `${modeName}: restore from maximize did not take effect.`,
      );

      await switchTheme(page, 'neo');
      working = await snapshot(page);
      assert(working.bodyThemeId === 'neo', `${modeName}: Neo theme did not apply.`);
      assert(working.startButton?.text === 'START', `${modeName}: Neo start button label mismatch.`);
      assert(!working.startButton?.background.includes('linear-gradient'), `${modeName}: Neo start button should not be using the XP gradient.`);
      assert(working.windows.every((windowInfo) => windowInfo.controlStyle === 'neo-squares'), `${modeName}: Neo controls did not update on open windows.`);
      assert(working.windows.every((windowInfo) => windowInfo.controlPosition === 'right'), `${modeName}: Neo controls are not on the right.`);
      await page.screenshot(path.join(modeDir, 'neo.png'));

      const neoMenuOpen = await page.call(() => Boolean(document.querySelector('[data-testid="start-menu"]')));
      if (!neoMenuOpen) {
        await requireClick(page, '[data-testid="start-button"]');
      }
      await waitFor(page, () => Boolean(document.querySelector('[data-testid="start-menu"]')), 5000, `${modeName}: Neo start menu did not open.`);
      const neoStartMenu = await snapshot(page);
      assert(neoStartMenu.startMenu.open, `${modeName}: Neo start menu snapshot missing.`);
      assert(neoStartMenu.startMenu.themeId === 'neo', `${modeName}: Neo start menu has the wrong theme id.`);
      assert(neoStartMenu.startMenu.rect?.fullyVisible, `${modeName}: Neo start menu is not fully visible in the viewport.`);
      await page.screenshot(path.join(modeDir, 'neo-start-menu.png'));
      await requireClick(page, '[data-testid="start-button"]');
      await waitFor(page, () => !document.querySelector('[data-testid="start-menu"]'), 5000, `${modeName}: Neo start menu did not close.`);

      await switchTheme(page, 'aqua');
      working = await snapshot(page);
      assert(working.bodyThemeId === 'aqua', `${modeName}: Aqua theme did not apply.`);
      assert(working.startButton?.text === 'Finder', `${modeName}: Aqua start button label mismatch.`);
      assert(working.windows.every((windowInfo) => windowInfo.controlStyle === 'traffic-lights'), `${modeName}: Aqua controls did not update on open windows.`);
      assert(working.windows.every((windowInfo) => windowInfo.controlPosition === 'left'), `${modeName}: Aqua controls are not on the left.`);
      assert(working.windows.every((windowInfo) => windowInfo.titleCentered === 'true'), `${modeName}: Aqua titles are not centered.`);
      const aquaPinnedDockItems = working.dockItems.filter((item) => item.kind === 'pinned');
      assert(aquaPinnedDockItems.length === 5, `${modeName}: Aqua dock does not expose the expected pinned launchers.`);
      assert(
        JSON.stringify(aquaPinnedDockItems.map((item) => item.label)) === JSON.stringify(['Projects', 'Tasks', 'App Store', 'Browser', 'Games']),
        `${modeName}: Aqua dock launcher order is incorrect.`,
      );
      assert(aquaPinnedDockItems.find((item) => item.id === 'projects')?.running === 'true', `${modeName}: Projects should be marked as running in Aqua dock.`);
      assert(aquaPinnedDockItems.find((item) => item.id === 'tasks')?.running === 'true', `${modeName}: Tasks should be marked as running in Aqua dock.`);
      assert(aquaPinnedDockItems.find((item) => item.id === 'app-store')?.running === 'false', `${modeName}: App Store should not be marked running before it is opened.`);
      await page.screenshot(path.join(modeDir, 'aqua.png'));

      const aquaMenuOpen = await page.call(() => Boolean(document.querySelector('[data-testid="start-menu"]')));
      if (!aquaMenuOpen) {
        await requireClick(page, '[data-testid="start-button"]');
      }
      await waitFor(page, () => Boolean(document.querySelector('[data-testid="start-menu"]')), 5000, `${modeName}: Aqua Finder panel did not open.`);
      assert(
        !(await page.call(() => Boolean(document.querySelector('[data-testid^="start-program-"]')))),
        `${modeName}: Aqua Finder panel still shows the full launcher list.`,
      );
      assert(await page.call(() => Boolean(document.querySelector('[data-testid="start-place-my-computer"]'))), `${modeName}: Aqua Finder panel is missing My Computer.`);
      assert(await page.call(() => Boolean(document.querySelector('[data-testid="change-theme-button"]'))), `${modeName}: Aqua Finder panel is missing the theme switcher.`);
      assert(await page.call(() => Boolean(document.querySelector('[data-testid="start-shutdown"]'))), `${modeName}: Aqua Finder panel is missing Shut Down.`);
      await page.screenshot(path.join(modeDir, 'aqua-panel.png'));

      await requireClick(page, '[data-testid="start-place-my-computer"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="My Computer"]')),
        5000,
        `${modeName}: Aqua Finder panel did not open My Computer.`,
      );
      working = await snapshot(page);
      assert(
        working.dockItems.some((item) => item.kind === 'transient' && item.appId === 'my-computer'),
        `${modeName}: My Computer did not appear as a transient Aqua dock item.`,
      );
      await requireClick(page, '[data-testid="window"][data-window-title="My Computer"] [data-testid="window-control-close"]');
      await waitFor(
        page,
        () => !document.querySelector('[data-testid="window"][data-window-title="My Computer"]'),
        5000,
        `${modeName}: My Computer window did not close.`,
      );
      working = await snapshot(page);
      assert(
        !working.dockItems.some((item) => item.kind === 'transient' && item.appId === 'my-computer'),
        `${modeName}: My Computer transient Aqua dock item did not clear after close.`,
      );

      await requireClick(page, '[data-testid="dock-item"][data-dock-id="app-store"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="My Apps"]')),
        5000,
        `${modeName}: Aqua App Store dock item did not open My Apps.`,
      );
      working = await snapshot(page);
      assert(working.dockItems.find((item) => item.id === 'app-store')?.running === 'true', `${modeName}: App Store dock item did not reflect running state.`);

      await requireClick(page, '[data-testid="dock-item"][data-dock-id="app-store"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="My Apps"]')),
        5000,
        `${modeName}: Clicking the App Store dock item hid or minimized My Apps.`,
      );

      await requireClick(page, '[data-testid="mini-app-calculator"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="Calculator"]')),
        5000,
        `${modeName}: Calculator did not open from My Apps.`,
      );
      working = await snapshot(page);
      assert(
        working.dockItems.some((item) => item.kind === 'transient' && item.appId === 'calculator'),
        `${modeName}: Calculator did not appear as a transient Aqua dock item.`,
      );

      await requireClick(page, '[data-testid="window"][data-window-title="Calculator"] [data-testid="window-control-minimize"]');
      await waitFor(
        page,
        () => !document.querySelector('[data-testid="window"][data-window-title="Calculator"]'),
        5000,
        `${modeName}: Calculator window did not minimize in Aqua.`,
      );
      working = await snapshot(page);
      assert(
        working.dockItems.find((item) => item.kind === 'transient' && item.appId === 'calculator')?.minimized === 'true',
        `${modeName}: Calculator transient Aqua dock item did not reflect minimized state.`,
      );

      await requireClick(page, '[data-testid="dock-item"][data-app-id="calculator"]');
      await waitFor(
        page,
        () => Boolean(document.querySelector('[data-testid="window"][data-window-title="Calculator"]')),
        5000,
        `${modeName}: Clicking the Calculator Aqua dock item did not restore the window.`,
      );
      await requireClick(page, '[data-testid="window"][data-window-title="Calculator"] [data-testid="window-control-close"]');
      await waitFor(
        page,
        () => !document.querySelector('[data-testid="window"][data-window-title="Calculator"]'),
        5000,
        `${modeName}: Calculator window did not close.`,
      );
      working = await snapshot(page);
      assert(
        !working.dockItems.some((item) => item.kind === 'transient' && item.appId === 'calculator'),
        `${modeName}: Calculator transient Aqua dock item did not clear after close.`,
      );

      await page.reload();
      await waitFor(
        page,
        () => document.body.dataset.osThemeId === 'xp' && Boolean(document.querySelector('[data-testid="taskbar"]')),
        10000,
        `${modeName}: OS shell did not rehydrate after reload.`,
      );
      const reloaded = await snapshot(page);
      assert(reloaded.bodyThemeId === 'xp', `${modeName}: theme did not reset to xp on reload.`);
      assert(reloaded.validationErrors.length === 0, `${modeName}: runtime errors were captured during validation.`);
      await page.screenshot(path.join(modeDir, 'reloaded-xp.png'));

      const incognitoContext = await browser.connection.send('Target.createBrowserContext');
      const privatePage = await createPage(browser.connection, incognitoContext.browserContextId);
      await privatePage.navigate(`http://127.0.0.1:${basePort}/os`);
      await waitFor(
        privatePage,
        () => document.body.dataset.osThemeId === 'xp' && Boolean(document.querySelector('[data-testid="taskbar"]')),
        10000,
        `${modeName}: OS shell did not hydrate in isolated browser context.`,
      );
      const privateSnapshot = await snapshot(privatePage);
      assert(privateSnapshot.taskbar?.visible, `${modeName}: taskbar is clipped in isolated browser context.`);
      await privatePage.screenshot(path.join(modeDir, 'private-xp.png'));
      await privatePage.close();
      await browser.connection.send('Target.disposeBrowserContext', { browserContextId: incognitoContext.browserContextId });

      await page.close();

      const report = {
        mode: modeName,
        url: `http://127.0.0.1:${basePort}/os`,
        initial,
        postValidation: reloaded,
        privateSnapshot,
        artifacts: {
          xp: path.join(modeDir, 'xp.png'),
          xpStartMenu: path.join(modeDir, 'xp-start-menu.png'),
          neoStartMenu: path.join(modeDir, 'neo-start-menu.png'),
          neo: path.join(modeDir, 'neo.png'),
          aqua: path.join(modeDir, 'aqua.png'),
          aquaPanel: path.join(modeDir, 'aqua-panel.png'),
          reloadedXp: path.join(modeDir, 'reloaded-xp.png'),
          privateXp: path.join(modeDir, 'private-xp.png'),
        },
      };

      await writeFile(path.join(modeDir, 'report.json'), JSON.stringify(report, null, 2));
      return report;
    } finally {
      await browser.cleanup();
    }
  } finally {
    await terminateProcess(server.child);
  }
}

async function main() {
  const artifactsDir = await mkdtemp(path.join(os.tmpdir(), 'theme-validation-artifacts-'));
  const devPort = await getFreePort();
  const previewPort = await getFreePort();

  const reports = [];

  try {
    reports.push(await runModeValidation('dev', 'dev', devPort, artifactsDir));
    reports.push(await runModeValidation('preview', 'preview', previewPort, artifactsDir));

    const summary = {
      artifactsDir,
      reports: reports.map((report) => ({
        mode: report.mode,
        url: report.url,
        taskbarVisible: report.initial.taskbar?.visible ?? false,
        defaultTheme: report.initial.bodyThemeId,
        reloadTheme: report.postValidation.bodyThemeId,
        runtimeErrors: report.postValidation.validationErrors,
        screenshots: report.artifacts,
      })),
    };

    await writeFile(path.join(artifactsDir, 'summary.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

await main();
