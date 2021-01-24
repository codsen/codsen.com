---
layout: package
title: detect-is-it-html-or-xhtml
---

## Purpose

It is a function which detects, does given string resemble XHTML or HTML. The format, XHTML or HTML, affects closing slashes and singleton tags.

{% include "btt.njk" %}

### API - Input

::: api
detectIsItHTMLOrXhtml(str)
:::

In other words, it's a function which takes one input argument, a string.

If the input is not String type, this package will throw an error. If the input is missing completely, it will return `null`.

{% include "btt.njk" %}

### API - Output

| Type             | Value                     | Description                   |
| ---------------- | ------------------------- | ----------------------------- |
| String or `null` | 'html', 'xhtml' or `null` | Identified type of your input |

{% include "btt.njk" %}

## Under the hood

The algorithm is the following:

1.  Look for `doctype`. If recognised, Bob's your uncle, here's your answer.
2.  IF there's no `doctype` or it's messed up beyond recognition, DO scan all singleton tags (`<img>`, `<br>` and `<hr>`) and see which type the majority is (closed or not closed).
3.  In a rare case when there is an equal amount of both closed and unclosed tags, lean for `html`.
4.  If (there are no tags in the input) OR (there are no doctype tags and no singleton tags), return `null`.

{% include "btt.njk" %}
