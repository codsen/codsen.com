---
layout: package
title: is-html-attribute-closing
packages:
  - codsen-tokenizer
  - codsen-parser
  - emlint
---

## Purpose

This program detects, is a character at a given index in a given string being a **closing of an attribute**. In healthy code, that's normally a double quotes character.

This program is aimed at fixing _seriously_ broken HTML code — missing closing quotes, mismatching closing quotes, swapped quotes and unencoded "content" quotes as a part of attribute's value.

It's driving the [`codsen-tokenizer`](/os/codsen-tokenizer/) which in turn powers [`codsen-parser`](/os/codsen-parser/) which in turn powers [`emlint`](/os/emlint/).

For healthy HTML code, however, finding the closing double quotes is a trivial task.

{% include "btt.njk" %}

## API - Input

::: api
{{ packageJsons["is-html-attribute-closing"].lect.req }}(str, idxOfAttrOpening, isThisClosingIdx)
:::

In other words, function which takes three arguments:

| Input argument     | Key value's type       | Obligatory? | Description                                             |
| ------------------ | ---------------------- | ----------- | ------------------------------------------------------- |
| `str`              | String                 | yes         | The input string of zero or more characters             |
| `idxOfAttrOpening` | Natural number or zero | yes         | Index of an opening quote of an attribute               |
| `isThisClosingIdx` | Natural number         | yes         | Index we ask program to evaluate, is it a closing quote |

This program does not throw. It just returns `false`.

If anything is wrong with the input arguments, the program returns **false**. It never throws. That's because it's to be used inside other programs. Idea is, proper algorithms that will use this program will "care" only about the **truthy** case: does the given quote pass as a closing-one. Crappy input arguments yields `false`, happy days, consuming algorithms continue whatever dodgy journeys they have been making.

We don't throw errors in this program.

{% include "btt.njk" %}

## API - Output

Boolean, `true` or `false`. Erroneous input arguments will yield `false` as well.

{% include "btt.njk" %}
