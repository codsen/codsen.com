---
layout: package
title: ranges-apply
packages:
  - ranges-push
  - ranges-merge
  - ranges-sort
---

## Purpose

{% include "src/components/content/tldr-ranges-apply.md" %}

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["ranges-apply"].lect.req }}(inputString, rangesArray, [progressFn])
:::

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `inputString`  | String | yes         | Provide an array of ranges to invert. Ranges do not have to be [sorted](/os/ranges-sort/) or [merged](/os/ranges-merge/). |
| `rangesArray`       | Array of zero or more arrays - OR - `null`                | yes         | [Ranges](/ranges/) to apply onto the string |
| `progressFn`         | Function or something _falsy_                 | no          | Provide a callback function to report the progress - numbers `0` to `100` will be fed into it as the program advances. |

::: tip
Check out [ranges-push](/os/ranges-push/) which helps to manage the `rangesArray`. It has methods to add and retrieve the ranges. Also, it helps in cases where ranges overlap and helps to maintain the sorting order.
:::

## API - Output

Function returns an amended string.

{% include "btt.njk" %}

## The algorithm

We `array.reduce` your given ranges array, slicing the input string accordingly.

The main thing is unit tests and edge case scenarios. Also, fancy optional features (upcoming) like using character enumeration counting emoji as one character.

{% include "btt.njk" %}

## In our case

Originally this library was part of [email-comb](/os/email-comb/), where we traversed HTML as a string and compiled an array of things to delete or replace later, in one go. The performance was important, so it was not a good idea to delete/replace things on the spot because each deletion slowed down the process. Instead, we traversed the string, compiled this _to-do_ array, then did the deletion/replacement on the whole thing, **once**. This appears to be the fastest way.

We're going to use this library in all our HTML processing libraries who work on HTML as on string, without parsing it.

{% include "btt.njk" %}
