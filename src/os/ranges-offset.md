---
layout: package
title: ranges-offset
---

## API

::: api
rOffset(rangesArr, offset)
:::

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arr`  | null or Array of one or more arrays ([Ranges](/ranges/)) | no         | Provide an array of ranges to invert. Ranges do not have to be [sorted](/os/ranges-sort/) or [merged](/os/ranges-merge/). |
| `offset`       | Integer number               | no         | This number will be added to each index of every range.  |

**Output**:

- if not ranges were passed, array of one or more arrays, same input will be returned
- ELSE, offset value will be added to each index of every range

Inputs are not mutated.

{% include "btt.njk" %}

## Purpose

For example, when working on parsed tokens, we have a value, chunk of string, but we know it starts at index X, not at zero. When we return zero-based result, receiving parties need to increment every index by X. The catch is, empty [Ranges](/ranges/) are `null` so `Array.prototype.map()` can't be used. Hence this library.

{% include "btt.njk" %}
