---
layout: package
title: csv-sort
---

## Purpose

- Sorts rows in correct order that follows the double-entry format.
- Trims the empty columns and rows (so-called 2D-Trim^).

![2D trim of a CSV contents](/images/package-csv-sort-img2.png)

In later releases, we would like to be able to recognise and fix any offset columns caused by misinterpreted commas as values.

^ 1D-Trim would be trim of a string. 3D-Trim would be some sort of spatial data trim.

{% include "btt.njk" %}

## API - Input

::: api
sort(str)
:::

In other words, it's a function which takes one input argument, string (CSV contents).

### API - Output

- Output - plain object:

| output object | Type   | Description                                                                        |
| ------------- | ------ | ---------------------------------------------------------------------------------- |
| `res`         | Array  | Array of arrays, each containing a column's value.                                 |
| `msgContent`  | String | This application outputs the messages here.                                        |
| `msgType`     | String | Can be either `alert` or `info`. That's similar to an icon on the hypothetical UI. |

If the input is anything else than a `string`, it will `throw`.
If the input is an empty string, the output object's `res` key will be equal to `[['']]`.

{% include "btt.njk" %}
