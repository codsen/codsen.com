---
layout: package
title: ast-loose-compare
packages:
  - ast-compare
---

## Purpose

To find out, does an object/array/string/nested-mix is a subset or equal to another input:

```js
compare(
  {
    a: {
      b: "d",
      c: [],
      e: "f",
      g: "h",
    },
  },
  {
    a: {
      b: "d",
      c: [],
    },
  }
);
// => true
```

Any plain object, array or string or nested tree of thereof that contains only space characters, tabs or line breaks is considered as "containing only empty space".

If this library will encounter two things that contain only _empty space_, it will report them as equal.

For example these two are equal:

```js
compare(
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
compare(
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

Main purpose of this library is to compare parsed HTML/CSS trees when deleting empty [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) branches. This library is a dependency for [ast-delete-object](/os/ast-delete-object/) — library which can delete elements from [parsed](/os/codsen-parser/) HTML/CSS objects.

{% include "btt.njk" %}

## Difference from `ast-compare`

There is another similarly-named library, [ast-compare](/os/ast-compare/). The difference between the two is the following.

`ast-compare` will check: is something a _subset_ or exactly equal of something. If **subset** query item has empty array or an array with empty string with it, it will search for exactly the same on the **superset** query item. Unlike in [\_.isMatch](https://www.npmjs.com/package/lodash.ismatch), empty array will not be reported as equal to non-empty array.

`ast-loose-compare` will act the same as `ast-compare` except

In Lodash [\_.isMatch](https://www.npmjs.com/package/lodash.ismatch), an empty array will be equal to anything that has only empty space (on other objects/arrays containing only empty space). Here, `ast-loose-compare` will report that empty array is not equal to non-empty array (or anything containing non just an empty space).

{% include "btt.njk" %}

## Differences from \_.isMatch

> "Partial comparisons will match empty array and empty object source values against any array or object value, respectively." — [Lodash documentation](https://lodash.com/docs/4.16.4#isMatch)

[\_.isMatch](https://www.npmjs.com/package/lodash.ismatch) positively matches empty arrays to everything. This is bad when you are comparing parsed HTML/CSS trees. This library doesn't do this. In this library, empty array will not be reported as equal to non-empty array, although if both arguments contain something which is _empty space_, they will be considered equal.

If you want an AST comparison library with a stricter ways towards the _empty space equation_, check [ast-compare](/os/ast-compare/).

{% include "btt.njk" %}

## Other alternative programs

We want to check, does a deeply-nested array of objects/strings/arrays (for example, [parsed](/os/codsen-parser/) AST output) is equal or is a subset of something. Normally `_.isMatch` would do the deed but it positively matches empty arays against any arrays. Hence this library. Plus, this library will accept and adapt to _any_ sources — combinations of arrays, objects and strings. That's necessary to support any parsed AST trees - HTML or CSS or whatever.

{% include "btt.njk" %}

## API

```js
looseCompare(
  bigObj, // something (Object|Array|String|nested mix)
  smallObj // something (Object|Array|String|nested mix). Maybe it's a subset or equal to bigObj.
);
// => Boolean|undefined
```

- If everything from `smallObj` matches everything within `bigObj`, this library returns `true`.
- Otherwise, if there's a mismatch, returns `false`.
- For all other cases where inputs are missing/`undefined`, returns `undefined`.
- If both `smallObj` and `bigObj` contain the same key and their values contain only empty space (differing or not), they will be considered equal.

{% include "btt.njk" %}

## More examples

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
compare(["a", "b"], ["a", "b", "c"]);
// => false, because second is not a subset of first
```

```js
compare("aaaaa\nbbbbb", "aaaaa\nbbbbb");
// => true, because strings are equal
```

```js
compare({ a: "a" });
// => undefined, because second input value is missing
```

{% include "btt.njk" %}
