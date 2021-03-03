---
layout: package
title: lect
---

## Quick Take

It's an opinionated npm libraries maintenance CLI app.

`lect` generates many files for each monorepo package:

- `README.md`
- `rollup.config.json`
- `.prettierignore`
- `.npmignore`
- `tsconfig.json`
- `.npmrc`
- `LICENCE`
- compiles the examples API, `/packages/*/examples/api.json` 
- [Semaphore CI](https://semaphoreci.com/) build script

{% include "btt.njk" %}
