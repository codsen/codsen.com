---
layout: package
title: object-all-values-equal-to
---

## Purpose

It answers the question: does the given AST/nested-plain-object/array/whatever contain only one kind of value?

The equality is not explicit, that is, we're just checking, that all values are **not unequal** to the given-one.

For example:

```js
const allValuesEqualTo = require("object-all-values-equal-to");

// are all values equal to "false":
console.log(allValuesEqualTo({ a: false, c: false }, false));
// => true

// are all values equal to "false":
console.log(allValuesEqualTo({ a: false, c: "zzz" }, false));
// => false, because of `zzz`

// are all values equal to "false":
console.log(
  allValuesEqualTo(
    {
      a: {
        b: false,
        c: [
          {
            d: false,
            e: false,
          },
          {
            g: false,
          },
        ],
      },
      c: false,
    },
    false
  )
);
// => true
```

{% include "btt.njk" %}

### `opts.arraysMustNotContainPlaceholders`

When working with data structures, this library would be used to check, is the certain piece of JSON data (some key's value, a nested object) is all blank, that is, contains only placeholders everywhere.

Now, with regards to arrays, default arrays should not contain placeholders directly. For example key `b` is customised, it's not a placeholder:

```json
{
  "a": false,
  "b": [false]
}
```

It should be instead:

```json
{
  "a": false,
  "b": []
}
```

When checking against second argument `false`, this library will yield `false` for former and `true` for latter.

Now, this is relevant only when working with data structures. When dealing with all other kinds of nested objects and arrays, placeholders within arrays count as placeholders and should yield `true`.

For that, turn off the `opts.arraysMustNotContainPlaceholders`, set it to `false`.

Observe:

```js
let res1 = allValuesEqualTo([null], null);
console.log(res1);
// => false

let res2 = allValuesEqualTo([null], null, {
  arraysMustNotContainPlaceholders: false,
});
console.log(res2);
// => true
```

{% include "btt.njk" %}

## API

```js
allValuesEqualTo(input, value);
```

### API - Input

| Input argument | Type     | Obligatory? | Default     | Description                                                                                                                                 |
| -------------- | -------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | Whatever | yes         | `undefined` | AST tree, or object or array or whatever. Can be deeply-nested. Hopefully contains some nested plain objects. We love nested plain objects. |
| `value`        | Whatever | no          | `false`     | We will check, does `input` contain only `value` on every key. Please don't set it to `undefined`.                                          |

{% include "btt.njk" %}

### Optional Options Object

| options object's key               | Type of its value | Default | Description                                                                                                                                                                    |
| ---------------------------------- | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `arraysMustNotContainPlaceholders` | Boolean           | `true`  | When set to `true`, `value` within array should not be present and will yield `false` result. Set this to `false` to allow one or more `value`'s within arrays in the `input`. |

Here are the Optional Options Object's defaults in one place (in case you ever want to copy and tweak it):

```js
{
  arraysMustNotContainPlaceholders: true,
}
```

{% include "btt.njk" %}

### API - Output

Boolean: `true` or `false`.

## Why we need this

For example, we were working on [object-fill-missing-keys](/os/object-fill-missing-keys/). The library takes an object, a reference object, and fills in missing keys according to the reference. We were implementing a feature, a options switch, which let to skip filling for chosen keys if they currently contain only placeholders.

You'll need this library when you want to check, does the AST contain only certain value throughout the whole tree. Also, it can be a simple object, in which case, we'd be checking, are all values of all keys equal to something.

{% include "btt.njk" %}
