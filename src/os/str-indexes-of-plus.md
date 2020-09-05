---
layout: package
title: str-indexes-of-plus
---

## Idea

Search for a string in another string. Return the array of indexes of any findings. Astral character-friendly. Allows to optionally offset the starting point of the search (3rd argument).

## Usage

```js
const indx = require("str-indexes-of-plus");
var res1 = indx("abczabc", "abc");
console.log("res1 = " + JSON.stringify(res1, null, 4));
// => [0, 4]

// works with strings containing emoji too:
var res2 = indx("ab🦄", "🦄");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => [2]

// you can offset the starting point, from which the checking commences.
// observe the third input argument:
var res3 = indx("abczabc", "abc", 3);
console.log("res3 = " + JSON.stringify(res3, null, 4));
// => [4]
```

{% include "btt.njk" %}

## API

**indx(str, searchValue\[, fromIndex])**

Returns an array of zero or more numbers, each indicating the index of each finding's first character. Unicode astral characters are counted correctly, as one character-long.

{% include "btt.njk" %}

#### str

Type: `string`

First input argument — the string in which you want to perform a search.

#### searchValue

Type: `string`

Second input argument — the string you're looking for.

#### fromIndex

Type: A natural number or zero. `number` or `string`.

An optional third argument - offset index from which to start searching.

## The algorithm

We came up with a unique algorithm. It follows the way how we would search for strings: iterate through the given string, looking for the first letter. If found, check does second letter match second finding's letter. If it matches, continue matching each consecutive letter. In anything mismatches, start from new, continuing to iterate along the input string.

{% include "btt.njk" %}
