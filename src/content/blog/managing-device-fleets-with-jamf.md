---
title: "Managing Device Fleets with JAMF Pro — Lessons from the Trenches"
description: "Real-world insights from managing hundreds of Apple devices with JAMF Pro, including automation tips, common pitfalls, and hard-won lessons."
date: "2026-02-15"
updatedDate: "2026-03-10"
category: "Endpoint Management"
tags: ["jamf", "it-admin", "macos", "automation"]
featured: true
draft: false
---

## The Scale Problem

When you're managing 10 Macs, you can do it manually. When you're managing 500, you need a system. JAMF Pro is that system — it's the industry standard for Apple device management, and it's what I use every day in my IT admin role.

But here's the thing nobody tells you: the tool is only as good as your policies. And writing good policies is more like programming than administration.

## Zero-Touch Deployment

The holy grail of device management is zero-touch deployment. A new employee gets a Mac, opens the lid, and everything — apps, settings, security policies, printers — configures itself automatically. No IT ticket. No desk visit.

Getting there requires layering several JAMF features:

1. **PreStage Enrollments** — the device enrolls in JAMF automatically via Apple Business Manager
2. **Configuration Profiles** — push security settings, Wi-Fi configs, and restrictions
3. **Policies with Smart Groups** — install apps based on department, role, or device type
4. **Scripts** — for anything the GUI can't handle (and there's always something)

## The Script That Saved 200 Hours

One of my most impactful automations was a shell script that runs at enrollment time. It:

- Sets the computer name based on a naming convention (department code + asset tag)
- Configures the dock with role-appropriate apps
- Removes bloatware the user doesn't need
- Sets energy saver preferences for laptops vs. desktops
- Triggers a recon (inventory update) at the end

```bash
#!/bin/bash
# Set computer name from JAMF parameters
DEPT_CODE="$4"
ASSET_TAG="$5"
COMPUTER_NAME="${DEPT_CODE}-${ASSET_TAG}"

scutil --set ComputerName "$COMPUTER_NAME"
scutil --set LocalHostName "$COMPUTER_NAME"
scutil --set HostName "$COMPUTER_NAME"
```

This script runs once, takes about 90 seconds, and replaces what used to be a 45-minute manual setup process. Multiply that by the devices we deploy each month, and the math is compelling.

## Common Pitfalls

**1. Scope creep in smart groups.** Start with simple criteria. A smart group that uses 8 nested conditions is a smart group that will break in unexpected ways.

**2. Not testing policies in a staging group first.** I learned this the hard way when a "minor" configuration profile change locked 50 users out of their email. Always test on a small group first.

**3. Ignoring the JAMF logs.** When a policy fails silently, the answer is almost always in `/var/log/jamf.log`. Make friends with that file.

**4. Over-restricting users.** Security is important, but if your policies are so strict that users can't do their jobs, they'll find workarounds that are *less* secure. Find the balance.

## The Intune Comparison

I also manage Windows devices with Microsoft Intune. The philosophies are different — JAMF is Apple-native and opinionated, Intune is Microsoft-ecosystem and flexible. Both have their strengths. The key insight is that the *principles* of good device management are the same regardless of platform: automate everything, test before deploying, and monitor continuously.

## Advice for New IT Admins

1. **Learn scripting early.** Bash for macOS, PowerShell for Windows. This is the single biggest force multiplier.
2. **Document your policies.** Future you will thank past you.
3. **Join the JAMF Nation community.** Every problem you'll face, someone has solved before.
4. **Treat your MDM like code.** Version control your scripts, use staging environments, and never push to production on a Friday.
