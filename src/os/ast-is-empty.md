---
layout: package
title: ast-is-empty
---

## Rationale

Sometimes we need to check, does given AST contain only empty structures:
 - empty strings (those that trim to zero length)
 - arrays containing zero or more keys containing empty structures
 - plain objects with containing zero or more keys containing empty structures

This program helps with that.

{% include "btt.njk" %}

## API

::: api
isEmpty(something)
:::

In other words, it's a function which takes one input argument which can be of any type.

It returns boolean or `null` (in case of non-AST structure, like a function).

{% include "btt.njk" %}
