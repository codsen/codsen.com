---
layout: package
title: ranges-merge
---

## Purpose

{% include "src/components/content/tldr-ranges-merge.md" %}

{% include "btt.njk" %}

## API

::: api
rMerge(
  arrOfRanges,
  [opts]
)
:::

In other words, this library gives you a _function_, and you must feed _an array_ into its first argument and also if you wish, you can feed a second argument, a plain object (bracket in `[, opts]` means "optional").

It returns _ranges_: `null` or a new array of one or more range arrays. The original input is not mutated.

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `arrOfRanges`  | Array        | yes         | Array of zero or more arrays meaning natural number ranges (2 elements each) |
| `opts`         | Plain object | no          | Optional Options Object. See its API below.                                  |

{% include "btt.njk" %}

### Optional Options Object

| Options Object's key       | The type of its value                   | Default | Description                                                                                                                                                                                                                                                        |
| -------------------------- | --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mergeType`                | number                                  | `1`     | The type of merge. See below for explanation.                                                                                                                                                                                                                      |
| `progressFn`               | `null` or Boolean `false` or `function` | `null`  | If you supply a function here, it will be called, and an argument will be given to it, a natural number, which means percentage complete at that moment. Values will range from `1` to `99`, and finally, the main function will return the result's plain object. |
| `joinRangesThatTouchEdges` | boolean                                 | `true`  | By default, if two ranges "touch", `[[1, 2], [2, 3]]` they are joined. Set this option to `false` to stop that. Handy when reporting [separate issues](/os/string-fix-broken-named-entities/).                    |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  mergeType: 1,
  progressFn: null,
  joinRangesThatTouchEdges: true
}
```

{% include "btt.njk" %}

## `opts.progressFn`

Consider this example (notice an arrow function in the second input argument):

```js
console.log(
  rMerge(
    [
      [1, 5],
      [11, 15],
      [6, 10],
      [16, 20],
      [10, 30],
    ],
    {
      progressFn: (perc) => {
        console.log(`done: ${perc}`);
      },
    }
  )
);
//
// done: 0
// done: 1
// done: 2
// done: 3
// done: 4
// done: 4
// done: 5
// done: 21
// done: 40
// done: 60
// done: 79
// done: 99
// [[1, 5], [6, 30]]
```

Imagine, instead of `console.log`, this function could sit in a worker and report its progress, then, finally, ping the last value - result.

Whatever function you give in `opts.progressFn`, it will be called with percentage done so far. Grab that argument (`perc` in the example above) and do whatever you want with it in your function.

{% include "btt.njk" %}

## `opts.mergeType`

When merging, ranges are sorted first. Then, pairs starting from the end of the sorted array are merged. Last two becomes one, last two becomes one and so on.

The challenge is, what to do with values to add, third range array's element.

For example,

```js
const range1 = [1, 2, "a"];
const range2 = [1, 2, "b"];
```

The above ranges are "saying": replace characters in a string from index `1` to `2` with `"a"`, replace characters in string from index `1` to `2` with `"b"`.

Do we end up with `"ab"` or `"b"` or something else?

`opts.mergeType` let's you customise this behaviour:

- In default mode, opts.mergeType === `1`, clashing "to insert" values will always be concatenated (`"ab"` in example above)
- In mode opts.mergeType === `2`, if "to insert" values clash and **starting indexes are the same** — the latter value overrides the former (`"b"` in example above).

In all other aspects, `opts.mergeType` modes `1` and `2` are the same.

{% include "btt.njk" %}

## `opts.mergeType` example

Imagine a messed up piece of code: `<div>&nbbsp;</div>`. Let's say our imaginary cleaning program detected two issues with it:

- Unencoded ampersand at position `5`
- Malformed `&nbsp;` where `b` is duplicated

Range-wise, it could look like this:

```js
[
  {
    name: "bad-character-unencoded-ampersand",
    position: [[5, 6, "&amp;"]],
  },
  {
    name: "malformed &nbsp;",
    position: [[5, 12, "&nbsp;"]],
  },
];
```

Notice we have two ranges' "insert" values clashing, `[5, 6]` and `[5, 12]`, but we want latter to discard the former. That's where `opts.mergeType` setting `2` come in.

Mode `2` is the same to `1` except clashing "insert" values are resolved by deleting value on the left and keeping one on the right, in the order of sorted ranges array.

For example,

```js
const { rMerge } = require("ranges-merge");
const res1 = rMerge(
  [
    [3, 4, "aaa"],
    [3, 12, "zzz"],
  ],
  { mergeType: 1 }
);
console.log(res1);
// => [[3, 12, "aaazzz"]]

const res2 = rMerge(
  [
    [3, 4, "aaa"],
    [3, 12, "zzz"],
  ],
  { mergeType: 2 }
);
console.log(res2);
// => [[3, 12, "zzz"]]
```

In the example above, notice how ranges got sorted. The sorting algorithm first sorted by first element (`3` which was the same on both) then on a second (`4` vs `12`). The range `[3, 12, "zzz"]` came second, its third element, "what to insert", `"zzz"` clashed with first one's `"aaa"`, wiping it.

{% include "btt.njk" %}
