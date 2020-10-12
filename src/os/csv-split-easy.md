---
layout: package
title: csv-split-easy
packages:
  - csv-sort
---

## Purpose

Split a string representing a CSV file into an array of arrays, so that we can traverse it later.

Acceptance Criteria:

- It should accept CSV's with or without a header row
- Header row might have different amount of columns than the rest of the rows
- Content (not header) rows might be offset and have different amount of columns from the rest
- There can be various line break types (`\n`, `\r`, `\n\r` or `\n\n\n\n\n\n\r\r\r\r\r\n\n\n\n` or whatever)
- It should ignore any values wrapped with double quotes
- It should interpret commas as part of the value if it is wrapped in double quotes
- It should accept empty fields and output them as empty strings
- It should automatically detect (dot/comma) and remove thousand separators from digit-only cells
- Minimal dependencies and 100% unit test code coverage in all ways: per-branch, per-statement, per-function and per-line.

Outside of the scope:

- Trimming the values of leading and trailing empty space. Just use `String.prototype.trim()`
- Parsing numeric values. Parse them yourself. It's outside of the scope of this lib.
- Sorting rows of double-entry, accounting CSV's. See [`csv-sort`](/os/csv-sort/).

{% include "btt.njk" %}

## API - Input

::: api
{{ packageJsons["csv-split-easy"].lect.req }}(str, [opts])
:::

In other words, it's a function which takes two input arguments, second one is optional (marked by brackets).

The API is _string-in, an array of arrays-out_.

Empty values, same as numbers too, are set as empty strings.

### API - Options

| `options` object's key                | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `removeThousandSeparatorsFromNumbers` | Boolean | no          | `true`  | Should remove thousand separators? `1,000,000` → `1000000`? Or Swiss-style, `1'000'000` → `1000000`? Or Russian-style, `1 000 000` → `1000000`? |
| `padSingleDecimalPlaceNumbers`        | Boolean | no          | `true`  | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?                                                                          |
| `forceUKStyle`                        | Boolean | no          | `false` | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?                                                                        |


Here is it in one place:

```js
{
  removeThousandSeparatorsFromNumbers: true,
  padSingleDecimalPlaceNumbers: true,
  forceUKStyle: false,
}
```

{% include "btt.njk" %}

### API - Output

Returns an array of arrays (each depicting a row). When there's nothing given, returns `[['']]`

There's always one array within the main array and there's always something there, at least an empty string.

{% include "btt.njk" %}

## The algorithm

CSV files, especially accounting-ones, are different from just _any_ files. We assume that **we don't want any empty rows** in the parsed arrays. It means, [conventional](https://github.com/sindresorhus/split-lines/) string splitting libraries would be inefficient here because after splitting, we'd have to clean up any empty rows.

The second requirement is that any of the column values in CSV can be wrapped with double quotes. We have to support _mixed_, wrapped and not wrapped-value CSV's because Metro bank used to produce these when we banked with them back in 2015.

The third requirement is that any of the values can be wrapped with double quotes and have commas within as values.

The requirements mentioned above pretty much rule out the conventional regex-based split algorithms. You [can](https://github.com/sindresorhus/split-lines/blob/master/index.js) just split by `/\r?\n/` but later you'll need to clean up possible empty rows. You can't `string.split` each row by comma because that comma might be a value, you need to check for wrapping double quotes first!

So, the best algorithm is a single `for`-loop traversal on the input string, detecting and `array.push`ing the values one by one. It worked very well on [email-comb](/os/email-comb/) where we remove unused CSS from an HTML template within around 2.5 times more characters "travelled" than there are in the file. Traversing as a string also worked well on [html-img-alt](/os/html-img-alt/) which needs only a single traversal through the string to fix all the `img` tag `alt` attributes and clean all the crap in/around them.

{% include "btt.njk" %}
