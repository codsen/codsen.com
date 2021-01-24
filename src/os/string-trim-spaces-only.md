---
layout: package
title: string-trim-spaces-only
packages:
  - ranges-apply
  - ranges-push
  - string-collapse-leading-whitespace
  - string-strip-html
---

## API

::: api
trimSpaces(str, [opts])
:::

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `input`        | String           | yes         | Input string you want to trim some way             |
| `opts`         | Plain object     | no          | An Optional Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n.

{% include "btt.njk" %}

### Optional Options Object

| An Optional Options Object's key | Type of its value | Default | Description                                                     |
| -------------------------------- | ----------------- | ------- | --------------------------------------------------------------- |
| `classicTrim`                    | Boolean           | `false` | If set to `true`, trimming becomes the same as `String.trim()`. |
| `cr`                             | Boolean           | `false` | Should we trim the carriage returns (CR)                        |
| `lf`                             | Boolean           | `false` | Should we trim the line breaks (LF)                             |
| `tab`                            | Boolean           | `false` | Should we trim tabs                                             |
| `space`                          | Boolean           | `true`  | Should we trim spaces                                           |
| `nbsp`                           | Boolean           | `false` | Should we trim raw non-breaking spaces                          |

Here is the default options object in one place:

```js
{
  classicTrim: false,
  cr: false,
  lf: false,
  tab: false,
  space: true,
  nbsp: false
}
```

{% include "btt.njk" %}

### API - Function's Output

Since `v.2`, the output is a plain object:

| Key name | Key value's type                  | Description                                                             |
| -------- | --------------------------------- | ----------------------------------------------------------------------- |
| `res`    | String or zero or more characters | Result string after trimming.                                           |
| `ranges` | Array of zero or more arrays      | If we trimmed anything, each slice range will be added into this array. |

{% include "btt.njk" %}

## `opts.classicTrim`

`String.trim()` returns string but sometimes you need just ranges of what would be trimmed, to merge them into compiled ranges array and to process later, along everything else. In those cases, use `opts.classicTrim`. If you need just _string_ value, it's not worth to use this function as a substitute for `String.trim()` for performance reasons.

{% include "btt.njk" %}
