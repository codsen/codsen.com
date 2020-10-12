---
layout: package
title: ranges-invert
---

## API

::: api
{{ packageJsons["ranges-invert"].lect.req }}(arr, strLen, [opts])
:::

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrOfRanges`  | Array of zero or more arrays | yes         | Provide an array of ranges to invert. Ranges do not have to be [sorted](/os/ranges-sort/) or [merged](/os/ranges-merge/). |
| `strLen`       | Integer number               | yes         | Algorithm needs to know the length of the reference string to calculate the inverted last slice's ending index.                                                                                                             |
| `opts`         | Plain object                 | no          | Optional options go here.                                                                                                                                                                                                   |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes.

This package does not mutate the input array, instead it creates and returns a new array with ranges inverted.

{% include "btt.njk" %}

### Options object

| `options` object's key             | Type    | Obligatory? | Default | Description                                                                                                                                                                                                              |
| ---------------------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `strictlyTwoElementsInRangeArrays` | Boolean | no          | `false` | If set to true, all ranges must have two and only two elements, otherwise an error will be thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (because of 3 elements), as well as `[ ['a'] ]` (1 element). |
| `skipChecks`                       | Boolean | no          | `false` | If set to true, no checks will be performed. It's handy to cut corners for perf reasons when you know input ranges are clean.                                                                                            |

{% include "btt.njk" %}
