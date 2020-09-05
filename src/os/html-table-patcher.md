---
layout: package
title: html-table-patcher
---

## Idea

Very often, templating languages (or PHP or Email Service Providers' back-end code) is inserted in-between the HTML table tags: between `table` and `tr`, between `tr` and `td` and so on. If you open such HTML in a browser, that inserted code will appear at wrong places because the browser will try to patch it up (but will do it incorrectly).

This library patches the HTML, so the browser in the correct places renders that code between the table cells.

The patched code is not meant for production by any means - it's for visual display in a browser only!

This library takes _string_ (hopefully some HTML) and outputs patched up _string_, so it's not an _end tool_, it's rather an API for a feature in other tools and browser plugins.

{% include "btt.njk" %}

## API

This package exports a plain objects with three keys: `{ patcher, defaults, version }`.

The first-one has a value which is the main function.
The second-one is the defaults (plain) object.
The third-one is the version taken straight from `package.json`

For example:

```js
// import ES6 style, if you want to consume this package as an ES module:
import { patcher, defaults, version } from "html-table-patcher";
const result = patcher("<table>1<tr><td>zzz</td></tr></table>");
console.log(`result = "${result}"`);
// => "<table><tr><td>1</td></tr><tr><td>zzz</td></tr></table>"
console.log(`current version of the API is: v${version}`);
// => current version of the API is: v1.0.15
console.log(`default settings are:\n${defaults}`);
// =>
// {
//   "cssStylesContent": "",
//   "alwaysCenter": false
// }
```

You can import whole package as a single variable and call its methods:

```js
// for example, using CommonJs require():
const tablePatcher = require("html-table-patcher");
// now that you have "tablePatcher", call its methods:
console.log(`tablePatcher.version = ${tablePatcher.version}`);
// => "1.0.15"
console.log(tablePatcher.patcher("<table><tr>zzz<td>a</td></tr></table>"));
// => "<table>..."
```

{% include "btt.njk" %}

### patcher() API

Main function, `patcher(str[, opts])`, takes two input arguments and returns a string of zero or more characters in length.

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters        |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

{% include "btt.njk" %}

### `patcher` options

Put options under function's second input argument, in a plain object, as per defaults:

```js
import { patcher, defaults, version } from "html-table-patcher";
const result = patcher("<table>1<tr><td>zzz</td></tr></table>", {
  // <---- options object
  cssStylesContent: "",
  alwaysCenter: false,
});
```

Here's the options object's API:

| Options Object's key | Value's type | Default value       | Description                                                                                            |
| -------------------- | ------------ | ------------------- | ------------------------------------------------------------------------------------------------------ |
| `cssStylesContent`   | string       | `""` (empty string) | Whatever you put here, will end up on every newly-added TD's inline `style` tag's value                |
| `alwaysCenter`       | boolean      | `false`             | Every newly-added TD should have its contents centered (via an inline `align="center"` HTML attribute) |

{% include "btt.njk" %}

## The algorithm

Uses home-brewn ingredients.

We parse using [`codsen-parser`](/os/codsen-parser/) then traverse using [`ast-monkey-traverse-with-lookahead`](/os/ast-monkey-traverse-with-lookahead/) and record what needs to be amended using [`ranges-push`](/os/ranges-push/) and finally, apply all changes in one go using [`ranges-apply`](/os/ranges-apply/).

{% include "btt.njk" %}

## Using the GUI tap

When developing features, it's handy to have a GUI to be able to test multiple variations of input, quickly. Using unit tests is slow because you edit unit test's input, plus output is via unit test runner which is not perfect.

We set up a rudimentary front-end GUI. To run it, run the server from the root of this package, for example, running `serve` CLI (https://www.npmjs.com/package/serve) in the terminal. After the server has started, for example on `http://localhost:9000`, navigate to folder `tap/`, for example, `http://localhost:9000/tap`. This will serve the `tap/index.html` from package's folder. It is wired up to consume the live UMD build from `dist/` folder, so it's handy to test new features.

{% include "btt.njk" %}
