---
layout: package
title: update-versions
packages:
  - npm-check-updates
---

## Quick Take

Update all dependencies on all packages in a monorepo — or single repo — to be the latest as per npm. It's opinionated and not for everybody.

## Two kinds of workflows

From the point of dependency updating, roughly speaking, there are two groups:

- **program ecosystems sensitive to dependency updates** — front-end web development in general; SPA's like React, Angular and Vue
- **program ecosystems not sensitive to dependency updates** — Open Source JS packages in general; pure JS programs; monorepos of such programs

_This program is aimed at the second group._

The first group, React devs especially, typically use `npm outdated` and update dependencies manually, one-by-one, running test suite after each update. Web page setups are prone to breaking when dependencies are updated.

Notice how [`create-react-app`](https://github.com/facebook/create-react-app) uses fixed deps (no caret `^`) and gives instructions on how to update. Front-end world is fragile! This program is probably not very suitable to update SPA's.

Even this humble website, running on Eleventy, can't make use of `upd` — some PostCSS plugins have been breaking lately after updating, the website wouldn't even build.

On the other side of the spectrum, real JS programs (not web page SPA's), are very stable dependency-wise. In the last year, in our [monorepo](https://gitlab.com/codsen/codsen) of {{ compiledAssertionCounts.all | objectKeys | length }} JS packages, there were maybe a couple of occasions that we had to actually patch up something after `upd` updated all dependencies.

This updating CLI is a _gung-ho_ updater of all dependencies in `package.json`.

We've received requests to implement a wizard-like interface, to ask a user which deps to update and so on. But that's the wrong tool for those cases.

{% include "btt.njk" %}

## What `update-versions` does

This CLI will iterate all `package.json` in a given path and its sub-paths and process each dev- and normal dependency:

- If it's a monorepo setup and if another package in monorepo exists with such name, that version is set in `^x.x.x` format
- In all other cases, a value from npm is fetched using `pacote`, and that value is set in `^x.x.x` format

This CLI is a good idea in Lerna monorepos full of owned npm packages (where you bump versions often and effortlessly) but a bad idea in React SPA's (where single minor update might break many things and updating dependencies is a big, complex deal).

{% include "btt.njk" %}

## Opinionated part 1

Lerna `bootstrap` will not work properly if each dependency is not prefixed with `^`, as in `^x.y.z`. It's hard to manually enforce that all monorepo packages should have all dependencies in this format. `update-versions` will force this format.

**One exception** - if its dependency's value starts with `file:`.

{% include "btt.njk" %}

## Opinionated part 2

If any dependency is listed on both `dependencies` and `devDependencies`, it will be removed from the latter list. It's common sense, but we mention this "extra".

{% include "btt.njk" %}

## Opinionated part 3

If Lerna build goes wrong, a key called `gitHead` is created in `package.json`. Lerna normally cleans it up, but if things go wrong, the key might be left there. This CLI removes a key called `gitHead` if such exists, in every processed `package.json`.

{% include "btt.njk" %}
