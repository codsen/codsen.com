---
layout: package
title: ast-get-values-by-key
---

## Use

Tag getter in parsed HTML:

```js
// get
const get = require("ast-get-values-by-key");
var res = get(
  {
    tag: "html",
  },
  "tag" // < tag to look for
);
console.log("res = " + JSON.stringify(res, null, 4));
// => res = [{val: "html", path: "tag"}]
```

Tag setter in parsed HTML — just pass array of values to write as a third argument:

```js
// set
const get = require("ast-get-values-by-key");
var res = get(
  {
    tag: "html",
  }, // <--- input
  "tag", // <--- key to look for
  ["style"] // <---- list of values to rewrite the values of the above keys if found
);
console.log("res = " + JSON.stringify(res, null, 4));
// res = {
//         tag: "style"
//       }
```

{% include "btt.njk" %}

## Purpose

When you parse some HTML using a [parser](/os/codsen-parser/), you get an array which contains an AST — a nested tree of strings, objects and arrays. This library lets you query that tree — you can get an array of all the key values you want. Later, if you amend and feed this query result again into the `getAllValuesByKey` as a third argument, you can overwrite all the values.

Two arguments triggers GET mode; three arguments is SET (or write over) mode.

{% include "btt.njk" %}

## API

```js
getAllValuesByKey(
  input, // PLAIN OBJECT OR ARRAY. Can be nested.
  whatToFind, // STRING OR ARRAY OF STRINGS. The name of the key to find. We'll put its value into results array. You can use wildcards (uses Matcher.js).
  replacement // (OPTIONAL) ARRAY. The amended output of the previous call to getAllValuesByKey() if you want to write.
);
```

- If two arguments are given, it's **getter**. You'll receive an array of zero or more plain objects with keys: `val` and `path`, where `path` follows [`object-path`](https://www.npmjs.com/package/object-path) notation.

- If three arguments are given, it's **setter**. You'll receive a copy of original input, changed accordingly.

This library does not mutate any input arguments.

{% include "btt.njk" %}
