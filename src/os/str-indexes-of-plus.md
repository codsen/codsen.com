---
layout: package
title: str-indexes-of-plus
packages:
  - str-indexes-of
---

## Compared to Others

| method / program | returns | index system based on |
| ---- | ------- | ------------ |
| [`String.prototype.indexOf()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf) | index where the first finding starts | code point count |
| [`str-indexes-of`](https://www.npmjs.com/package/str-indexes-of) | array of indexes where each finding starts | code point count |
| <span class="emoji">📦</span> This package, <br/> `str-indexes-of-plus` | array of indexes where each finding starts | grapheme count |

See [this](https://mathiasbynens.be/notes/javascript-unicode) article about Unicode, graphemes and code points.

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["str-indexes-of-plus"].lect.req }}(
  str,
  searchValue,
  [fromIndex]
)
:::

In other words, it's a _function_ which takes three arguments, third one is optional (marked by square brackets).

**Output**: an array of zero or more numbers, each indicating the index of each finding's first character. Unicode astral characters are counted, as one character-long.

| Input argument | Type                         | Obligatory? | Description                                                                                                                                                                                                                 |
| -------------- | ---------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`  | string | yes         | Source string, where to search. |
| `searchValue`       | string               | yes         | What to search for. |
| `fromIndex`         | natural number or zero | no          | If set, the searching will start from this index. |

{% include "btt.njk" %}

## Trivia

Roy asked [~Shinnn](https://www.npmjs.com/~shinnn) is it all right to create grapheme-count-based-index alternative of his [`str-indexes-of`](https://www.npmjs.com/package/str-indexes-of) and he said it's OK.
