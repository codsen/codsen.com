---
layout: package
title: ast-get-values-by-key
packages:
  - object-path
---

## Purpose

There are many ways to work with AST's — huge nested trees of objects and arrays. This program is one of possible ways.

Two arguments triggers the _GET mode_ — it returns an array of objects with value-path findings.

If you map that into desired values array and run it again, this time putting desired values as third input argument, you get the _SET mode_.

{% include "btt.njk" %}

## API

**{{ packageJsons["ast-get-values-by-key"].lect.req }}(input, whatToFind, replacement)**

- If two arguments are given, it's **getter**. You'll receive an array of zero or more plain objects with keys: `val` and `path`, where `path` follows [`object-path`](https://www.npmjs.com/package/object-path) notation.

- If three arguments are given, it's **setter**. You'll receive a copy of original input, changed accordingly.

This library does not mutate any input arguments.

| Input argument | Type                       | Obligatory? | Description                                        |
| -------------- | -------------------------- | ----------- | -------------------------------------------------- |
| `input`        | Any                        | yes         | Something to work upon                             |
| `whatToFind`   | String or array of strings | yes         | The Optional Options Object, see below for its API |


{% include "btt.njk" %}
