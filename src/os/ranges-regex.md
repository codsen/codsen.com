---
layout: package
title: ranges-regex
---

## Purpose

{% include "src/components/content/tldr-ranges-regex.md" %}

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["ranges-regex"].lect.req }}(
  regexp,
  str,
  [replacement]
)
:::

In other words, it's a function which takes three input arguments, third one is optional (marked with square brackets).

| Input argument | Type               | Obligatory? | Description                                                                                       |
| -------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `regexp`       | Regular expression | yes         | Provide the regexp to apply onto a string                                                         |
| `str`          | String             | yes         | Provide a string upon which to match the regex                                                    |
| `replacement`  | String or `null`   | no          | If you want to add a third argument on every of the finding's third argument values, put it here. |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes OR `null`.

::: tip
You can use all the features of regexes: global, case insensitive flags and so on.
:::

This package does not mutate its inputs.

If the input arguments' types are incorrect or absent, library will `throw` an error.

{% include "btt.njk" %}
