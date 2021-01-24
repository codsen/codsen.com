---
layout: package
title: object-set-all-values-to
---

## Purpose

Take any input: nested array, nested plain object or whatever really, no matter how deeply nested. Walk through it recursively and if you find any plain objects, assign **all their keys** to a given second input's argument OR default, `false`.

It does not mutate the input arguments. Operations are done on a cloned input.

We needed this library to [overwrite](/os/json-comb-core/) all values to be `false` on JSON schema objects, so that later when we copy from key/value pairs from schema, values are equal to `false` and we don't need to prep them further.

This library is well-tested and is being used in commercial projects.

{% include "btt.njk" %}

## API

::: api
setAllValuesTo(input, value)
:::

In other words, it's a function which takes two input arguments, both obligatory.

### API - Input

| Input argument | Type     | Obligatory? | Default     | Description                                                                                            |
| -------------- | -------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| `input`        | Whatever | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some plain objects. |
| `value`        | Whatever | no          | `false`     | Assign all the found plain object values to this                                                       |

{% include "btt.njk" %}

### API - Output

Same thing that you gave in the first argument, except with values **overwritten** (where applicable).
