---
layout: package
title: string-convert-indexes
packages:
  - grapheme-splitter
  - ast-monkey-traverse
---

## Idea

Native JS string index system is not based on grapheme count — while "a" length is one, emoji "🧢" is two-character-long, because it's two characters actually, `\uD83E` and `\uDDE2`.

In ideal world, JS string index system would count emoji as one character-long. That's so-called grapheme-based index system. Letter "a" and cap emoji "🧢" are both graphemes.

This program is a converter that converts between the two systems, it's based on [`grapheme-splitter`](https://www.npmjs.com/package/grapheme-splitter).

{% include "btt.njk" %}

## API

This program exports two functions:

**nativeToUnicode(str, indexes)**

It converts JS native indexes to indexes (used in let's say `String.slice()`), based on grapheme count.

... and ...

**unicodeToNative(str, indexes)**

It converts grapheme count-based indexes to JS native indexes.

{% include "btt.njk" %}

### API - Input

API for both functions, `nativeToUnicode()` and `unicodeToNative()` is the same:

| Input argument | Type         | Obligatory? | Description                                                                                                                                                                                     |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                                                                                                                                |
| `indexes`      | Whatever     | yes         | Normally a natural number or zero but it can be numeric string or nested AST of thereof. |

{% include "btt.njk" %}
