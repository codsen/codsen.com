---
layout: package
title: util-nonempty
---

## Purpose

It is a quick utility function, to be able to detect is the input not empty.

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like parsed HTML [AST](/os/codsen-parser/)), you need a library which can **recursively traverse that**. There are two options:

- If you want to check for **strict** emptiness, that is `[]` or `{}` is empty, but `{aaa: ' \n\n\n ', ' \t'}` is not, see [ast-is-empty](/os/ast-is-empty)
- If your "emptiness" definition is "everything that `String.trim()`'s to an empty string'" (this includes tabs, spaces and line breaks for example, but not letters), see [ast-contains-only-empty-space](/os/ast-contains-only-empty-space), or plain objects without keys or zero-length arrays.

{% include "btt.njk" %}

## API

**{{ packageJsons["util-nonempty"].lect.req }}(something)**

It's a function: anything-in, boolean-out.
