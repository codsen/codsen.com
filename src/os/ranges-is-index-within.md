---
layout: package
title: ranges-is-index-within
---

## Purpose

{% include "src/components/content/tldr-ranges-is-index-within.md" %}

{% include "btt.njk" %}

### API - Input

| Input argument | Type                                 | Obligatory? | Description                                          |
| -------------- | ------------------------------------ | ----------- | ---------------------------------------------------- |
| `index`        | Natural number                       | yes         | The natural number index you're checking             |
| `rangesArr`    | Array of zero or more arrays or null | yes         | Array of ranges, for example, `[ [1, 5], [10, 20] ]` |
| `options`      | Plain object                         | no          | Optional options object. See below for its API.      |

A wrong type will cause `throw`s.

{% include "btt.njk" %}

### Options object

| options object's key              | Type of its value | Default | Description |
| --------------------------------- | ----------------- | ------- | ----------- |
| `inclusiveRangeEnds`              | Boolean           | `false` | That is, do we consider `1` or `5` to be within range `[1, 5]`? The default answer is no, but if set to `true`, the answer would be yes. |
| `returnMatchedRangeInsteadOfTrue` | Boolean           | `false` | If set to `true`, instead of result `true` it will return the matched range. `false` is still used as a negative answer. It's handy when you want to know **which** range it matched. |

{% include "btt.njk" %}

### API - Output

Boolean `true`^ or `false`, answering the question, is the given `index` found within any of the ranges.

^ If `opts.returnMatchedRangeInsteadOfTrue` is set to `true`, positive result will be the range which was matched. Negative result would be still `false`.

{% include "btt.njk" %}

## Example

Simple encoding using default settings:

```js
const isIndexWithin = require("ranges-is-index-within");
let res1 = isIndexWithin(79, [
  [5, 10],
  [15, 20],
  [25, 30],
  [35, 40],
  [45, 50],
  [55, 60],
  [65, 70],
  [75, 80], // <-- "true", - "79" would be within this range, answer is "true"
  [85, 90],
  [95, 100],
  [105, 110],
  [115, 120],
  [125, 130],
]);
console.log(res1);
// > true

let res2 = isIndexWithin(31, [
  [5, 10],
  [15, 20],
  [25, 30], // <-- "false" because "31" falls in between this and next range. It's not within.
  [35, 40],
  [45, 50],
  [55, 60],
  [65, 70],
  [75, 80],
  [85, 90],
  [95, 100],
  [105, 110],
  [115, 120],
  [125, 130],
]);
console.log(res2);
// > false

let res3 = isIndexWithin(
  30,
  [
    [5, 10],
    [15, 20],
    [25, 30], // <-- "true" because opts.inclusiveRangeEnds=true and "30" is on the edge of the range.
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
  { inclusiveRangeEnds: true }
);
console.log(res3);
// > true

let res4 = isIndexWithin(
  30,
  [
    [5, 10],
    [15, 20],
    [25, 30], // <-- "true" because opts.inclusiveRangeEnds=true and "30" is on the edge of the range.
    [35, 40],
    [45, 50],
    [55, 60],
    [65, 70],
    [75, 80],
    [85, 90],
    [95, 100],
    [105, 110],
    [115, 120],
    [125, 130],
  ],
  { inclusiveRangeEnds: true, returnMatchedRangeInsteadOfTrue: true }
);
console.log(res4);
// > [25, 30]  <------ ! not Boolean, but the range itself.
```

{% include "btt.njk" %}

## The algorithm

We tried [Binary Search algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm) but native `Array.prototype.find()`/`Array.prototype.some()` are around 85x faster.

{% include "btt.njk" %}
