---
layout: package
title: string-collapse-leading-whitespace
packages:
  - detergent
---

## Purpose

This program is aimed to process strings before concatenating them. It collapses the leading and trailing whitespace, if any, so that later the result looks reasonable.

For example, [`ranges-push`](/os/ranges-push/) uses it to merge to-be-inserted chunks of string.

{% include "btt.njk" %}

## API

::: api
collWhitespace(str, [lineBreakLimit])
:::

In other words, it's a function which takes two input arguments, second one being optional (marked by square brackets).

{% include "btt.njk" %}

## API - Input

| Input argument                 | Type                        | Obligatory? | Default   | Description                                                                            |
| ------------------------------ | --------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------- |
| `str`                          | String                      | yes         | undefined | Source string to work on                                                               |
| `lineBreakLimit` | Natural number or zero | no          | `1`       | If whitespace contains linebreaks, it will be replaced by those linebreaks, count limited to this value |

If first input argument is not a string, it will be just returned back, untouched.
If second input argument is zero or falsy or not a number, it will be set to `1` and application will continue as normal.

{% include "btt.njk" %}

## API - Output

String of zero or more characters. If input was not a string, same input will be returned back, without an error.
