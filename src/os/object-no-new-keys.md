---
layout: package
title: object-no-new-keys
---

## Purpose

Check, does a given plain object have any keys, not present in a reference object. Returns array of zero or more paths in [`object-path`](https://www.npmjs.com/package/object-path) notation.

For example, it can be used to look for any rogue keys in email template content JSON files.

{% include "btt.njk" %}

## API

**{{ packageJsons["object-no-new-keys"].lect.req }}(input, reference, \[opts])**

In other words, it's a function which takes two obligatory arguments and third, optional.

### API - Function's Input

| Function's argument                                                                                                                                                                  | Key value's type                                                                                         | Obligatory? | Description        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------- | ------------------ |
| `input`                                                                                                                                                                              | Normally, a plain object or array — but can be whatever in which case the results will be an empty array | yes         | What to work upon. |
| `reference | Same, normally, a plain object or array — but can be whatever type in which case result will be empty array | yes | The reference against which we'll match the`input`. |
| `opts | Plain object | no | Optional options object                                                                                                                                  |

{% include "btt.njk" %}

### API - Function's Output

Returns an array of zero or more paths to each key/element in the `input` which does not exist in `reference`.

### API - `opts` - an Optional Options Object

**Defaults**:

```js
{
  mode: 2;
}
```

| Optional Options Object's key | Type           | Obligatory? | Default | Description                         |
| ----------------------------- | -------------- | ----------- | ------- | ----------------------------------- |
| `mode`                        | Integer number | no          | `2`     | Choose mode: `1` or `2`. See below. |

{% include "btt.njk" %}

## Two modes

This library has two modes:

1.  Strict comparing, having no assumptions about the `reference`.
2.  Comparing, assuming that the `reference` will be NORMALISED.

By "_normalised_" we mean if any arrays have object children, those objects have the same keys.

These two modes mainly concern the case when both `input` and `reference` have an array, but `reference` has fewer elements and there's nothing to compare the `input` element to:

```js
const input = {
  a: [
    {
      // object number 1
      b: "b1",
      c: "c1",
    },
    {
      // object number 2
      b: "b2",
      c: "c2",
      x: "y",
    },
  ],
};

const reference = {
  a: [
    {
      // << just one object!
      b: "b3",
      c: "c3",
    },
  ],
};
```

First mode will report that `a[1].b` and `a[1].c` and `a[1].x` are all rogue keys, not present in `reference.`

The second mode will anticipate that `reference` will be normalised, that is, we can **compare input array elements to the first element of an array in reference**. We'll get the same thing — all objects within an array should have the same keys. This means, `input` has only one rogue key — `a[1].x`. And algorithm will identify it by comparing `input` object `a[1]` to `reference` object `a[0]` — second/third/whatever element in the `input` to **ALWAYS THE FIRST ELEMENT IN REFERENCE**, `a[0]`.

We need the second mode, but we give people chance to use the first mode as well. Maybe somebody will find it useful.

{% include "btt.njk" %}

## For example

```js
const nnk = require("object-no-new-keys");
const res = nnk(
  {
    a: "a",
    b: "b",
    c: "c",
  },
  {
    c: "z",
  }
);
console.log("nnk = " + JSON.stringify(nnk, null, 4));
// => ['a', 'b']
// meaning, path "a" and path "b" were missing
// path notation uses [] to mark array's contents
```

works with arrays too:

```js
const nnk = require("object-no-new-keys");
const res = nnk(
  {
    //<<< input
    a: [
      {
        b: "aaa",
        d: "aaa", // rogue key, record it
        f: "fff", // another rogue key, record it
      },
      {
        c: "aaa",
        k: "kkk", // yet another rogue key, record it
      },
    ],
    x: "x", // rogue too
  },
  {
    // <<< reference
    a: [
      {
        b: "bbb",
        c: "ccc",
      },
      {
        b: "yyy",
        c: "zzz",
      },
    ],
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['a[0].d', 'a[0].f', 'a[1].k', 'x']
```

{% include "btt.njk" %}

## Competition

You could try to use a [missing-deep-keys](https://github.com/vladgolubev/missing-deep-keys), but it won't work if your inputs have **arrays**. For posterity, the algorithm of it is quite wise: run `lodash.difference` against [deep-keys](https://www.npmjs.com/package/deep-keys)-flattened stringified key schemas of both object and reference. However, `deep-keys` does not support **arrays**, so it's not that easy.

In short, `missing-deep-keys` is for cases when you have only objects-within-objects. `object-no-new-keys` is for work with parsed HTML (AST's) or JSON. Higher-end.

{% include "btt.njk" %}
