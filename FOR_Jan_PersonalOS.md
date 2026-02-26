# FOR_Jan: Personal OS — The Story Behind the Portfolio

> *"What if my portfolio was an entire operating system?"*
> That's the question this project answers. And honestly? It's a banger.

---

## 1. Project Overview

**Personal OS** is your portfolio website — but instead of a boring scrolling page with a hero section and a contact form, it's a fake desktop operating system. Think Windows XP vibes, but make it Neo-Brutalist and actually functional.

Here's the user journey:
1. You land on a **terminal-style page** — green text on black, typewriter animation, very "hacker movie"
2. You flip a **physical light switch** in the corner
3. The screen flashes white and... boom. A full desktop OS loads
4. Inside the OS: a Start Menu, draggable windows, a Snake game, a calculator, a fake browser, a Gemini AI chat, a task manager, and more

It's not just a cool gimmick. The portfolio content lives inside the OS apps — your projects, your skills, your contact info. It's a conversation starter, not just a resume link.

---

## 2. Technical Architecture

Think of the app as **two worlds stacked on top of each other**, like two sheets of glass.

```
┌───────────────────────────────┐
│   Portfolio Layer (top)       │  ← Terminal + light switch. z-index: 10000
│   PortfolioPage component     │  ← Fades away when you flip the switch
└───────────────────────────────┘
           ↓ fade out
┌───────────────────────────────┐
│   OS Layer (bottom)           │  ← Desktop, windows, taskbar, apps
│   Desktop + WindowManager     │  ← Starts at brightness: 0, becomes 1
└───────────────────────────────┘
```

The OS layer is **always rendered in the DOM** — it's just invisible until the switch is flipped. No mounting/unmounting. The transition is purely CSS: `filter: brightness(0)` → `brightness(1)` with a white flash for the flicker effect. This is clever because it avoids a React re-render waterfall when you "boot" the OS.

### How the OS Actually Works

Everything is managed from one place: `App.tsx`. It's the control tower. It holds:
- The list of all open windows and their state (position, size, z-order, minimized/maximized)
- The app registry (what apps exist and how to render them)
- The shared task list (used by Dashboard, TaskManager, and the Gemini AI)

When you open an app, `App.tsx` adds a new entry to the `windows` array. When you drag a window, `App.tsx` updates its `position`. When you close it, `App.tsx` removes it from the array. Every visual change flows through this single source of truth.

```
User clicks "Calculator" in Start Menu
        ↓
App.tsx: openApp('CALCULATOR')
        ↓
windows state gets a new WindowState entry
        ↓
WindowManager re-renders, creates a new <Window> component
        ↓
Window component renders CalculatorApp inside it
        ↓
User sees a draggable calculator window appear
```

---

## 3. Codebase Structure

Here's the map of the territory:

```
/
├── App.tsx              ← The brain. All window state, app registry, event handlers
├── types.ts             ← The vocabulary. Every shared type lives here
├── index.tsx            ← Entry point. Just mounts React.
├── index.css            ← Animations, CRT scanlines, light switch, profile pic styles
├── index.html           ← Loads Tailwind from CDN (unusual — see Tech Decisions)
│
├── data/
│   ├── portfolioData.ts ← Your content: name, bio, projects, social links
│   └── fileSystem.ts    ← The fake file system (My Documents, My Pictures, etc.)
│
├── hooks/
│   ├── useFileExplorerNavigation.ts  ← History stack + breadcrumbs for File Explorer
│   └── useTypewriter.ts              ← Character-by-character typing animation
│
├── utils/
│   └── sounds.ts        ← That satisfying click sound on every button press
│
└── components/
    ├── Window.tsx        ← Draggable + resizable window shell
    ├── WindowManager.tsx ← Renders all open windows in z-order
    ├── Taskbar.tsx       ← The bar at the bottom with the START button
    ├── StartMenu.tsx     ← Programs + Places + Shut Down
    ├── Desktop.tsx       ← Background gradient + desktop icons (currently empty)
    ├── PortfolioPage.tsx ← The terminal entry experience
    ├── BrainView.tsx     ← Gemini AI chat
    ├── Dashboard.tsx     ← Project overview + tasks
    └── apps/            ← One file per app (Calculator, Snake, Weather, etc.)
```

### The App Registry Pattern

Instead of a giant if/else chain, there's an elegant two-part system:

