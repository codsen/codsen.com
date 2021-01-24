---
layout: package
title: is-html-tag-opening
packages:
  - codsen-tokenizer
  - codsen-parser
  - emlint
  - is-html-attribute-closing
---

## Purpose

Detect, is an opening bracket (`<`) a tag opening? Otherwise, it might be an un-encoded text.

{% include "btt.njk" %}

## API - Input

::: api
isOpening(str, idx)
:::

In other words, function which takes two arguments:

| Input argument | Key value's type       | Obligatory? | Description                                 |
| -------------- | ---------------------- | ----------- | ------------------------------------------- |
| `str`          | String                 | yes         | The input string of zero or more characters |
| `idx`          | Natural number or zero | yes         | Index of an opening bracket (`<`)           |
| `opts`          | falsy or Plain Object | no         | Optional Options Object |

If supplied input arguments are of any other types, an error will be thrown.

{% include "btt.njk" %}

### Optional Options Object

| Options Object's key | Type of its value | Default      | Description         |
| -------------------- | ----------------- | ------------ | ------------------- |
| `allowCustomTagNames` | boolean            | `false` | Program is aware of all known HTML tag names and by default will exclude what it can't recognise. You can turn off that behaviour and make it rely on bracket/attribute patterns only. |
| `skipOpeningBracket` | boolean            | `false` | By default, algorithm expects that `idx` is on a bracket `<`. If you enable it, you can start from `idx` at the first tag's character. |

## API - Output

It returns a boolean.

{% include "btt.njk" %}

## In Practice

This program allows us to tackle any raw unencoded brackets in HTML code. It will drive [`codsen-tokenizer`](/os/codsen-tokenizer) which in turn will drive [`codsen-parser`](/os/codsen-parser) which in turn will drive [`emlint`](/os/emlint).

{% include "btt.njk" %}
