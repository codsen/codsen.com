---
layout: package
title: object-flatten-all-arrays
---

## Purpose

Recursively traverse the deeply-cloned input and merge all plain objects within each array.

{% include "btt.njk" %}

## API

::: api
flattenAllArrays(input, [options])
:::

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

Program returns the same type thing as given, only with arrays (recursively) flattened.

{% include "btt.njk" %}

### API - Input

None of the input arguments are mutated. Their clones are being used instead.

| Input argument | Type         | Obligatory? | Description                                                                                            |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `input`        | Whatever     | yes         | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects. |
| `options`      | Plain object | no          | Set the options in this object. See below for keys.                                                    |

### Options Object

| `options` object's key                    | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ----------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `flattenArraysContainingStringsToBeEmpty` | Boolean | no          | `false` | If any arrays contain strings, flatten them to be empty thing. This is turned off by default, but it's what you actually need most of the time. |

{% include "btt.njk" %}
