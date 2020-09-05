---
layout: package
title: detect-is-it-html-or-xhtml
---

## Example

```js
const detect = require("detect-is-it-html-or-xhtml");
console.log(
  detect(
    '<img src="some.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz"/>'
  )
);
// => 'xhtml'
```

{% include "btt.njk" %}

## Purpose

Feed the string into this library. If it's more of an HTML, it will output a string `"html"`. If it's more of an XHTML, it will output a string `xhtml`. If your code doesn't contain any tags, or it does, but there is no `doctype`, and it's impossible to distinguish between the two, it will output `null`.

{% include "btt.njk" %}

### API - Input

This package exports a function:

**detect(str)**

| Input argument | Type   | Obligatory? | Description                                 |
| -------------- | ------ | ----------- | ------------------------------------------- |
| `htmlAsString` | String | yes         | String, hopefully containing some HTML code |

If the input is not String type, this package will throw an error. If the input is missing completely, it will return `null`.

{% include "btt.njk" %}

### API - Output

| Type           | Value                   | Description                   |
| -------------- | ----------------------- | ----------------------------- |
| String or `null` | 'html', 'xhtml' or null | Identified type of your input |

{% include "btt.njk" %}

## Under the hood

The algorithm is the following:

1.  Look for `doctype`. If recognised, Bob's your uncle, here's your answer.
2.  IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see which type the majority is (closed or not closed).
3.  In a rare case when there is an equal amount of both closed and unclosed tags, lean for `html`.
4.  If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

{% include "btt.njk" %}
