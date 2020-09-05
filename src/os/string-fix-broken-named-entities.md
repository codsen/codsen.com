---
layout: package
title: string-fix-broken-named-entities
packages:
  - detergent
---

## Purpose

This program detects and fixes broken named HTML entities. The algorithm is Levenshtein distance, for smaller entities, we match by distance `1`, for longer entities we allow distance `2`.

In practice, this means we can catch errors like: `&nbp;` (mistyped `&nbsp;`).

This program also works as a healthy entities catcher - broken entities are fed to one callback (`opts.cb`), healthy entities are fed to another callback (opts.entityCatcherCb).

There is a decoding function; the algorithm is aware of numeric HTML entities as well.

{% include "btt.njk" %}

## API - Input

The `fixEnt` you required/imported is a function and it has two input arguments:

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | String, hopefully HTML code                        |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

For example:

```js
const fixEnt = require("string-fix-broken-named-entities");
const result = fixEnt("&nsp;x&nsp;y&nsp;");
console.log(JSON.stringify(result, null, 4));
// => [[0, 5, "&nbsp;"], [6, 11, "&nbsp;"], [12, 17, "&nbsp;"]]
```

{% include "btt.njk" %}

### Optional Options Object

| An Optional Options Object's key | Type of its value | Default   | Description                                                                                                                                              |
| -------------------------------- | ----------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `decode`                         | Boolean           | `false`   | Fixed values are normally put as HTML-encoded. Set to `true` to get raw characters instead.                                                              |
| `cb`                             | Function          | see below | Callback function which gives you granular control of the program's output                                                                               |
| `entityCatcherCb`                | Function          | `null`    | If you set a function here, every encountered entity will be passed to it, see a dedicated chapter below                                                 |
| `progressFn`                     | Function          | `null`    | Used in web worker setups. You pass a function and it gets called once for each natural number `0` to `99`, meaning a percentage of the work done so far |

Here it is in one place:

```js
{
  decode: false,
  cb: ({ rangeFrom, rangeTo, rangeValEncoded, rangeValDecoded }) =>
    rangeValDecoded || rangeValEncoded
      ? [rangeFrom, rangeTo, opts.decode ? rangeValDecoded : rangeValEncoded]
      : [rangeFrom, rangeTo],
  entityCatcherCb: null,
  progressFn: null
}
```

{% include "btt.njk" %}

## API - Output

**Output**: an array of zero or more arrays ([_ranges_](/ranges/)).

{% markdown '/src/components/content/ranges-explanation.md' %}

For example, four fixed `nbsp`'s:

```js
[
  [6, 11, "&nbsp;"],
  [11, 18, "&nbsp;"],
  [27, 34, "&nbsp;"],
  [34, 41, "&nbsp;"],
];
```

The output can be further processed by other [range libraries](/ranges/): [cropping](/os/ranges-crop/), [sorting](/os/ranges-sort/), [merging](/os/ranges-merge/) can be done straight on a ranges notation.

{% include "btt.njk" %}

## `opts.decode`

If you set `opts.decode` and there are healthy encoded entities, those will not be decoded. Only if there are broken entities, those will be set in ranges as decoded values. If you want full decoding, consider filtering the input with a [dedicated decoding library](/os/ranges-ent-decode/) right after filtering using this library.

For example, you'd first filter the string using this library, then you'd filter the same input skipping already recorded ranges, using [ranges-ent-decode](/os/ranges-ent-decode/). Then you'd [merge](/os/ranges-merge/) the ranges.

For example:

```js
const fixEnt = require("string-fix-broken-named-entities");
const result = fixEnt("zz nbsp;zz nbsp;", { decode: true });
console.log(JSON.stringify(result, null, 4));
// => [[3, 8, "\xA0"], [11, 16, "\xA0"]]
```

{% include "btt.njk" %}

## `opts.cb` - a callback function

So, normally, the output of this library is **an array** of zero or more arrays (each meaning string index _ranges_), for example:

```json
[
  [1, 2],
  [3, 4]
]
```

Above means, delete the string from index `1` to `2` and from `3` to `4`.

However, for example, in [`emlint`](/os/emlint/), we need slightly different format, not only ranges but also **issue titles**:

```json
[
  {
    "name": "tag-generic-error",
    "position": [[1, 2]]
  },
  {
    "name": "tag-generic-error",
    "position": [[3, 4]]
  }
]
```

**Callback function** via `opts.cb` allows you to change the output of this library.

The concept is, you pass a function in options object's key `cb`. That function will receive a plain object with all "ingredients" under various keys. Whatever you return, will be pushed into a results array. For each result application is about to push, it will call your function with findings, all neatly put in the plain object.

