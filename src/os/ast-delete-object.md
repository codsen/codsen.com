---
layout: package
title: ast-delete-object
---

## Quick Take

Sometimes you want to look for certain key/value pair in all nested objects, and if found, **delete the whole parent object**.

```js
const deleteObj = require("ast-delete-object");
let res = deleteObj(
  [
    // arg #1 - where to look
    "elem1",
    {
      findme1: "zzz",
      findme2: "yyy",
      somethingelse: "qqq",
    },
    "elem2",
  ],
  {
    // arg #2 - what to look for
    findme1: "zzz",
    findme2: "yyy",
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => [
//      'elem1',
//      'elem2'
//    ]
```

{% include "btt.njk" %}

## API

```js
deleteObj(input, objToDelete, [strictOrNot]);
```

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `objToDelete`  | Whatever | yes         | Key/value pairs that should be used to match plain objects.     |
| `options`      | Boolean  | no          | OOO: Optional Options Object                                    |

By the way, the input arguments are not mutated in any way.

{% include "btt.njk" %}

### API - Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                                                        |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `matchKeysStrictly`    | Boolean | no          | `false` | If you supplied an object to match, and all its keys were found in target object, that target object will be deleted. Now, there could have been extra keys there. If you set `matchKeysStrictly` to `true`, both **keysets** as well as key values have to match. |
| `hungryForWhitespace`  | Boolean | no          | `false` | When active, empty value (one which would get `trim`-med to empty string, `""`) will match any other empty value (which might be different matching strictly, yet `trim` to the same empty string, `""`).                                                          |

{% include "btt.njk" %}

### API - Output

This library will return the same thing as argument `#1`, but with relevant elements deleted (or not).

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

## Example

Simple nested array/object:

`input`:

```js
[
  "elem1",
  {
    key2: "val2",
    key3: "val3",
    key4: "val4", // this key value pair will get deleted along with its parent object
  },
  "elem5",
];
```

`objToDelete`:

```js
{
  key2: 'val2',
  key3: 'val3'
}
```

result:

```js
["elem1", "elem5"];
```

If the mode is default, non-strict, this library will match things (object or array values or strings) containing only empty space (space character, line break or tab) agressively:

```js
delObj(
  [
    {
      x: "y",
    },
    {
      a: "a",
      b: ["\t\t\t \n\n\n"],
      c: "c",
    },
  ],
  {
    a: "a",
    b: [""],
  }
);
// => [{x: 'y'}]
```

Notice how key `a` contained a non-empty space character, so was matched exactly, but key `b` had only empty space. Since this was default non-strict mode (Boolean `true` missing as third argument), the third key `c` didn't even matter — both matched keys `a` and `b` was enough to get that plain object deleted.

Here's more of a real-life example:

```js
// require first:
const delObj = require('ast-delete-object')
...
// then, for example, delete empty style tag from parsed AST (parsed array/object-tree):
parsedHTMLObject = delObj(parsedHTMLObject, { 'tag': 'style', 'content': {} })
```

{% include "btt.njk" %}

## The story

We used a parser to parse some HTML and then deleted some objects from the AST trees on [email-comb](/os/email-comb/) (deep-nested array of objects and arrays and strings). We wanted to delete empty tag objects and couldn't find a library that does this. That's how this library came to life.

Later we stopped parsing the HTML [email-comb](/os/email-comb/), treating HTML code **as string**. This increased the speed of processing by magnitudes - what previously took a minute now takes milliseconds.

{% include "btt.njk" %}
