---
layout: package
title: lect
---

## Quick Take

It's an opinionated npm libraries maintenance CLI app.

Before we migrated README's to [codsen.com](https://codsen.com), it used to replace README's chapters, suitable for automation: installation instructions, badges and so on.

Since the migration, Nunjucks on Eleventy does the job, `lect` only generates placeholder README's and all auxiliary files:

- `rollup.config.json`
- `.prettierignore`
- `.npmignore`
- `.npmrc`
- `LICENCE`

The `babel.config.js` sits in a monorepo root so it doesn't need managing — there's only one file anyway. Same with `.prettierrc` and `.gitignore`.

{% include "btt.njk" %}
