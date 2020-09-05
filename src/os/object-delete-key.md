---
layout: package
title: object-delete-key
---

## Deleting

Three modes:

- Delete all `key`/`value` pairs found in any nested plain objects where `key` equals `value`.
- Delete all `key`/`value` pairs found in any nested plain objects where `key` is equal to a certain thing. `value` doesn't matter.
- Delete all `key`/`value` pairs found in any nested plain objects where `value` is equal to a certain thing. `key` doesn't matter.

This library accepts anything as input, including [parsed](/os/codsen-parser/) HTML, which is _deeply_ nested arrays of plain objects, arrays and strings. You can feed anything as input into this library - if it's traversable, it will be traversed and searched for your `key` and/or `value` in any plain objects.

If you want to delete any nested objects that contain certain `key`/`value` pair(s), check out [ast-delete-object](/os/ast-delete-object/).

{% include "btt.njk" %}

## API

```js
var result = deleteKey(input, options);
```

Input arguments are not mutated; this package clones them first before using.

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See its key arrangement below.                  |

| `options` object's key | Type     | Obligatory? | Default | Description                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------- | ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                  | String   | no^         | n/a     | Key to find and delete.                                                                                                                                                                                                                                                                                                                |
| `val`                  | Whatever | no^         | n/a     | Key's value to find and delete. Can be a massively nested AST tree or whatever.                                                                                                                                                                                                                                                        |
| `cleanup`              | Boolean  | no          | true    | Should this package delete any empty carcases of arrays/objects left after deletion?                                                                                                                                                                                                                                                   |
| `only`                 | String   | no          | `any`   | Default setting will delete from both arrays and objects. If you want to delete from plain objects only, set this to one of "object-type" values below. If you want to delete keys from arrays only, set this to one of "array-type" values below. In this case "key" means array element's value and "value" is not meant to be used. |

^ - at least one, `key` or `val` must be present.

{% include "btt.njk" %}

#### Accepted `opts.only` values

| Interpreted as "array-type" | Interpreted as "object-type" | Interpreted as "any" type |
| --------------------------- | ---------------------------- | ------------------------- |
| `array`                     | `object`                     | `any`                     |
| `arrays`                    | `objects`                    | `all`                     |
| `arr`                       | `obj`                        | `everything`              |
| `aray`                      | `ob`                         | `both`                    |
| `arr`                       | `o`                          | `either`                  |
| `a`                         |                              | `each`                    |
| <br/>                       |                              | `whatever`                |
| <br/>                       |                              | `e`                       |

If `opts.only` is set to any string longer than zero characters and is **not** case-insensitively equal to one of the above, the `object-delete-key` will **throw an error**.

We want to relieve users from having to check the documentation for `opts.only` values.

{% include "btt.njk" %}

### API - Output

This library returns the `input` with all requested keys/value pairs removed.

## Example

```js
// deleting key 'c', with value 'd'
deleteKey(
  {
    a: "b",
    c: "d",
  },
  {
    key: "c",
    val: "d",
  }
);
// => {a: 'b'}
```

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, plus empty objects/arrays deleted because 4th input is default, true
deleteKey(
  {
    a: { e: [{ b: ["c", "d"] }] },
    b: ["c", "d"],
  },
  {
    key: "b",
    val: ["c", "d"],
  }
);
// => {}
```

Feed options object's key `cleanup: false` if you **don't want** empty arrays/objects removed:

```js
// deleting key 'b' with value ['c', 'd']
// two occurencies will be deleted, but empty carcasses won't be touched:
deleteKey(
  {
    a: { e: [{ b: { c: "d" } }] },
    b: { c: "d" },
  },
  {
    key: "b",
    val: { c: "d" },
    cleanup: false,
  }
);
// => {a: {e: [{}]}}
```

Also, you can delete by **key only**, for example, delete all key/value pairs where the key is equal to `b`:

```js
deleteKey(
  {
    a: "a",
    b: "jlfghdjkhkdfhgdf",
    c: [{ b: "weuhreorhelhgljdhflghd" }],
  },
  {
    key: "b",
  }
);
// => { a: 'a' }
```

You can delete by **value only**, for example, delete all key/value pairs where the value is equal to `whatever`:

```js
deleteKey(
  {
    a: "a",
    skldjfslfl: "x",
    c: [{ dlfgjdlkjlfgjhfg: "x" }],
  },
  {
    val: "x",
  }
);
// => { a: 'a' }
```

The example above didn't specified the `cleanup`, so this package _will_ delete all empty carcases of objects/arrays by default. When `cleanup` is off, the result would be this:

```js
deleteKey(
  {
    a: "a",
    skldjfslfl: "x",
    c: [{ dlfgjdlkjlfgjhfg: "x" }],
  },
  {
    val: "x",
    cleanup: false,
  }
);
// => {
//   a: 'a',
//   c: [{}] // <<<< observe this
// }
```

{% include "btt.njk" %}

## Wildcards

Wildcards can be used in keys and/or values. This library feeds inputs to [ast-monkey](/os/ast-monkey/) which is doing all the heavy lifting, which, in turn, is using [matcher](https://github.com/sindresorhus/matcher).

```js
const res = deleteKey(
  {
    a: ["beep", "", "c", "boop"],
    bap: "bap",
  },
  {
    key: "b*p",
    only: "array",
  }
);
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// => {
//      a: ['', 'c'],
//      bap: 'bap',
//    }
```

{% include "btt.njk" %}

## Rationale

Object-key deletion libraries like [node-dropkey](https://github.com/wankdanker/node-dropkey) are naïve, expecting objects to be located in the input according to a certain pattern. For example, `node-dropkey` expects that the input will always be a flat array of plain objects.

But in real life, where we deal with AST _trees_ - nested _spaghetti_ of arrays, plain objects and strings — we can't expect anything. This library accepts _anything_ as an input, and no matter how deeply-nested. Feed it some nested AST's (`input`), then optionally a `key` or optionally a `value` (or both), and you'll get a result with that key/value pair removed from every plain object within the `input`.

We use this library in [email-comb](/os/email-comb/) to delete empty carcases of style tags without any selectors or empty class attributes in the inline HTML CSS.

{% include "btt.njk" %}

## This library vs. \_.omit

> OK, but if the input _is_ a plain object, you can achieve the same thing using Lodash `_.omit`, right?

Right, but ONLY if you don't care about the cleanup of empty arrays and/or plain objects afterwards.

Lodash will only delete keys that you ask, possibly leaving empty stumps.

This library will inteligently delete everything upstream if they're empty things (although you can turn it off passing `{ cleanup: false }` in `options` object).

Observe how key `b` _makes poof_, even though, technically, it was only a stump, having nothing to do with actual finding (besides being its parent):

```js
deleteKey(
  {
    a: "a",
    b: {
      c: "d",
    },
  },
  {
    key: "c",
  }
);
// =>
// {
//   a: 'a'
// }
```

Lodash won't clean up the stump `b`:

```js
_.omit(
  {
    a: "a",
    b: {
      c: "d",
    },
  },
  "c"
);
// =>
// {
//   a: 'a',
//   b: {} <------------------- LOOK!
// }
```

In conclusion, Lodash `_.omit` is different from this library in that:

- `_.omit` will not work on parsed HTML trees, consisting of nested arrays/plain objects
- `_.omit` will not clean up any stumps left after the deletion.

If you want to save time, `object-delete-key` is better than Lodash because former is _specialised tool for dealing with AST's_.

{% include "btt.njk" %}
