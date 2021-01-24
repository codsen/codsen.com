---
layout: package
title: object-boolean-combinations
packages:
  - test-mixer
---

## Purpose

It's used to generate an array of all possible variations, `2^n`, of `n` boolean options object keys.

Input (key values don't matter as long as key are booleans):

```json
{
  "oodles": true,
  "crambles": false
}
```

Output:

```json
[
  {
    "oodles": true,
    "crambles": true
  },
  {
    "oodles": true,
    "crambles": false
  },
  {
    "oodles": false,
    "crambles": true
  },
  {
    "oodles": false,
    "crambles": false
  }
]
```

[`detergent`](/os/detergent/) has 12 boolean toggles — that's `2^12 = 4096` variations to test for each input.

[`string-collapse-white-space`](/os/string-collapse-white-space/) has 6 boolean toggles — that's `2^6 = 64` variations to test.

And so on.

Our packages don't use this library directly, there is a higher-level package [`test-mixer`](/os/test-mixer/) which takes into account non-boolean keys and uses this package to generate variations of boolean keys only, then restores the other keys.

{% include "btt.njk" %}

## API - Input

::: api
combinations(
  inputObject,
  [overrideObject]
)
:::

In other words, it's a function which takes two input arguments, second one being optional (marked by square brackets).

| Input argument   | Type         | Obligatory? | Description                                                                                                                           |
| ---------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `inputObject`    | Plain object | yes         | Plain object from which we should reference the keys.                                                                                 |
| `overrideObject` | Plain object | no          | Keys in this object will be used as-is and will not be used for generating combinations. See [overriding](#overriding) section below. |

{% include "btt.njk" %}

## API - Output

Program returns an array of plain objects.

{% include "btt.njk" %}

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, we want to override all `a` and `b` keys to be only `true` (`1`). This reduces the object combinations from `2^3 = 8` to: `2^(3-2) = 2^1 = 2`:

```js
const { combinations } = require("object-boolean-combinations");
const test = combinations(
  { a: false, b: false, c: false },
  { a: true, b: true } // <----- Override. These values will be on all combinations.
);
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: true, b: true, c: false},
//      {a: true, b: true, c: true}
//    ]
```

In example above, `a` and `b` are "pinned" to `1`, thus reducing the amount of combinations by power of two, essentially halving resulting objects count twice. Notice how only `c` is having variations.

{% include "btt.njk" %}

## Overriding the combinations — in practice

In practice, we use this overriding to perform the specific tests on [Detergent.js](/os/detergent/). For example, let's say, we are testing: does Detergent encode entities correctly. In that case we need two arrays filled with objects:

- first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
- second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's a unit test which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each:

```js
test("encode entities - pound sign", (t) => {
  combinations(sampleObj, {
    convertEntities: true,
  }).forEach(function (elem) {
    t.equal(
      detergent("\u00A3", elem),
      "&pound;",
      "pound char converted into entity"
    );
  });
});
```

{% include "btt.njk" %}
