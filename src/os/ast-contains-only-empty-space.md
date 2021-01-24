---
layout: package
title: ast-contains-only-empty-space
---

## Purpose

Working with [parsed](/os/codsen-parser/) HTML is always a battle against the white space. This program tells if given data structure is empty — containing only empty space or really empty.

By the way, _weird things_ which don't belong to parsed structures (_functions_, for example) will yield a result `false`.

{% include "btt.njk" %}

## API

::: api
empty(something)
:::

Input - anything. Output - Boolean.

This library does not mutate the input arguments.

{% include "btt.njk" %}
