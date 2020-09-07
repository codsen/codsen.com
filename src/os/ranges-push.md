---
layout: package
title: ranges-push
---

## Quick Take

{% include "src/components/content/tldr-ranges-push.md" %}

{% include "btt.njk" %}

## API

This package exports a constructor, `Ranges` (with uppercase), which you call using `new` to create class instances:

```js
const Ranges = require("ranges-push");
let ranges = new Ranges();
// or, with Optional Options Object:
let ranges = new Ranges({ limitToBeAddedWhitespace: true });
let ranges = new Ranges({ mergeType: 2 });
```

The `ranges` (with lowercase) is your [class](https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md#classes) which contains your _ranges_ and gives you methods to get/set the values.

You can also provide an Optional Options Object when creating the class:

{% include "btt.njk" %}

### Optional Options Object

| options object's key       | Type of its value | Default | Description                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limitToBeAddedWhitespace` | Boolean           | `false` | If set to `true`, if to-be-added string (3rd element in the range array) contains only whitespace (`trim()`s to empty string), replace it with: either line break `\n` (if there's at least one line break or `\r` in it) or with a single space (all other cases). Same applies when we have a string, surrounded by whitespace. That whitespace will be replaced with space or line break. |
| `limitLinebreaksCount`     | Number            | `1`     | This is the number of maximum consecutive line breaks allowed in collapsed result. Practically, setting this to `2` would allow single blank lines in the output (for example, between paragraphs).                                                                                                                                                                                          |
| `mergeType`                | Number            | `1`     | Default mode, `1` is concatenate clashing values, but alternative mode `2` is newer value overwrites older. See detailed explanation [below](#optsmergetype)                                                                                                                                                                                                                                 |

The Optional Options Object is validated by [check-types-mini](/os/check-types-mini/), so please behave: the settings' values have to match the API and settings object should not have any extra keys, not defined in the API. Naughtiness will cause error `throw`s. We know, it's strict, but it prevents any API misconfigurations and helps to identify some errors early-on.

Here is the Optional Options Object in one place (in case you ever want to copy it):

```js
{
  limitToBeAddedWhitespace: false,
  limitLinebreaksCount: 1,
  mergeType: 1
}
```

You then interact with your newly-created ranges class by calling its _methods_:

{% include "btt.njk" %}

## `opts.mergeType`

When merging, ranges are [sorted](/os/ranges-sort/) first. Then, pairs starting from the end of the sorted array are [merged](/os/ranges-merge/). Last two becomes one, last two becomes one and so on.

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

Practically, you activate the mode when you create the class:

```js
const Ranges = require("ranges-push");
let rangesArr = new Ranges({ mergeType: 2 });
```

From there on, when you push to `rangesArr`, clashing values will be resolved according to "mergeType" rules.

{% include "btt.njk" %}

### ranges.add(from, to[, str])

alias - **.push**

| Input argument | Type                    | Obligatory? | Description                                                                                                                                         |
| -------------- | ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deleteFrom`   | Integer, natural number | yes         | Beginning index of the slice                                                                                                                        |
| `deleteTo`     | Integer, natural number | yes         | Ending index of the slice                                                                                                                           |
| `str`          | String                  | no          | If you want not only to delete but [insert](/os/ranges-apply/) something, put that new string here |

If you want only to insert and you don't want to delete anything, put both `deleteFrom` and `deleteTo` **the same**.

- If the arguments are of a wrong type, it will `throw` and error.
- Also, if you _overload_ it, providing fourth, fifth input argument and so on if will `throw` too. It's for your safety because it might flag up something wrong happening in your code.

In essence, `.add()` behaves two ways:

1.  `.add(1, 2)`, later `.add(2, 3)` will not create a new `[2, 3]` but extend `[1, 2]` into `[1, 3]`. This is to save time because we prevent bunch of connecting ranges from being recorded as separate ones.
2.  all other cases, if it's not an exact extension of a previous range, new range is added into the array. `.add(2, 3)`, later `.add(1, 2)` will result in `[ [2, 3], [1, 2] ]`. The `.current()` method will clean it later. Read on...

Additionally, when `.add` merges two ranges and one completely overlaps another, the superset (larger) range will wipe out any "to-add" (third-argument) values of the subset (smaller) range(s).

You can use either `.add` or `.push`, both do the same thing.

{% include "btt.njk" %}

### ranges.current()

This method fetches the **current** state of your ranges array, sorts and **merges it**, then outputs it to you.

Result is either

1.  array of slice range arrays like:

```js
[
  // notice it's an array of arrays
  [10, 20, " insert this string after deleting range between indexes 10 & 20"][
    (30, 50)
  ],
  [51, 55],
];
```

2.  or `null` if it's still empty and nothing has been added since.

`.current()` will do the sorting first by `deleteFrom` (first element), then, sorting by `deleteTo` (second element), **then**, it will merge any ranges that overlap.

```js
[[4, 5], [1, 2]] => [[1, 2], [4, 5]] // no overlap, so just sorted by 1st element
```

```js
[[2, 5], [2, 3], [1, 10]] => [[1, 10]] // there was an overlap, so ranges were merged
```

In theory, since `.current()` does not mutate our ranges array in the memory, you could add more ranges and call `.current()` again, this time possibly with a slightly different result. However, be aware that merging will lose some of the data in the ranges.

Imagine: `[ [10, 20, 'aaa'], [10, 15, bbb]]` was merged by `.current`, and became `[ [10, 20, 'bbbaaa'] ]`. Now if you use this range in [ranges-apply](/os/ranges-apply/) to amend the string, but then later discover that you left out the range `[12, 17, ccc]`, that is, you wanted to delete between indexes 12 and 17, and then insert `ccc`, you'll be in trouble. Since you amended your string, you can't "stick in" `ccc` between original `bbb` and `aaa` — your desired place to add `ccc`, at index 17 has been "merged" by `bbb` and `aaa`.

**Conclusion**: complete all your operations, `add()`-ing ranges. Then, fetch your master ranges array _once_, using `.current` and feed it into [ranges-apply](/os/ranges-apply/). At this point don't do any more `add()`ing, or if you really want that, process the ranges you've got using [ranges-apply](/os/ranges-apply/), `wipe()` everything and start `add()`ing again.

{% include "btt.njk" %}

### ranges.wipe()

Sets your ranges array to `null`. Right after that `ranges.current()` will yield `null`. You can then start `add`-ing again, from scratch.

### ranges.replace(newRanges)

If you have a new set of ranges and you want to replace existing set, instead of using `ranges.wipe()` and then iterating through all new ranges and adding them one-by-one, you can simple replace everything using `ranges.replace()`. For example:

```js
const oldRanges = new Ranges();
oldRanges.add(1, 2, "a");
oldRanges.add(3, 4, "b");
oldRanges.add(9, 10);
console.log(oldRanges.current());
// => [[1, 2, "a"], [3, 4, "b"], [9, 10]]

// now replace them with new ranges:
oldRanges.replace([[6, 8, "zzz"]]);
console.log(oldRanges.current());
// => [[6, 8, "zzz"]]
```

{% include "btt.njk" %}

### ranges.last()

Outputs:

1.  the last ranges' array from the ranges array, for example:

```js
[51, 55];
```

2.  Or, if there's nothing in the ranges array yet, `null`.

---

PSST. Later, feed your ranges array into [ranges-apply](/os/ranges-apply/) to delete/replace all those ranges in your string.

{% include "btt.njk" %}

## In our case

Originally this library was part of [email-comb](/os/email-comb/), but we tore it off and placed into a separate (this) library when we needed the same function in [html-img-alt](/os/html-img-alt/). Since then, [Detergent](/os/detergent/) also uses it, so its unit test wouldn't take an hour, calculating all possible combinations of the options, while input string is mutated again and again in the for a loop.

{% include "btt.njk" %}
