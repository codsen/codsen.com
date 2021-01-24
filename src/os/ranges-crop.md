---
layout: package
title: ranges-crop
---

## Purpose

{% include "src/components/content/tldr-ranges-crop.md" %}

{% include "btt.njk" %}

## API

::: api
rCrop(arr, strLen)
:::

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | `null` or _ranges_ - array of zero or more arrays | yes         | Provide an array of ranges to invert. Ranges do not have to be [sorted](/os/ranges-sort/) or [merged](/os/ranges-merge/). |
| `strLen`       | Natural number or zero | yes         | Algorithm needs to know the length of the reference string to calculate the inverted last slice's ending index.                                                                                                             |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes.

This package does not mutate the input array. It creates and **returns a new array** with ranges cropped.

{% include "btt.njk" %}
