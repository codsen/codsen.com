---
layout: package
title: ranges-sort
---

## Quick Take

{% include "src/components/content/tldr-ranges-sort.md" %}

{% include "btt.njk" %}

## API

**{{ packageJsons["ranges-sort"].lect.req }}(arr[, opts])**

In other words, this library gives you a _function_ and you must feed an array into its first argument and also if you wish, you can feed a second argument, the _Optional Options Object_ (bracket in `[, opts]` means "optional").

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `arrOfRanges`  | Array        | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each) |
| `opts`         | Plain object | no          | Optional options go here.                                                    |

For example,

```js
[ [5, 9], [5, 3] ] => [ [5, 3], [5, 9] ]
```

This library does not mutate the inputs. In theory, a function in JavaScript could mutate its arguments, but only if they are on an "object" primitive type (an array or a plain object, for example).

{% include "btt.njk" %}

### Options object

| `options` object's key             | Type     | Obligatory? | Default | Description                                                                                                                                                                                         |
| ---------------------------------- | -------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictlyTwoElementsInRangeArrays` | Boolean  | no          | `false` | If set to `true`, all ranges must have two and only elements, otherwise error is thrown. For example, input being `[ [1, 2, 'zzz'] ]` would throw (3 elements), as well as `[ ['a'] ]` (1 element). |
| `progressFn`                       | Function | no          | `null`  | If a function is given, it will be called with natural number meaning percentage of the total work done. It's approximate and used in worker setups.                                                |

**Output:** Sorted input array. First, we sort by the first argument of each child range array, then by second.

Here is whole Optional Options Object in one place, with all defaults, in case you want to copy it:

```js
{
  strictlyTwoElementsInRangeArrays: false,
  progressFn: null
}
```

{% include "btt.njk" %}
