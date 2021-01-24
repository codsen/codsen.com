---
layout: package
title: html-table-patcher
---

## Idea

ESP template tags (anything, from Mailchimp to Salesforce) or templating languages (like Nunjucks), when previewed in browser, appear at wrong places. It's because templating tags are often placed between `table`, `tr` or `td` tags.

This program patches table structures, so you can visually check them easier:

![patching HTML tables](/images/package-html-table-patcher-idea.png)

{% include "btt.njk" %}

## API

When you `import { patcher, defaults, version } from "html-table-patcher"`, you get three things:

- `patcher` is the main function.
- `defaults` is the plain object, default options.
- `version` is string, coming straight from `package.json`

{% include "btt.njk" %}

## `patcher()` API - Input

::: api
patcher(str, [opts])
:::

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters        |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

{% include "btt.njk" %}

## `patcher()` API - Output

It returns a plain object:

| Key's name | Key value's type | Description                           |
| ---------- | ---------------- | ------------------------------------- |
| `result`   | String           | Result string containing patched code |

For example,

```js
{
  result: `<table>
  <tr>
    <td>
      foo
    </td>
  </tr>
  <tr>
    <td>
      bar
    </td>
  </tr>
</table>`
}
```

{% include "btt.njk" %}

## `patcher()` API - Options

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

We parse using [`codsen-parser`](/os/codsen-parser/) then traverse using [`ast-monkey-traverse-with-lookahead`](/os/ast-monkey-traverse-with-lookahead/) and record what needs to be amended using [`ranges-push`](/os/ranges-push/) and finally, apply all changes in one go using [`ranges-apply`](/os/ranges-apply/).

{% include "btt.njk" %}

## Using the GUI tap

Git clone the repo to your SSD.

Then, `cd` into the root of this package (where its `pacakge.json` is).

Then, [`serve`](https://www.npmjs.com/package/serve) the folder to _localhost_ server.

If you open the folder `/tap/` in browser, you'll get mini GUI application which is driven by Vue (local copy, no Internet needed) and also by local code of the pacher.

::: tip
Don't `serve` from inside `/tap/` folder because virtual server won't "see" the source code at the level above its root, `../dist/*`. `serve` from the root.
:::

{% include "btt.njk" %}
