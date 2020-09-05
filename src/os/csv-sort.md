---
layout: package
title: csv-sort
---

## Quick Take

`csv-sort` can correct the order of rows of _any_ accounting CSV files that come in [double entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) format:

![double bookkeeping example](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img1.png)

Currently (late 2017) Lloyds Bank website exports CSV files with some rows from the same day in a wrong order. This library is our attempt to fix such CSV's.

{% include "btt.njk" %}

## This library does two twings:

- Sorts rows in correct order that follows the double-entry format.
- Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](https://glcdn.githack.com/codsen/codsen/raw/63d7dc7cee9c957d3dc51d14af99b557c081a250/packages/csv-sort/media/img2.png)

In later releases, we would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.

{% include "btt.njk" %}

## Usage

```js
const cSort = require("csv-sort");
const input = `123456,Client #1 payment,,1000,1940
123456,Bought carpet,30,,950
123456,Bought table,10,,940
123456,Bought pens,10,,1000
123456,Bought chairs,20,,980
`;
const { res } = cSort(input).join(",").join("\n");
console.log(`${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${res}`);
// =>
// 123456,Client #1 payment,,1000,1940
// 123456,Bought table,10,,940
// 123456,Bought carpet,30,,950
// 123456,Bought chairs,20,,980
// 123456,Bought pens,10,,1000
```

{% include "btt.njk" %}

## API

- Input - string
- Output - plain object:

| output object | Type   | Description                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| `res`         | Array  | Array of arrays, each containing a column's value.                                 |
| `msgContent`  | String | This application outputs the messages here.                                        |
| `msgType`     | String | Can be either `alert` or `info`. That's similar to an icon on the hypothetical UI. |

If the input is anything else than a `string`, it will `throw`.
If the input is an empty string, the output object's `res` key will be equal to `[['']]`.

{% include "btt.njk" %}
