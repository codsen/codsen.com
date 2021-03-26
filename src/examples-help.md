---
layout: post
title: How to Try Code Examples
---

{# {% from "macros/heading.njk" import heading %} #}

{% set oneStickerOnlyPlease = true %}

If you want to tinker with examples, you have many options on how to run the code:

::: tip
At the time of writing, native Node _ES Modules_ support is still flaky, using plain repl call like `node leave-only-html.js` might not work — use [`esm`](https://www.npmjs.com/package/esm) which we call via `-r` flag like this: `node -r esm leave-only-html.js`.
:::

1. If you `git clone` the monorepo and `npm i` and then `cd` into the package's folder, you can execute each example file using a _Node repl_, for example: `node -r esm leave-only-html.js`. If there are no errors, nothing should happen — asserts succeeded!

2. The `package.json` of each program has an npm script `test:examples` which calls the [example test runner](https://github.com/codsen/codsen/blob/main/scripts/test-examples.js) which gives some UI in the terminal, you get feedback of each example testing outcome. To run it, `cd` into a package's folder in cloned monorepo and `npm run test:examples`.
3. You can use [CodeSandbox](https://codesandbox.io/) — copy-paste the example code into the sandbox, manually adding all imported dependencies.
4. You could use [Runkit](https://runkit.com/), but it doesn't support ES Modules (`import`), so you'd have to replace all imports with CommonJS equivalents, with `const foo = require("bar")`.
