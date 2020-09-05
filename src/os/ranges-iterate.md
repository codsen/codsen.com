---
layout: package
title: ranges-iterate
---

## Quick Take

{% include "src/components/content/tldr-ranges-iterate.md" %}

{% include "btt.njk" %}

## API

**{{ packageJsons["ranges-iterate"].lect.req }}(str, ranges, cb\[, offset])**

In other words, this library gives you a synchronous _function_ (exported as a default) and you must feed three obligatory arguments and fourth, optional (marked with square brackets).

| Input argument | Type                                              | Obligatory? | Description                                                              |
| -------------- | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------ |
| `str`          | `string`                                          | yes         | The input string we are operating on                                     |
| `ranges`       | `null` or `array` of zero or more arrays (ranges) | yes         | The ranges gathered so far                                               |
| `cb`           | Something falsey or a `function`                  | yes         | Callback function to be able to consume the indexes and character values |
| `offset`       | String index, a natural number                    | no          | You can cut corners and start operations later in the string             |

{% include "btt.njk" %}
