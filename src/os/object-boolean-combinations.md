---
layout: package
title: object-boolean-combinations
---

## What it does

It consumes a plain object, takes its keys (values don't matter) and produces an array with every possible combination of each key's Boolean^ value. If you have _n_ keys, you'll get `2^n` objects in the resulting array.

```js
const combinations = require("object-boolean-combinations");
const test = combinations({ a: "whatever" });
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: 0},
//      {a: 1}
//    ]
```

^ We could generate `true`/`false` values, but for efficiency, we're generating `0`/`1` instead. Works the same in Boolean logic, but takes up less space.

PS. Observe how input values don't matter, we had: `{ a: 'whatever' }`.

Sometimes, you don't want all the combinations, you might want to "pin" certain values to be constant across all combinations. In those cases, use [overrides](#overriding), see below.

{% include "btt.njk" %}

## API

```js
combinations(inputObject, [overrideObject]);
```

### API - Input

| Input argument   | Type         | Obligatory? | Description                                                                                                                           |
| ---------------- | ------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `inputObject`    | Plain object | yes         | Plain object from which we should reference the keys.                                                                                 |
| `overrideObject` | Plain object | no          | Keys in this object will be used as-is and will not be used for generating combinations. See [overriding](#overriding) section below. |

{% include "btt.njk" %}

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, we want to override all `a` and `b` keys to be only `true` (`1`). This reduces the object combinations from `2^3 = 8` to: `2^(3-2) = 2^1 = 2`:

```js
const combinations = require("object-boolean-combinations");
const test = combinations(
  { a: 0, b: 0, c: 0 },
  { a: 1, b: 1 } // <----- Override. These values will be on all combinations.
);
console.log(`test = ${JSON.stringify(test, null, 4)}`);
// => [
//      {a: 1, b: 1, c: 0},
//      {a: 1, b: 1, c: 1}
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

## Trivia

It was our second npm package — to this day it drives [Detergent's](/os/detergent/) unit tests. It enables us to test the hell out of it - its {{ compiledAssertionCounts.all.detergent | thousandSeparator }} assertions vast majority are generated programmatically. This guarantees that every single toggle doesn't accidentally affect other toggle — bugs can't hide among `2^16 = 65,536` settings combinations...

{% include "btt.njk" %}
