---
layout: package
title: stristri
packages:
  - codsen-tokenizer
  - string-strip-html
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
stri(input, [opts])
:::

In other words, it's a function which takes a string and an optional options.

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

{% include "btt.njk" %}

## API - Output

The `stri()` function will return **a plain object**, for example:

```js
{
  log: {
    timeTakenInMilliseconds: 23
  },
  result: "abc click me def",
  applicableOpts: {
    html: true,
    css: false,
    text: true,
    templatingTags: false,
    js: false,
  },
  templatingLang: {
    name: "Nunjucks"
  }
}
```

Here is its API:

| Key's name       | Key value's type                                                                         | Description                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `log`            | Plain object                                                                             | Various statistics                                                                                         |
| `result`         | String                                                                                   | The result.                                                     |
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
| `js`                             | Boolean           | `true`  | Should we strip any JS code                                        |
| `reportProgressFunc`             | `null` or Function | `null` | Pass a function, progress value, `0`-`100` will be passed to it |
| `reportProgressFuncFrom`         | Natural number \[0; 100] | `0` | Starting progress percentage |
| `reportProgressFuncTo`           | Natural number \[0; 100] | `100` | Ending progress percentage |

The Optional Options Object is not validated; please take care of what values and of what type you pass.

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  html: true,
  css: true,
  text: false,
  templatingTags: false,
  js: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
}
```

{% include "btt.njk" %}
