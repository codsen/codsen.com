---
layout: package
title: ast-compare
packages:
  - ast-loose-compare
---

## Purpose

It compares data structures, especially AST.

We use it to compare two parsed HTML/CSS trees or their branches, but you can compare anything, it will recursively traverse arrays too. For example, it powers [ast-delete-object](/os/ast-delete-object/) which also works on AST's.

The default mode is similar to [Tap](https://node-tap.org/) asserts `t.match` and the option `opts.matchStrictly` is similar to `t.sameStrict`.

{% include "btt.njk" %}

## API

**compare(bigObj, smallObj, [opts])**

In other words, it's a function which takes three input arguments, third one being optional (marked by square brackets).

It returns a boolean. This library will not mutate the input arguments.

{% include "btt.njk" %}

### API - Input

| Input argument | Type                            | Obligatory? | Description                         |
| -------------- | ------------------------------- | ----------- | ----------------------------------- |
| `bigObj`       | Array or Plain object or String | yes         | Super set, larger thing.            |
| `smallObj`     | Array or Plain object or String | yes         | A set of the above, smaller thing.  |
| `opts`         | Plain object                    | no          | A plain object containing settings. |

- If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
- Otherwise, if there's a mismatch or something wrong with input args, it returns `false`.

{% include "btt.njk" %}

### Options object

| `options` object's key  | Type    | Obligatory? | Default | Description                                                                                                                                                                     |
| ----------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hungryForWhitespace`   | Boolean | no          | `false` | Any chunk of whitespace (tabs, spaces, line breaks and so on) will match any other chunk of white space.                                                                        |
| `matchStrictly`         | Boolean | no          | `false` | When you want to match like `===`.                                                                                                                                              |
| `verboseWhenMismatches` | Boolean | no          | `false` | When set to `true`, instead of `false` the output will be a string with a message explaining what didn't match. It's for cases when it's important to report what didn't match. |

{% include "btt.njk" %}

### API - Output

**Positive answer** is always boolean `true`.

**Negative answer** is either:

 - boolean `false` (default, `opts.verboseWhenMismatches` off) OR
 - _string_, explaining what didn't match (`opts.verboseWhenMismatches` on)

{% include "btt.njk" %}

## opts.verboseWhenMismatches

Sometimes you just want a yes/no answer is something a subset or equal to something. But sometimes, the whole point of comparison is to inform the user _exactly what_ is mismatching. In the latter cases, set `opts.verboseWhenMismatches` to `true`. When there is no match, instead of Boolean `false` the main function will return **a string** with an explanatory message.

If you use this setting, you have to anticipate Boolean `true` OR something else (Boolean `false` or string) coming out from this library.

{% include "btt.njk" %}

## Rationale

We want to check, does a deeply-nested array of objects/strings/arrays (for example, [parsed](/os/codsen-parser/) AST output) is equal or is a subset of some other AST. Normally `_.isMatch` would do the deed but it positively matches **empty arrays against any arrays** what is terrible. Hence this library. Plus, this library will accept and adapt to any sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

{% include "btt.njk" %}

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. An empty array will not be reported as equal to a non-empty array.

```js
// in this library:
var res = compare(["a", "b", "c"], []);
// now, res === false
```

{% include "btt.njk" %}
