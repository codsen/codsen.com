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

**{{ packageJsons["is-html-tag-opening"].lect.req }}(str, idx)**

In other words, function which takes two arguments:

| Input argument | Key value's type       | Obligatory? | Description                                 |
| -------------- | ---------------------- | ----------- | ------------------------------------------- |
| `str`          | String                 | yes         | The input string of zero or more characters |
| `idx`          | Natural number or zero | yes         | Index of an opening bracket (`<`)           |

If supplied input arguments are of any other types, an error will be thrown.

{% include "btt.njk" %}

## API - Output

It returns a boolean.

{% include "btt.njk" %}

## In Practice

This program allows us to tackle any raw unencoded brackets in HTML code. It will drive linters.

{% include "btt.njk" %}
