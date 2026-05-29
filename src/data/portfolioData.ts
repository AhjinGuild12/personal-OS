export interface PortfolioSection {
  id: string;
  command: string;
  text: string;
  speed?: number;
  pauseAfter?: number;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  summary: string;
  oneSentence?: string;
  techStack?: string[];
  status?: 'in-progress';
  links?: { label: string; url: string }[];
  cta?: string;
}

export interface PortfolioData {
  sections: PortfolioSection[];
  socialLinks: SocialLink[];
  projects: ProjectDetail[];
}

const TYPING_SPEED_FAST = 18;
const TYPING_SPEED_NORMAL = 25;
const PAUSE_SHORT = 400;
const PAUSE_LONG = 800;

const portfolioData: PortfolioData = {
  sections: [
    {
      id: 'about',
      command: '> cat about.txt',
      text: `Hi, I'm Jan Medina — an IT Professional based in Auckland, NZ.

I manage enterprise device fleets, automate IT workflows, and build apps on the side. From JAMF and Intune policies to React web apps and iOS projects — I ship things that work.`,
      speed: TYPING_SPEED_FAST,
      pauseAfter: PAUSE_LONG,
    },
    {
      id: 'skills',
      command: '> cat skills.md',
      text: `IT & Infra:   JAMF Pro, Intune, Active Directory, Azure AD
Scripting:    PowerShell, Automation, MDM Policies
Dev:          React, Node.js, JavaScript, TypeScript, Swift
Platforms:    macOS, Windows, Linux, iOS
Tools:        Git, Xcode, VS Code, SharePoint, 365 Admin`,
      speed: TYPING_SPEED_FAST,
      pauseAfter: PAUSE_SHORT,
    },
    {
      id: 'projects',
      command: '> ls projects/',
      text: `[01]  neobrutalist-os     — This retro desktop you're looking at
[02]  move45              — iOS app for daily movement habits
[03]  iwt                 — Interval walking trainer (iOS)
[04]  lifespan-tracker    — Life perspective visualizer (React + Node.js)
[05]  covercraft          — Cover letter generator website`,
      speed: TYPING_SPEED_NORMAL,
      pauseAfter: PAUSE_SHORT,
    },
    {
      id: 'philosophy',
      command: '> echo $PHILOSOPHY',
      text: `Ship fast. Learn faster. Every project levels me up.
Simplicity first — elegant code over clever code.
AI is the multiplier, craft is the foundation.`,
      speed: TYPING_SPEED_NORMAL,
      pauseAfter: PAUSE_LONG,
    },
  ],
  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/AhjinGuild12', icon: 'github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jjmd', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:jantheexplorer.anyhow103@passinbox.com', icon: 'email' },
    { label: 'Website', url: 'https://www.janbmedina.com', icon: 'website' },
  ],
  projects: [
    {
      id: 'neobrutalist-os',
      name: 'neobrutalist-os',
      summary:
        'A retro desktop OS experience built with React. Explore the mini apps, play retro TV, and more.',
      oneSentence:
        'A fully interactive retro desktop operating system built in React that lets visitors explore mini-apps, play a CRT TV, and experience a complete browser-based OS.',
      techStack: ['React', 'TypeScript', 'Tailwind', 'Vite', 'Astro'],
      cta: '\u2191 Flip the switch to enter \u2192',
    },
    {
      id: 'move45',
      name: 'move45',
      summary:
        'An iOS app to build a daily 45-minute movement habit. Track streaks, set reminders, stay consistent.',
      oneSentence:
        'An iOS app that helps you build a consistent daily 45-minute movement habit with streaks, reminders, and simple progress tracking.',
      techStack: ['Swift', 'SwiftUI', 'iOS'],
      links: [
        {
          label: 'App Store',
          url: 'https://apps.apple.com/app/move45/id6744397498',
        },
      ],
    },
    {
      id: 'iwt',
      name: 'iwt',
      summary:
        'An interval walking trainer for iOS \u2014 alternating pace sessions to boost cardio fitness.',
      oneSentence:
        'A work-in-progress iOS interval walking trainer that alternates between paces to improve cardio fitness through structured sessions.',
      techStack: ['Swift', 'SwiftUI', 'iOS'],
      status: 'in-progress',
    },
    {
      id: 'lifespan-tracker',
      name: 'lifespan-tracker',
      summary:
        'A life perspective visualizer that maps your life in weeks. See how far you\u2019ve come and what lies ahead.',
      oneSentence:
        'A web tool that visualizes your entire life in weeks so you can see how much time has passed and what remains.',
      techStack: ['React', 'Node.js', 'TypeScript'],
      links: [
        {
          label: 'Website',
          url: 'https://www.lifespantracker.com',
        },
      ],
    },
    {
      id: 'covercraft',
      name: 'covercraft',
      summary:
        'A cover letter generator that crafts tailored letters from your resume and the job description.',
      oneSentence:
        'A web app that generates tailored, professional cover letters by combining your resume with the specific job description using AI.',
      techStack: ['Astro', 'React', 'TypeScript', 'AI'],
    },
  ],
};

export default portfolioData;
