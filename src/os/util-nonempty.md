---
layout: package
title: util-nonempty
---

## Purpose

It is a quick utility function, to be able to detect is the input not empty.

- `null`, `unefined` yields `false`
- any number (incl. zero) yields `true`
- any array or string with length > 0 yields `true`, otherwise `false`
- plain objects with at least one key yields `true`, otherwise `false`
- all other types yield `false`

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like [parsed](/os/codsen-parser/) HTML AST), you need a library which can **recursively traverse that**. There are two options:

- If you want to check for **strict** emptiness, that is `[]` or `{}` is empty, but `{aaa: ' \n\n\n ', ' \t'}` is not, see [ast-is-empty](/os/ast-is-empty)
- If your "emptiness" definition is "everything that `String.trim()`'s to an empty string'" (this includes tabs, spaces and line breaks for example, but not letters), see [ast-contains-only-empty-space](/os/ast-contains-only-empty-space), or plain objects without keys or zero-length arrays.

{% include "btt.njk" %}

## API

::: api
nonEmpty(something)
:::

It's a function: anything-in, boolean-out.
