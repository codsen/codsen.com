---
layout: package
title: ast-loose-compare
packages:
  - ast-compare
---

## Purpose

To find out, does an object/array/string/nested-mix is a subset or equal to another input.

If this library will encounter two things that contain only _empty things_, it will report them as equal. Empty things are:

- strings that `trim()` to zero length
- arrays with zero or more empty strings (see previous item)
- plain objects whose all values of all keys are empty arrays, empty strings or empty plain objects

For example these two are deemed to be equal:

```js
{{ packageJsons["ast-loose-compare"].lect.req }}(
  {
    a: "a",
    b: "\n \n\n",
  },
  {
    a: "a",
    b: "\t\t \t",
  }
);
// => true
```

Second input argument can be subset of first-one, notice `b` values are of a different type, yet both contain only _empty space_:

```js
{{ packageJsons["ast-loose-compare"].lect.req }}(
  {
    a: "a",
    b: [[["\n \n\n"]]],
    c: "c",
  },
  {
    a: "a",
    b: { c: { d: "   \t\t \t" } },
  }
);
// => true
```

{% include "btt.njk" %}

## API

**{{ packageJsons["ast-loose-compare"].lect.req }}(bigObj, smallObj)**

In other words, it's a function which takes two input arguments, both obligatory.

It returns a boolean or `undefined`.

- If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
- Otherwise, if there's a mismatch, returns `false`.
- For all other cases where inputs are missing/`undefined`, returns `undefined`.
- If both `smallObj` and `bigObj` contain the same key and their values contain only empty space (differing or not), they will be considered equal.

{% include "btt.njk" %}

## Difference from `ast-compare`

[ast-compare](/os/ast-compare/) of ours does everything that this program does and more.

{% include "btt.njk" %}

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. In this library, empty array will not be reported as equal to non-empty array, although if both arguments contain something which is _empty space_, they will be considered equal.

If you want an AST comparison library with a stricter ways towards the _empty space equation_, check [ast-compare](/os/ast-compare/).

{% include "btt.njk" %}
