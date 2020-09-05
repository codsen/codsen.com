---
layout: package
title: is-html-tag-opening
---

## Quick Take

Detect, is an opening bracket (`<`) a tag opening? Otherwise, it might be an un-encoded text.

```js
const isOpening = require("is-html-tag-opening");
const text = `<span>a < b<span>`;
console.log(is(text, 0)); // opening span tag's opening
// => true
console.log(is(text, 8)); // bracket between a and b
// => false
console.log(is(text, 11)); // closing span tag's opening
// => true
```

{% include "btt.njk" %}

## API - Input

**isOpening(str, idx)**

In other words, function which takes two arguments:

| Input argument | Key value's type       | Obligatory? | Description                                 |
| -------------- | ---------------------- | ----------- | ------------------------------------------- |
| `str`          | String                 | yes         | The input string of zero or more characters |
| `idx`          | Natural number or zero | yes         | Index of an opening bracket (`<`)           |

If supplied input arguments are of any other types, an error will be thrown.

{% include "btt.njk" %}

## API - Output

Boolean, `true` or `false`.

{% include "btt.njk" %}

## Purpose

This program tries to tackle as much broken code cases as possible. It recognises various cases of unclosed or broken tags. For example:

```
< br/>
< br / >
a < b
let's say that a < b and c > d.
<a b="ccc"<d>
```

This program is also aware of all known HTML tags and will use that information in its algorithm.

But that comes at perf cost. In theory, same program but without broken code support would be `String.indexOf("<")`. If the source can't and won't ever contain unencoded raw brackets, if the source bracket pairs will always be closed, every opening bracket `<` IS a tag opening!
