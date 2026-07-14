---
title: Teaching My AI Agents to Update Dependencies Without Getting Me Owned
seo_title: 'Safe Dependency Updates with AI Agents: Claude Code Skills for safe PHP and JS package updates'
description: I wanted my agents to handle the most boring chore in software — dependency updates — without walking me into a supply chain attack. So I wrote a rulebook.
date: 2026-07-14 10:00:00
tags: claude code, ai agents, supply chain security, composer, npm, pnpm, skills
reading_minutes: 5
slug: 14-teaching-my-ai-agents-to-update-dependencies-safely
featured: false
---

It's not abnormal for projects to go weeks, or dare I say months, between dependency updates. And when people finally do update, they do it in full force: everything at once, without checking anything. 

That habit has always carried risk, but in the new world of AI agents doing the updating, it collides head-on with a very real threat: supply chain attacks.

## The problem: `install` is an arbitrary code execution feature

The package ecosystems we all depend on have spent the last few years demonstrating exactly how bad this can get. In September 2025, [`chalk` and `debug`](https://www.wiz.io/blog/widespread-npm-supply-chain-attack-breaking-down-impact-scope-across-debug-chalk), part of a batch of eighteen packages with over two billion combined weekly downloads, started shipping a crypto-clipper after one maintainer's npm account was phished through a fake 2FA-reset email. 

Days later, the [Shai-Hulud worm](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/) chewed through hundreds of packages on its own: its post-install script stole npm tokens from every machine it landed on and used them to publish more infected versions of itself. And a couple of weeks before either, the [Nx compromise](https://nx.dev/blog/s1ngularity-postmortem) put a post-install payload on developer machines that prompted locally installed AI coding CLIs like Claude and Gemini to hunt down wallets and credentials for exfiltration. That last one should make every agent owner sit up straight: our own agents, conscripted as burglars. The pattern is consistent: a malicious version goes live, does its damage for a few hours or days, then gets caught and pulled.

Based on this, I decided, not to do updates till a set of rules have been met. These rules, I have decided to burn them into Claude skills and let my agents deal with them.

## AI Agent Skills: paranoia as a config file

In Claude Code, a **skill** is just a markdown file with instructions the agent loads when a task matches. This gives me way to encode my hard-won paranoia *once* and have it applied *every single time*, by something that never gets tired, never gets sloppy on a Friday afternoon, and never thinks "eh, it's probably fine."

I wrote two of them, for now, `package-update-js` and `package-update-php` one for my TypeScript projects, one for my Laravel PHP ones. They differ in tooling, but they encode the same worldview. These are the rules.

## Rule 1: Research before touching anything

The first phase isn't an update at all. The agent has to research supply chain incidents from the last six months: compromised packages, typosquatting campaigns, and suspicious maintainer handovers (the exact vector behind [`event-stream`](https://blog.npmjs.org/post/180565383195/details-about-the-event-stream-incident) in 2018, when a helpful stranger offered to take over maintenance and then quietly shipped a bitcoin-wallet thief to two million weekly downloads). It cross-references those against the project's actual dependency list, and runs the registry's own audit (`composer audit`, the npm advisory data) on top. Every package gets a verdict: **SAFE**, **AFFECTED**, or **INVESTIGATE**.

Only after that report exists does anything get updated.

## Rule 2: The seven-day quarantine

This is the rule I'd tattoo on the ecosystem if I could: **never install a version that's less than seven days old.** Some package managers, like pnpm and Bun, have added support for a minimum release age to make it easy to enforce.

Compromised releases are almost always short-lived. The poisoned `chalk` and `debug` versions were live for about two hours before npm pulled them. The malicious Nx releases lasted four. The malicious version ships, someone notices, it gets yanked. A release age gate means the poisoned window passes you by entirely. Every incident named above would have sailed past me without ever touching a machine, not because I'm vigilant, but because the versions would have been too young to install.

In my pnpm projects this is a single line in `pnpm-workspace.yaml` (the value is in minutes, so 10080 is seven days):

```yaml
minimumReleaseAge: 10080
```

Since [pnpm 11](https://pnpm.io/supply-chain-security) you even get a one-day quarantine by default, and Bun has the same idea as `minimumReleaseAge` in `bunfig.toml`. Composer has no equivalent, so the PHP skill enforces it manually: it reads the release date of every candidate version and anything younger than seven days gets skipped and flagged as "too fresh, revisit later."

There's one exception, and it cuts the other way: a release that fixes a known CVE goes through immediately, quarantine or not. A vulnerability you're currently running is a bigger risk than a version that's three days old.

## Rule 3: Scripts don't run until I say so

Every Composer update runs with `--no-scripts`. Post-install scripts are the classic payload delivery mechanism that gives essentially full shell access, triggered automatically, on your machine. It's how Nx harvested SSH keys and wallets, and how Shai-Hulud found the npm tokens it used to spread. 

The skill installs the package, lets verification happen, and only regenerates autoload and runs scripts after the update has been looked at.

The JS side is ahead of Composer here. pnpm refuses to run dependency build scripts unless you explicitly allowlist them, so my `pnpm-workspace.yaml` names the only two packages allowed to execute anything at install time:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

Everything else gets installed but never runs. The same file sets `blockExoticSubdeps: true`, which stops transitive dependencies from sneaking in from random git repos or tarball URLs instead of the registry. Bun takes a similar stance and doesn't run lifecycle scripts for arbitrary dependencies by default.

## Rule 4: Pin everything, exactly

No `^`, no `~`, no ranges. Every dependency is pinned to an exact version, and updates happen through explicit `composer require package:1.2.3` or `pnpm add package@1.2.3`, never through a blanket update command. My `pnpm-workspace.yaml` backs this up with `savePrefix: ""`, which makes pnpm save exact versions instead of `^` ranges by default. This does two things: it makes every version change visible in the diff (nothing drifts silently on the next lockfile regeneration), and it means the agent can never "accidentally" pull in something I didn't sign off on.

## Rule 5: One at a time, verify after each

The skills forbid updating everything at once. Each package — or ecosystem group, since things like the Laravel core packages or the TanStack family have to move together — gets updated individually, followed immediately by verification: type checks for TypeScript, PHPStan plus the full test suite for PHP. If something breaks, we know exactly which update did it. Major versions are never applied without presenting the breaking changes and getting an explicit yes from me.

## The unreasonable effectiveness of writing rules down

Here's the thing that surprised me: the agent following these skills does updates *more* safely than I ever did by hand. I skipped changelogs when I was tired. I never once checked a package's release date before installing it. I definitely ran `composer update` with scripts enabled my entire career.

The skill doesn't skip steps, because skipping steps isn't in the file. Delegation didn't lower the safety bar — writing the rulebook forced me to raise it, and the agent holds it there. The updates happen every week now, and someone else checks them for poison first.