For example, to solve the example above, we would do:

```js
const fixEnt = require("string-fix-broken-named-entities");
const res = fixEnt("zzznbsp;zzznbsp;", {
  cb: (oodles) => {
    // "oodles" or whatever you name it, is a plain object.
    // Grab any content from any of its keys, for example:
    // {
    //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
    //   entityName: "pi",
    //   rangeFrom: 3,
    //   rangeTo: 4,
    //   rangeValEncoded: "&pi;",
    //   rangeValDecoded: "\u03C0"
    // }
    return {
      name: oodles.ruleName,
      position:
        oodles.rangeValEncoded != null
          ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
          : [oodles.rangeFrom, oodles.rangeTo],
    };
  },
});
console.log(JSON.stringify(res, null, 4));
// => [
//      {
//        name: "malformed &nbsp;",
//        position: [3, 8, "&nbsp;"]
//      },
//      {
//        name: "malformed &nbsp;",
//        position: [11, 16, "&nbsp;"]
//      }
//    ]
```

Here's the detailed description of all the keys, values and their types:

| name of the key in the object in the first argument of a callback function | example value                                          | value's type                    | description                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------- |
| ruleName                                                                   | `missing semicolon on &pi; (don't confuse with &piv;)` | string                          | Full name of the issue, suitable for linters                                                      |
| entityName                                                                 | `pi`                                                   | string                          | Just the name of the entity, without ampersand or semicolon. Case sensitive                       |
| rangeFrom                                                                  | `3`                                                    | (natural) number (string index) | Shows from where to delete                                                                        |
| rangeTo                                                                    | `8`                                                    | (natural) number (string index) | Shows up to where to delete                                                                       |
| rangeValEncoded                                                            | `&pi;`                                                 | string or `null`                | Encoded entity or `null` if fix should just delete that index range and there's nothing to insert |
| rangeValDecoded                                                            | `\u03C0`                                               | string or `null`                | Decoded entity or `null` if fix should just delete that index range and there's nothing to insert |

{% include "btt.njk" %}

### `opts.decode` in relation to `opts.cb`

Even though it might seem that when a callback is used, `opts.decode` does not matter (because we serve both encoded and decoded values in a callback), but **it does matter**.

For example, consider this case, where we have non-breaking spaces without semicolons:

```
&nbsp,&nbsp,&nbsp
```

Since we give user an option to choose between raw and encoded values, result can come in two ways:

When decoded entities are requested, we replace ranges `[0, 5]`, `[6, 11]` and `[12, 17]`:

```js
// ranges:
[
  [0, 5, "\xA0"],
  [6, 11, "\xA0"],
  [12, 17, "\xA0"],
];
```

But, when encoded entities are requested, it's just a matter of sticking in the missing semicolon, at indexes `5`, `11` and `17`:

```js
// ranges:
[
  [5, 5, ";"],
  [11, 11, ";"],
  [17, 17, ";"],
];
```

{% include "btt.njk" %}

## `opts.entityCatcherCb`

If broken entities are pinged to `opts.cb()` callback, all healthy entities are pinged to `opts.entityCatcherCb`. It's either one of another:

```js
const inp1 = "y &nbsp; z &nsp;";
const gatheredEntityRanges = [];
fix(inp1, {
  entityCatcherCb: (from, to) => gatheredEntityRanges.push([from, to]),
});
console.log(
  `${`\u001b[${33}m${`gatheredEntityRanges`}\u001b[${39}m`} = ${JSON.stringify(
    gatheredEntityRanges,
    null,
    4
  )}`
);
// => [[2, 8]]
```

{% include "btt.njk" %}

## `opts.progressFn` - progress callback

In web worker setups, a worker can return "in progress" values. When we put this package into a web worker, this callback function under `opts.progress` will be called with a string, containing a natural number, showing the percentage of the work done so far.

It's hard to show minimal worker application here but at least here's how the pinging progress works from the side of this npm package:

```js
// let's define a variable on a higher scope:
let count = 0;

// call application as normal, pass opts.progressFn:
const result = fixEnt(
  "text &ang text&ang text text &ang text&ang text text &ang text&ang text",
  {
    progressFn: (percentageDone) => {
      // console.log(`percentageDone = ${percentageDone}`);
      t.ok(typeof percentageDone === "number");
      count++;
    },
  }
);
// each time percentage is reported, "count" is incremented

// now imagine if instead of incrementing the count, we pinged the
// value out of the worker
```

{% include "btt.njk" %}
