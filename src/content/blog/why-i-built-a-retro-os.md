---
title: "Why I Built a Retro OS in the Browser"
description: "The story behind building a neobrutalist desktop operating system as a personal portfolio — from concept to deployment."
date: "2026-02-20"
updatedDate: "2026-03-10"
category: "Projects"
tags: ["react", "astro", "portfolio", "design"]
featured: true
draft: false
---

## It Started with a Light Switch

Every developer portfolio looks the same. A hero section, some project cards, a contact form. I wanted something people would actually *remember*.

The idea was simple: what if my portfolio was an operating system? Not a screenshot of one — a working one. You boot it up, explore windows, open apps. It's a portfolio you *use*, not just read.

## Why Neobrutalism?

I was tired of the glossy, over-polished aesthetic that dominates web design. Neobrutalism — thick black borders, hard shadows, bold colors on cream backgrounds — felt like a breath of fresh air. It's intentionally rough around the edges, and that rawness makes it memorable.

The design language is simple: `3px solid black` borders, offset box shadows with zero blur, and a warm color palette (cream, rust, green, yellow). Every component follows the same rules, which makes the whole thing feel cohesive without being boring.

## The Technical Stack

- **Astro** for the static portfolio pages (About, Projects, Contact)
- **React** for the interactive OS layer (windows, taskbar, apps)
- **Tailwind CSS v4** for styling
- **No component library** — everything is custom

The key architectural decision was separating the portfolio and OS into two layers. The portfolio is plain Astro — fully static, SEO-friendly, fast. The OS is a React app that sits on top with a light-switch transition between them.

## The Light Switch Moment

The transition between portfolio and OS is a 3D CSS light switch. Flip it, and the portfolio fades out while the OS boots up with a CRT-style terminal animation. It's a small detail, but it's the thing people remember.

## Lessons Learned

1. **Ship the MVP first.** I built the portfolio pages before touching the OS. This meant I always had something deployable.
2. **CSS animations > JavaScript animations** for simple transitions. The light switch uses pure CSS `perspective` and `rotateX` transforms.
3. **Astro's island architecture** is perfect for this pattern — static HTML everywhere, React only where interactivity is needed.
4. **Neobrutalism is forgiving.** The raw aesthetic means small imperfections look intentional. This is liberating when you're shipping fast.

## What's Next

I'm adding a blog (you're reading it!), enhancing the about page with a proper bio section, and considering adding more OS apps. The beauty of this architecture is that adding new content is just creating new Astro pages or React components — the system scales naturally.

If you want to try the OS yourself, hit the **Boot OS** button in the navigation. Fair warning: you might spend more time playing with the calculator than reading my resume.
