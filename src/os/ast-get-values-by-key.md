---
layout: package
title: ast-get-values-by-key
packages:
  - object-path
---

## Purpose

There are many ways to work with AST's — huge nested trees of objects and arrays. This program is one of the possible ways.

Two arguments trigger the _GET mode_ — it returns an array of objects with value-path findings.

If you map that into desired values array and rerun it, this time putting desired values as a third input argument, you get the _SET mode_.

{% include "btt.njk" %}

## API

::: api
getByKey(
  input, 
  whatToFind, 
  [replacement]
)
:::

- If two arguments are given, it's **getter**. You'll receive an array of zero or more plain objects with keys: `val` and `path`, where `path` follows [`object-path`](https://www.npmjs.com/package/object-path) notation.

- If three arguments are given, it's **setter**. You'll receive a copy of original input, changed accordingly.

This library does not mutate any input arguments.

| Input argument | Type                       | Obligatory? | Description                                        |
| -------------- | -------------------------- | ----------- | -------------------------------------------------- |
| `input`        | Any                        | yes         | Something to work upon                             |
| `whatToFind`   | String or array of strings | yes         | Key names to look for. You can use [matcher](https://www.npmjs.com/package/matcher) wildcards in them. |

{% include "btt.njk" %}

## Getter

To search ("get") put two input arguments, for example:

```js
const findings = getByKey(source, ["*cles"]);
```

See the examples section. Paths are using [`object-path`](https://www.npmjs.com/package/object-path) notation. Where vanilla JS path would use brackets to address array elements: `nested[0].cutticles`, object-path notation uses dots still: `nested.0.cutticles`. The rest is the same.

{% include "btt.njk" %}

## Setter

To set values, put three input arguments, for example:

```js
const result = getByKey(source, ["*cles"], ["a", "b", "c"]);
```

The third argument, `["a", "b", "c"]` above, is the pot of values to put for each finding. The idea is that you'd use a getter first, prepare the amended values array, then feed it again into this program and change the input (AST or whatever plain object or array or whatever).

{% include "btt.njk" %}