**Part 1:** `APP_CONFIGS` — a dictionary mapping every `AppId` to its display config:
```typescript
APP_CONFIGS[AppId.CALCULATOR] = {
  title: 'Calculator',
  defaultSize: { width: 320, height: 480 },
  titleBarColor: '#e07a5f',   // coral
  icon: '...',                // SVG path
}
```

**Part 2:** `renderApp()` — a switch statement that returns the actual React component:
```typescript
case AppId.CALCULATOR: return <CalculatorApp />;
case AppId.GAMES:      return <GamesApp />;
// etc.
```

Adding a new app means: add the AppId enum value, add an entry to APP_CONFIGS, add a case to renderApp. Clean and scalable.

### The Fake File System

This is one of the cleverer design choices. Instead of hardcoding folder structures inside the File Explorer component, there's a proper virtual file system in `data/fileSystem.ts`:

```typescript
// Everything is a flat record, connected by parentId
type FileItem = {
  id: string
  parentId: string
  name: string
  type: 'folder' | 'file' | 'app-shortcut'
  // ...
}
```

It's like a database table for files. To get a folder's contents, you filter by `parentId`. To build breadcrumbs, you walk up the `parentId` chain. Simple, but it makes the File Explorer feel genuinely navigable rather than a hardcoded list.

---

## 4. Technology Choices

### React + TypeScript + Vite
Standard modern frontend stack. Vite makes builds fast. TypeScript catches errors before they hit the browser. React handles the UI reactively. No surprises here.

### Tailwind CSS — but from CDN (the unusual bit)
Normally you install Tailwind via npm and run it through PostCSS. Here it's loaded from a CDN script tag in `index.html`. Why? This project was initially built in **Google AI Studio**, which has a sandboxed environment. Loading Tailwind from CDN is the path of least resistance there. It works fine, but it means:
- The full Tailwind stylesheet loads (larger than a pruned build)
- Tailwind is configured inline in `index.html` via a `tailwind.config` object in a script tag

If you ever want to deploy this seriously, migrating to the npm-based Tailwind pipeline would be a good upgrade.

### Gemini AI (`@google/genai`)
The "Brain" app uses Google's Gemini model (`gemini-2.5-flash-preview`) for AI chat. The API key is injected at build time by Vite (not at runtime), so it never ships in client-side JS — good security hygiene. The app passes your task list as JSON context to the AI, so it can answer questions like "what should I work on today?"

### Web Audio API (no library)
The click sound that plays on every button press? That's done with raw browser Web Audio API — no sound library. It creates an oscillator, sweeps it from 800Hz to 400Hz over 50ms, and fades the gain out. The result: a satisfying retro "blip." Clever and dependency-free.

Why lazy init? The AudioContext is only created on first user interaction. This is required by browsers (they block audio until the user has clicked something), so the code wraps it in a singleton pattern that initialises on demand.

### No Router, No Persistence
Deliberately simple choices:
- **No React Router**: The OS metaphor handles navigation through window state. No URL changes needed.
- **No localStorage**: All state resets on refresh. This keeps the code simple and avoids dealing with stale persisted state.

---

## 5. Lessons Learned

### Lesson 1: CSS Transitions Beat React Mounting for Boot Sequences
The "OS boot" effect could have been done by conditionally rendering the OS layer (`{isBooted && <DesktopLayer />}`). But that would cause React to mount/unmount dozens of components on every flip. Instead, both layers are always mounted, and the transition is a pure CSS `filter: brightness()` change. No React re-renders, buttery smooth animation.

**Rule:** For show/hide transitions that need to be smooth, reach for CSS opacity/visibility before React conditional rendering.

### Lesson 2: Single Source of Truth for Window State
All window state (position, size, z-index, minimized/maximized) lives in `App.tsx`. This means any component can trigger window operations by calling a prop function — no prop drilling hell because the callbacks are passed down, and no global state library needed. For an app this size, it's the right call.

**Rule:** For "OS-like" UIs where many components need to communicate, a single top-level state manager (even just useState in App.tsx) works better than scattered component-level state.

### Lesson 3: The Template Literal Bug (A Classic Gotcha)
There's a bug in `BrainView.tsx`:
```typescript
// Wrong — this is a regular string, not a template literal
"Analyzing ${tasks.length} data points."

// Right — backticks make it a template literal
`Analyzing ${tasks.length} data points.`
```
The screen literally shows `${tasks.length}` instead of a number. This is one of those bugs that's invisible in code review because your brain auto-corrects it. TypeScript doesn't catch it either because it's syntactically valid — just wrong.

