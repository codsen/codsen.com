---
layout: package
title: update-versions
---

## Quick Take

Update all dependencies on all packages in a monorepo — or single repo — to be the latest as per npm.

## Different kinds of monorepos

Here's where life is different between front-end web dev/React/SPA and npm Open Source package worlds: open source JS programs very rarely need any intervention after updating dependencies, even after updates to new major releases. Front-end, React, SPA packages, on other hand, are very fragile — even minor version bump in a dependency can break everything.

Here it assumed you'll always want to update all dependencies to the latest and patch any bugs right away.

That's why using `upd` in Open Source npm package monorepos is a wise idea but using it in React component monorepos, it's, well, _a questionable idea_.

PS. Notice how [`create-react-app`](https://github.com/facebook/create-react-app) uses fixed deps (no caret `^`) and gives instructions how to update. Front-end world is fragile!

{% include "btt.njk" %}

## What `update-versions` does

This CLI will iterate all `package.json` in a given path and its sub-paths and process each dev- and normal dependency:

- If it's a monorepo setup and if another package in monorepo exists with such name, that version is set in `^x.x.x` format
- In all other cases, value from npm is fetched using `pacote` and that value is set in `^x.x.x` format

This CLI is a good idea in Lerna monorepos full of owned npm packages (where you bump versions often and effortlessly) but a bad idea in React SPA's (where single minor update might break many things and updating dependencies is a big, complex deal).

{% include "btt.njk" %}

## Opinionated part 1

Lerna `bootstrap` will not work properly if each dependency is not prefixed with `^`, as in `^x.y.z`. It's hard to manually enforce that all monorepo packages should have all dependencies in this format. `update-versions` will force this format.

**One exception** - if its dependency's value starts with `file:`.

{% include "btt.njk" %}

## Opinionated part 2

If any dependency is listed on both `dependencies` and `devDependencies`, it will be removed from the latter list. It's common sense but we mention this "extra".

## Opinionated part 3

If Lerna build goes wrong, key called `gitHead` is created in `package.json`. Lerna normally cleans it up but if things go wrong, key might be left there. This CLI removes key called `gitHead` if such exists, in every processed `package.json`.

{% include "btt.njk" %}

