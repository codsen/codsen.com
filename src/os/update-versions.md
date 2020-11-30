---
layout: package
title: update-versions
packages:
  - npm-check-updates
---

## Quick Take

Update all dependencies of all packages in a monorepo — or single repo — to be the latest as per npm.

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
