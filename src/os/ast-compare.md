---
layout: package
title: ast-compare
packages:
  - ast-loose-compare
---

## Purpose

Find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
var compare = require("ast-compare");
var result = compare(
  {
    // <- does this nested plain object...
    a: {
      b: "d",
      c: [],
      e: "f",
      g: "h",
    },
  },
  {
    // <- ...contain this nested plain object?
    a: {
      b: "d",
      c: [],
    },
  }
);
console.log(result);
// => true
```

The main purpose is to compare two parsed HTML/CSS trees or their branches, but you can compare anything, it will recursively traverse arrays too. This lib is dependency for [ast-delete-object](/os/ast-delete-object/) — library which can delete elements from [parsed](/os/codsen-parser/) HTML/CSS objects.

{% include "btt.njk" %}

## Use

```js
var compare = require("ast-compare");
```

## API

The output of this library is binary and boolean: `true` or `false`.
This library will not mutate the input arguments.

### Input

**Input**

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

### Output

If `smallObj` **is** equal or a superset of `bigObj`, the returned value is always Boolean `true`.

If it's **not** a superset or equal, the value depends on `opts.verboseWhenMismatches`:

- Default, `opts.verboseWhenMismatches===false` will yield `false`
- Default, `opts.verboseWhenMismatches===true` will yield `string`, explaining what didn't match.

{% include "btt.njk" %}

## Examples

```js
compare({ a: "1", b: "2", c: "3" }, { a: "1", b: "2" });
// => true, because second (smallObj) is subset of (or equal) first (bigObj).
```

```js
compare({ a: "1", b: "2" }, { a: "1", b: "2", c: "3" });
// => false, because second (smallObj) is not a subset (or equal) to first (bigObj).
```

```js
compare(["a", "b", "c"], ["a", "b"]);
// => true, because second is a subset of first
```

```js
compare(["a", "b", "c"], ["b", "a"]);
// => false, because order is wrong
```

```js
compare(["a", "b"], ["a", "b", "c"]);
// => false, because second is not a subset of first
```

```js
compare("a\nb", "a\nb");
// => true, because strings are equal
```

```js
compare({ a: "a" });
// => false. Second input value is missing which means it's a nonsense, thus, false
```

```js
compare(null);
// => false.
```

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