**Rule:** When you see `${}` in a string, double-check the quotes. Template literals need backticks (`` ` ``), not single or double quotes.

### Lesson 4: Hardcoded Data Has a Shelf Life
The Currency Converter shows "Updated just now" but the exchange rates are static constants written months ago. The Weather app shows fake weather. The World Clock has hardcoded UTC offsets that don't account for DST — Auckland is listed as UTC+13 but that's only correct in summer.

This was fine for a portfolio demo. But it's a reminder: **if you show data that implies freshness (timestamps, "updated just now"), make sure it actually is fresh** — or remove the timestamp.

### Lesson 5: Custom Hooks Are Worth the Abstraction
`useFileExplorerNavigation` encapsulates the back/forward/up navigation stack — complete with history and breadcrumb generation. `useTypewriter` handles the animation timing. Both of these could have been inline in the component with `useState` and `useEffect`, but extracting them into hooks makes the components dramatically easier to read.

**Rule:** If a chunk of stateful logic makes your component hard to read, it's a custom hook waiting to happen.

### Lesson 6: The Snake Speed TODO
The Snake game has this comment:
```typescript
// TODO(human): Implement getSpeed(score) — returns interval in ms.
const getSpeed = (score: number): number => {
  return INITIAL_SPEED; // always 150ms
};
```
The snake never gets faster. It was left as a deliberate "to-do for the human." This is a good AI coding pattern — when an AI isn't sure of the right game feel, leaving a clearly marked stub is better than guessing. The structure is in place; filling it in takes 5 minutes.

### Lesson 7: The Flat File System Pattern
The virtual file system uses a flat `Record<id, FileItem>` with `parentId` references — the same pattern databases use for hierarchical data (called an "adjacency list"). It's simple, it's fast for small datasets, and it's easy to extend. Compare this to the naive alternative: nested objects. Nested objects are a nightmare to navigate up from (you'd need to search the whole tree to find a node's parent).

**Rule:** For tree-structured data you need to navigate both up and down, a flat record with `parentId` is almost always cleaner than nested objects.

---

## 6. War Stories

### The Light Switch That Almost Wasn't
The original concept was just a button that said "Enter OS." But somewhere in the build process, the decision was made: *what if it was an actual light switch?* The CSS for this — a physical toggle that flips, with a white screen flash on activation — took real effort. The switch uses CSS transforms for the physical flip, a separate `z-index: 10001` white overlay div for the flash, and carefully timed `setTimeout` calls. The result is one of those small details that makes visitors go "wait, how did they do that?"

### Building Across Multiple AI Sessions
The `HANDOVER.md` file in the repo tells the story: this project was built across multiple AI sessions, with handover notes passed between them. You can see the architectural fingerprints of multiple "brains" working on it — some decisions are very deliberate and documented, others are "it worked, ship it." This is the reality of vibe coding: move fast, keep what works, document the weird bits.

### The Desktop That's Always Empty
`DESKTOP_SHORTCUTS = []` — the desktop has no icons on it. This is intentional: everything lives in the Start Menu, keeping the desktop clean. But there's something poetic about an OS where the desktop is deliberately empty. It's the Marie Kondo of portfolio sites.

---

## Quick Reference

| File | What it does |
|------|-------------|
| `App.tsx` | All window state + app registry — start here |
| `types.ts` | All shared TypeScript types — understand data shapes |
| `data/portfolioData.ts` | **Edit this to update your portfolio content** |
| `data/fileSystem.ts` | Virtual file system structure |
| `components/PortfolioPage.tsx` | Terminal entry experience + light switch |
| `components/Window.tsx` | Draggable + resizable window implementation |
| `utils/sounds.ts` | Click sound (Web Audio API) |
| `public/profile.png` | Profile photo (referenced in PortfolioPage) |

**To update portfolio content:** Edit `data/portfolioData.ts` — your projects, bio, and social links are all in there.

**To add a new app:**
1. Add an `AppId` to `types.ts`
2. Add a config to `APP_CONFIGS` in `App.tsx`
3. Add a case to `renderApp()` in `App.tsx`
4. Create the component in `components/apps/`
5. Add it to `StartMenu.tsx` if you want it accessible

---

*Built with React + TypeScript + Vite + Tailwind + Gemini AI. Deployed on GitHub Pages.*
