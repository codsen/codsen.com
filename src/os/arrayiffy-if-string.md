---
layout: package
title: arrayiffy-if-string
packages:
  - arrify
  - check-types-mini
---

## Purpose

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

It's main purpose is to prepare the input argument options' objects.

Also, check out [`check-types-mini`](/os/check-types-mini).

{% include "btt.njk" %}

## API

:::api
arrayiffy(something)
:::

In other words, it's a function which takes one input argument.

{% include "btt.njk" %}

## Competition

Mr. Sorhus' [`arrify`](https://www.npmjs.com/package/arrify) API is slightly different, it casts everything to array (`null` into empty array, for example). `arrayiffy-if-string` on other hand, wraps only strings into arrays, bypassing the rest (`null` into `null`, for example).

It depends what you need.

{% include "btt.njk" %}
