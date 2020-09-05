---
layout: package
title: string-convert-indexes
packages:
  - detergent
---

## Idea

We are talking about indexes, the numbers used in, for example, `String.slice`.

Some libraries use JS native indexing where emoji counts as two characters.
Some libraries use indexing based on character-count where one emoji counts as one character.

This is a converter that converts between the two systems.

Highlights:

- Efficient algorithm - input string is traversed only once.
- No regexes - no potential security issues.
- Input can be a number or a numeric string or it can be **nested tree of them**. This library will convert _any_ natural numbers (set as numbers or strings). For example, `1` is fine, just like `[["1", "5"], ["5", "7"]]`.
- Untranspiled ES Modules build is wired up to `module` key in `package.json` - WebPack and Rollup will recognise and consume it.
- The main export is transpiled to ES5 (wired up to `main` key in `package.json`). You'll have no issues with `create-react-app`.

{% include "btt.njk" %}

## Usage

```js
const { nativeToUnicode, unicodeToNative } = require("string-convert-indexes");
// or
import { nativeToUnicode, unicodeToNative } from "string-convert-indexes";

// CONVERTING NATIVE JS INDEXES TO UNICODE-CHAR-COUNT-BASED

// convert the index of the character at index zero, to Unicode-character-count-based index:
const res1 = nativeToUnicode("\uD834\uDF06aa", 0);
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => 0

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res2 = nativeToUnicode("\uD834\uDF06aa", "1");
console.log(`res2 = ${JSON.stringify(res2, null, 4)}`);
// => '0' <--- notice it's retained as string. Same type as input is kept!

// at position index #2 we have first letter a
// its Unicode-based index, character count starting at zero, would be 1:
const res3 = nativeToUnicode("\uD834\uDF06aa", 2);
console.log(`res3 = ${JSON.stringify(res3, null, 4)}`);
// => 1

// at index #1 we have second surrogate of Unicode astral symbol which has index number #0
const res4 = nativeToUnicode("\uD834\uDF06aa", 3);
console.log(`res4 = ${JSON.stringify(res4, null, 4)}`);
// => 0

// convert many indexes at once - any nested data structure is fine:
const res5 = nativeToUnicode("\uD834\uDF06aa", [1, 0, 2, 3]);
console.log(`res5 = ${JSON.stringify(res5, null, 4)}`);
// => [0, 0, 1, 2]

// Also, works with numeric strings, as long as they are natural numbers or zeros.
// Observe how nested array is retained and string values are given back as strings:
const res6 = nativeToUnicode("\uD834\uDF06aa", [1, "0", [[[2]]], 3]);
console.log(`res6 = ${JSON.stringify(res6, null, 4)}`);
// => ['0', 0, [[[1]]], 2]

// CONVERTING UNICODE-CHAR-COUNT-BASED TO NATIVE JS INDEXES

const res7 = unicodeToNative("\uD834\uDF06aa", [0, 1, 2]);
console.log(`res7 = ${JSON.stringify(res7, null, 4)}`);
// => [0, 2, 3]

const res8 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);
console.log(`res8 = ${JSON.stringify(res8, null, 4)}`);
// => [2, 0, 3],

const res9 = unicodeToNative("\uD834\uDF06aa", [1, 0, 2, 3]);
// throws an error!
// that's because there's no character (counting Unicode characters) with index 3
// we have only three Unicode characters, so indexes go only up until 2, not reaching 3 we need
```

{% include "btt.njk" %}

## API

Two methods:

**nativeToUnicode(str, indexes\[, opts])**

Converts JS native indexes to indexes (used in let's say `String.slice()`), based on Unicode character count.

---

**unicodeToNative(str, indexes\[, opts])**

Converts Unicode character count-based indexes to JS native indexes.

{% include "btt.njk" %}

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                                                                                                                                                     |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                                                                                                                                |
| `indexes`      | Whatever     | yes         | It can be anything: from numbers to nested arrays or arrays of numeric strings. Only natural numbers (incl. zero) in number or string shape will be compiled and replaced with converted value. |
| `opts`         | Plain object | no          | Options object. See its API below in a separate table.                                                                                                                                          |

{% include "btt.njk" %}

### Optional Options Object

| Optional Options Object's key                          | Type of its value | Default | Description                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------ | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString` | Boolean           | `true`  | If some index is not covered by Unicode character at that index (`unicodeToNative` conversion) or by native JS string index (`nativeToUnicode` conversion), we can't reliably convert that index. We don't know how many astral characters lead to it (or not). If you want to turn off error throwing in such cases and make this package leave those uncovered indexes alone, set it to `false`. |

Here are all the defaults in one place:

```js
{
  throwIfAnyOfTheIndexesAreOutsideOfTheReferenceString: true,
}
```

{% include "btt.njk" %}

## Practical use

We have created quite a few string processing libraries, and some are using native JS indexes, while some are using Unicode character count-based indexing. This library will make them all more universal.

{% include "btt.njk" %}
