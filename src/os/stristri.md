---
layout: package
title: stristri
packages:
  - codsen-tokenizer
  - string-strip-html
  - ranges-merge
---

## Features

- Pick what to strip: HTML and/or CSS and/or text and/or templating tags
- Supports well: Nunjucks/Jinja, JSP, Responsys
- Should support all other templating languages and ESP templating tags
- Runs off our own [lexer](/os/codsen-tokenizer/)

PS. We have [`string-strip-html`](/os/string-strip-html/) which also strips HTML. It can't do CSS, text or templating tags but it has more granular control over the whitespace. Also, it's non-parsing so more resilient to really messed up code.

{% include "btt.njk" %}

## API - Input

::: api
{{ packageJsons["stristri"].lect.req }}(input, [opts])
:::

In other words, it's a function which takes a string and an optional options.

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

{% include "btt.njk" %}

## API - Output

The `{{ packageJsons["stristri"].lect.req }}()` function will return **a plain object**, for example:

```js
{
  result: "abc click me def",
  ranges: [
    [3, 6, " "],
    [14, 18, " "],
  ],
  applicableOpts: {
    html: true,
    css: false,
    text: true,
    templatingTags: false,
  },
  templatingLang: {
    name: "Nunjucks"
  }
}
```

Here is its API:

| Key's name       | Key value's type                                                                         | Description                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `result`         | String                                                                                   | The string output where all ranges were applied to it.                                                     |
| `ranges`         | [ranges](/ranges/): all string amendment operations that were done to achieve the result |
| `applicableOpts` | Plain object, only boolean keys from `opts`                                              | Tells which options object keys would have made a difference for this string input, if toggled differently |
| `templatingLang` | Plain object                                                                             | Pipes the output of [`detect-templating-language`](/os/detect-templating-language/)                        |

{% include "btt.njk" %}

## Optional Options Object

`opts` is a plain object. Here are all its keys:

| An Optional Options Object's key | Type of its value | Default | Description                                                        |
| -------------------------------- | ----------------- | ------- | ------------------------------------------------------------------ |
| `html`                           | Boolean           | `true`  | Should we strip HTML, XML tags and their comments                  |
| `css`                            | Boolean           | `true`  | Should we strip head CSS style tags, CSS rules and ar-rules inside |
| `text`                           | Boolean           | `false` | Should we strip text                                               |
| `templatingTags`                 | Boolean           | `false` | Should we strip any templating tags (like Nunjucks)                |

The Optional Options Object is not validated; please take care of what values and of what type you pass.

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  html: true,
  css: true,
  text: false,
  templatingTags: false,
}
```

{% include "btt.njk" %}

### Using ranges from the output

The _ranges_ from the output are compatible with [range-ecosystem libraries](/ranges/) like [`ranges-apply`](/os/ranges-apply/).

{% include "btt.njk" %}
