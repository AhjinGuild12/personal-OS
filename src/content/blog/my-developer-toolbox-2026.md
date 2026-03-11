---
title: "My Developer Toolbox in 2026"
description: "The tools, apps, and workflows I use daily for web development, iOS development, and IT administration."
date: "2026-02-10"
updatedDate: "2026-03-10"
category: "Tooling"
tags: ["tools", "productivity", "development", "workflow"]
featured: false
draft: false
---

## The Philosophy

I'm not a tool collector. Every tool in my stack earns its place by saving me real time or making my work genuinely better. If something doesn't pull its weight, it gets cut.

That said, 2026 has been a great year for developer tools. AI assistance has matured from "sometimes helpful" to "essential multiplier," and the tooling around frameworks like Astro has gotten remarkably good.

## Editor & Terminal

**VS Code** remains my daily driver. I've tried the alternatives — Cursor, Zed, the Neovim rabbit hole — but VS Code's extension ecosystem and stability keep pulling me back.

Key extensions:
- **Astro** — syntax highlighting and IntelliSense for `.astro` files
- **Tailwind CSS IntelliSense** — autocomplete for utility classes
- **ESLint + Prettier** — formatting on save, no debates
- **GitLens** — inline blame and history

For the terminal, I use the built-in VS Code terminal for project work and **iTerm2** for system administration tasks. My shell is **zsh** with a minimal prompt — I don't need a fancy theme, just git branch info and the current directory.

## AI Tools

This is where things have changed the most. I use **Claude Code** as my primary AI coding assistant. It's not just autocomplete — it's a pair programmer that understands context, reads files, runs commands, and ships actual working code.

My workflow: describe what I want at a high level, review the plan, approve, and let it execute. I stay in control of architecture decisions while Claude handles the implementation details. It's the closest thing to having a senior dev on call 24/7.

For quick questions and research, I use Claude directly in the browser. For code generation and refactoring, Claude Code in the terminal.

## Web Development

- **Astro** — my framework of choice for content-heavy sites. The island architecture is perfect: static HTML by default, interactive React only where needed.
- **React** — for complex interactive UIs. The OS layer of my portfolio is pure React.
- **Tailwind CSS v4** — utility-first CSS that actually ships less CSS than traditional approaches. The v4 `@theme` syntax is cleaner than v3's config file.
- **TypeScript** — everywhere. The type safety catches bugs before they happen.

## iOS Development

- **Xcode** — no escaping it on Apple's platform
- **Swift** — the language keeps getting better. Structured concurrency has simplified async code enormously.
- **SwiftUI** — for new projects. UIKit for anything that needs fine-grained control.

## IT Administration

- **JAMF Pro** — Apple device fleet management
- **Microsoft Intune** — Windows device management
- **PowerShell** — automation on the Windows side
- **Shell scripting (bash/zsh)** — automation on the macOS side

## Design & Assets

- **Figma** — for mockups when I need them (which is less often now that I can describe UIs to Claude)
- **SF Symbols** — Apple's icon library, free and comprehensive
- **Google Fonts** — my current favorites: JetBrains Mono for code, Public Sans for body text, Lexend Mega for headings

## The Meta-Tool: Systems Thinking

The most valuable "tool" isn't software — it's the habit of building systems instead of doing tasks. Every manual process I repeat more than twice gets automated. Every project gets documentation. Every bug gets a lesson captured.

This is what separates productive developers from busy ones: not working faster, but eliminating work that shouldn't exist in the first place.
