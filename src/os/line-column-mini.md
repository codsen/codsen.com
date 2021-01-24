---
layout: package
title: line-column-mini
packages:
  - emlint
  - line-column
---

## Idea

The existing index-to line/column conversion program, popular and fast [`line-column`](https://www.npmjs.com/package/line-column) has many disadvantages:

- Didn't support `CR` ([old Mac](https://en.wikipedia.org/wiki/Newline#Representation)) line endings, only `CRLF` (Windows) and `LF` (modern Mac)
- Didn't include type definitions natively...
- ... and counterpart definitions on `@types/line-column` were [wrong](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/0b5bfba2994c91a099cd5bcfd984f6c4c39228e5/types/line-column/index.d.ts#L59 - notice missing `LineColumnInfo` export)
- It was converting both ways, index-to line/column and line/column-to index, which, the source being not in ES modules, meant the unused functions would end up bundled too

No support for `CR` line endings was a blocker because we will use this program on [`emlint`](/os/emlint) which is meant to catch such things.

This program, `line-column-mini`, is an alternative that only converts string index position to line/column number. It's as fast as `line-column`.

{% include "btt.njk" %}

## API - `lineCol()`

::: api
lineCol(
  input: string | number[],
  idx: number,
  skipChecks = false
)
:::

In other words, it's a function which takes three input arguments, third-one optional:

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | string or number array | yes         | Either a string or a result of `getLineStartIndexes()` |
| `idx`          | natural number or zero (a string index)   | yes         | A string index to convert |
| `skipChecks`   | boolean   | no         | Set it to `true` to skip all checks to increase perf even more |
                                            

The function returns a `null` or a plain object like:

```js
{
  line: 4,
  col: 3
}
```

Pre-calculating the line indexes using `getLineStartIndexes()` increases performance on subsequent calls — the program doesn't need to perform the first half of the calculations, finding each line start indexes.

{% include "btt.njk" %}

## API - `getLineStartIndexes()`

::: api
getLineStartIndexes(
  input: string
)
:::

In other words, it's a function which takes three input arguments, third-one optional:

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | string   | yes         | The source string |

The function returns an array of numbers, all string line start indexes, for example:

```js
[0, 4, 6, 9, 12]
```

Feed this array to `lineCol()` instead of an input string.

{% include "btt.njk" %}

## Cutting corners

The algorithm works by first extracting an array of each line start indexes, then it performs a search on that array, searching where your given index does slot in.

If you calculate that indexes array once, you can reuse it in multiple calls (as long as the string is the same), improving the performance by a magnitude.

```js
import { lineCol, getLineStartIndexes } from "line-column-mini";
import { strict as assert } from "assert";
const lineIndexes = getLineStartIndexes("abc\ndef\r\nghi\njkl");
// each call to lineCol() will cut corners:
assert.deepEqual(
  lineCol(lineIndexes, 14), 
  {
    line: 4,
    col: 2,
  }
);
assert.deepEqual(
  lineCol(lineIndexes, 15), 
  {
    line: 4,
    col: 3,
  }
);

// the full calculation would be equivalent but slower
assert.deepEqual(
  lineCol("abc\ndef\r\nghi\njkl", 15), 
  {
    line: 4,
    col: 3,
  }
);
```

{% include "btt.njk" %}

## Skipping checks

By the time you convert indexes to line/column position, you probably have done all the checks, you can guarantee that input string is not empty and so on. In those cases, you can force this program to skip the input validation checks by passing third argument as `true`:

```js
import { lineCol, getLineStartIndexes } from "line-column-mini";
import { strict as assert } from "assert";
const input = "abc\ndef\r\nghi\rjkl";
assert.deepEqual(
  lineCol(
    input, 
    5, 
    true // <-------- skips all validation checks
  ),
  {
    line: 2,
    col: 2,
  }
);
```

That should make the program run a few percent faster.

{% include "btt.njk" %}