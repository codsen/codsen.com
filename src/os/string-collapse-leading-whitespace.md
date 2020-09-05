---
layout: package
title: string-collapse-leading-whitespace
packages:
  - detergent
---

## Idea

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading or trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

{% include "btt.njk" %}

## API - Input

| Input argument                 | Type                        | Obligatory? | Default   | Description                                                                            |
| ------------------------------ | --------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------- |
| `str`                          | String                      | yes         | undefined | Source string to work on                                                               |
| `originalLimitLinebreaksCount` | Natural number (excl. zero) | no          | `1`       | Maximum line breaks that will be put when leading or trailing whitespace contains any. |

If first input argument is not a string, it will be just returned back, untouched.
If second input argument is zero or falsey or not a number, it will be set to `1` and application will continue as normal.

{% include "btt.njk" %}

## API - Output

String of zero or more characters. If input was not a string, same thing will be returned back, without an error.

## Quick Take

It's like custom trim — whitespace in the beginning and in the ending of a string is collapsed with an algorithm, aimed to retain only one space out of each spaces/tabs chunk; or all encountered line breaks; or all encountered non-breaking spaces.

{% include "btt.njk" %}

## Purpose

When we process strings, sometimes we take notes of what needs to be deleted/added and in the end, process the string in one go. That's opposed to mutating string over and over, where first step's output is second step's input.

Now, we call those "notes" _ranges_ and use familiar format — array and string indexes.

For example, sentence "delete character from string index 1 to index 4" is range `[1, 4]`.

To mark something as to be added, we use third element in array: `[1, 4, "replace with this instead"]`.

Now, when we process these ranges, "to add" values sometimes clash.

This program does the processing of those merged "to add" values, specifically, whitespace control — collapsing or trimming any deemed-to-be-excessive whitespace characters.

We're going to use it in [ranges-push](/os/ranges-push/).

{% include "btt.njk" %}

## The logic explained in examples

Sequence of more than one space gets replaced with single space:

```js
const coll = require("string-collapse-leading-whitespace");
const res1 = coll("zzz  ");
console.log(res1);
// Those two trailing spaces got trimmed to one space
// => "zzz "
```

Tabs and other whitespace characters which are not non-breaking spaces or new lines (LF) are replaced with spaces. There can't be more than one space at any outcome.

```js
const coll = require("string-collapse-leading-whitespace");
const res2 = coll("\t\t\t\t\t     zzz zzz\t      \t\t\t\t");
console.log(res2);
// => " zzz zzz "
```

{% include "btt.njk" %}
