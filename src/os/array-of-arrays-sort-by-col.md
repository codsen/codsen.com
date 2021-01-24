---
layout: package
title: array-of-arrays-sort-by-col
---

## Purpose

Sorts array of arrays by any column (default is first element, zero'th column index).

The algorithm is tailored for integer-only values.

Consider this arrangement:

<pre>
<code>
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 9 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 0
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 8 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 2
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 7 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 5
</code>
</pre>

In JS code, that's:

```js
[[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]];
```

Default sorting is against first column (zero'th index), so result would be:

<pre>
<code>
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 7 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 5
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 8 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 2
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 9 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 0
1 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D;
</code>
</pre>

Output in JS code:

```js
[[1, 7, 5], [1, 8, 2], [1, 9, 0], [1]];
```

Rules:

- When we compare two rows, first we compare by particular column (default is first, zero-index column). Then, if values are equal, we look around and compare by those values. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. First, compare left-side, then right-side. Then, if values are equal even there, we "ripple" outwards. ...
- We accept arrays, normalised into a matrix, with absent value fillings set to `null`. Same behaviour.

<pre>
<code>
1 &#x2D;&#x2D;&#x2D;&#x2D; 7 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 5
1 &#x2D;&#x2D;&#x2D;&#x2D; 8 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 2
1 &#x2D;&#x2D;&#x2D;&#x2D; 9 &#x2D;&#x2D;&#x2D;&#x2D;&#x2D;&#x2D; 0
1 &#x2D;&#x2D;&#x2D; null &#x2D;&#x2D; null
</code>
</pre>

{% include "btt.njk" %}

### API - Input

::: api
sortByCol(arr, [index])
:::

In other words, it's a function which takes two input arguments:

| Input argument | Type                                            | Obligatory? | Description                                                                                                      |
| -------------- | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `arr`          | Array of zero or more arrays                    | yes         | Source of data to put into an AST                                                                                |
| `index`        | Natural number or zero, like a number or string | no          | By which column should we match the subarrays (rows)? The default is `0` or the first element of each sub-array. |

{% include "btt.njk" %}

### API - Output

Same array of arrays, only sorted.

{% include "btt.njk" %}
