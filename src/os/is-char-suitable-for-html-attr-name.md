---
layout: package
title: is-char-suitable-for-html-attr-name
---

## Idea

Detect, is a given character suitable for an HTML attribute's name:

```js
const isAttrNameChar = require("is-char-suitable-for-html-attr-name");
console.log(isAttrNameChar("a"));
// => true

console.log(isAttrNameChar("$"));
// => false
```

{% include "btt.njk" %}

## API - Input

**isAttrNameChar(str)** — in other words, function which takes one string argument:

| Input argument | Key value's type | Obligatory? | Description                |
| -------------- | ---------------- | ----------- | -------------------------- |
| `str`          | String           | yes         | The character to evaluate. |

This program does not throw. It just returns `false`.

If the input string is longer than `1`, its first character is used.

Zero-length string yields `false`, same like non-string type values.

{% include "btt.njk" %}

## API - Output

Boolean, `true` or `false`. Erroneous input arguments will yield `false` as well.

## PS.

If you need a comprehensive list of all possible HTML attribute names, check out [`html-all-known-attributes`](/os/html-all-known-attributes/).

{% include "btt.njk" %}

