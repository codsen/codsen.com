---
layout: package
title: ast-delete-object
packages:
  - email-comb
---

## Purpose

It deletes objects in AST if all given keys-value pairs are matched.

{% include "btt.njk" %}

## API

:::api
deleteObj(
  input,
  objToDelete,
  [options]
)
:::

In other words, it's a function which takes three input arguments, third-one being optional (marked by square brackets). It will not mutate the `input` AST.

{% include "btt.njk" %}

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `objToDelete`  | Whatever | yes         | Key/value pairs that should be used to match plain objects.     |
| `options`      | Boolean  | no          | OOO: Optional Options Object (see API below)                                    |

By the way, the input arguments are not mutated in any way.

{% include "btt.njk" %}

### API - Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                                                        |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `matchKeysStrictly`    | Boolean | no          | `false` | If you supplied an object to match, and all its keys were found in target object, that target object will be deleted. Now, there could have been extra keys there. If you set `matchKeysStrictly` to `true`, both **keysets** as well as key values have to match. |
| `hungryForWhitespace`  | Boolean | no          | `false` | When active, empty value (one which would get `trim`-med to empty string, `""`) will match any other empty value (which might be different matching strictly, yet `trim` to the same empty string, `""`).                                                          |

Defaults in one place:

```js
{
  matchKeysStrictly: false,
  hungryForWhitespace: false,
}
```

{% include "btt.njk" %}

### API - Output

This library will return the clone of first input argument with relevant elements deleted.

{% include "btt.njk" %}

## `opts.matchKeysStrictly`

If you want the search to be strict, that is to require the key set to match exactly, use options object, `matchKeysStrictly: true`:

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    "elem1",
    {
      findme1: "zzz",
      findme2: "yyy",
      somethingelse: "qqq", // <--- this key will block deletion
    },
    "elem2",
  ],
  {
    findme1: "zzz",
    findme2: "yyy",
  },
  {
    matchKeysStrictly: true, // <--- strict matching
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => nothing changes!
// [
//   'elem1',
//   {
//     findme1: 'zzz',
//     findme2: 'yyy',
//     somethingelse: 'qqq'
//   },
//   'elem2'
// ]
```

In example above, object was not deleted because strict matching ignored it because of unrecognised key `somethingelse`.

{% include "btt.njk" %}

## `opts.hungryForWhitespace`

This is a library to deal with AST's, and they usually have lots of white space. Often there are many elements that contains only spaces, tabs or line breaks. Sometimes we want to pretend that those elements containing white space don't exist, so deletion is more aggressive regarding the white space.

For example, notice how we look for blank plain object, but it catches other objects that contain only empty space:

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    { a: "\n" },
    {
      key3: "val3",
      key4: "val4",
    },
    { b: "   " },
    { c: "" },
  ],
  {},
  { matchKeysStrictly: false, hungryForWhitespace: true }
);
console.log("res = " + JSON.stringify(res, null, 4));
// =>  [{
//      key3: 'val3',
//      key4: 'val4'
//    }]
```

{% include "btt.njk" %}

## The story

Originally, this program was created to help us delete unused CSS (as objects) from parsed HTML (AST tree) in [email-comb](/os/email-comb/). Since then, we've rewritten `email-comb` to process the code without parsing, without AST. `email-comb` became faster by magnitude (milliseconds instead of seconds/minutes).

{% include "btt.njk" %}
