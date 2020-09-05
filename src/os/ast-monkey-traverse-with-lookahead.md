---
layout: package
title: ast-monkey-traverse-with-lookahead
---

## Idea

Original [`ast-monkey-traverse`](/os/ast-monkey-traverse/) had means to edit the AST and couldn't give you the next few values that are coming up. It only "saw" the current thing it traversed.

While working on [`codsen-parser`](/os/codsen-parser/), we found that: A) we don't need AST editing functionality (perf win) and B) we need to see what nodes are coming next.

Instead of bloating [`ast-monkey-traverse`](/os/ast-monkey-traverse/) and slowing it down, we decided to create alternative flavour of it, this program.

{% include "btt.njk" %}

## API

`traverse2()` is a function. It traverses AST tree given to it in the first input argument. You use it via a callback (arrow function `(key, val, innerObj, stop) => {...}` below for example), similar way to `Array.forEach()`:

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
var ast = [{ a: "a", b: "b" }];
traverse2(ast, (key, val, innerObj, stop) => {
  console.log(`key = ${JSON.stringify(key, null, 4)}`);
  console.log(`val = ${JSON.stringify(val, null, 4)}`);
  console.log(`innerObj = ${JSON.stringify(innerObj, null, 4)}`);
});
```

Unlike in [`ast-monkey-traverse`](/os/ast-monkey-traverse/), this program is read-only so you don't need to return anything inside the callback.

You can't delete or change values of AST in this program.

{% include "btt.njk" %}

#### innerObj in the callback

When you call `traverse2()` like this:

```js
traverse2(input, function (key, val, innerObj, stop) {
  ...
})
```

you get four variables:

- `key`
- `val`
- `innerObj`
- `stop` - set `stop.now = true;` to stop the traversal

If `traverse2()` is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If `traverse2()` is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

| `innerObj` object's key | Type                                                      | Description                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `depth`                 | Integer number                                            | Zero is the root, topmost level. Every level deeper increments `depth` by `1`.                                                                                                                                                                                                                                                                        |
| `path`                  | String                                                    | The path to the current value. The path uses exactly the same notation as the popular [object-path](https://www.npmjs.com/package/object-path) package. For example, `a.1.b` would be: input object's key `a` > value is an array, take `1`st index (second element in a row, since indexes start from zero) > value is an object, take it's key `b`. |
| `topmostKey`            | String                                                    | When you are very deep, this is the topmost parent's key.                                                                                                                                                                                                                                                                                             |
| `parent`                | Type of the parent of the current element being traversed | A whole parent (array or a plain object) which contains the current element. Its purpose is to allow you to query the **siblings** of the current element.                                                                                                                                                                                            |
| `parentType`            | String                                                    | Either `array` if parent is array or `object` if parent is **a plain object** (not the "object" type, which includes functions, arrays etc.).                                                                                                                                                                                                         |
| `next`                  | Array                                                     | Zero or more arrays, each representing a set of callback call arguments that will be reported next.                                                                                                                                                                                                                                                   |

{% include "btt.njk" %}

## Looking into the future

The whole point of this program is being able to "see" the future. Otherwise, you're be using vanilla [`ast-monkey-traverse`](/os/ast-monkey-traverse/).

You can request how many sets from the future you want to have reported using the third argument, for example:

```js
const gathered = [];
traverse(
  input,
  (key1, val1, innerObj) => {
    gathered.push([key1, val1, innerObj]);
  },
  2 // <---------------- ! lookahead
);
```

Now, the `innerObj.next` array will be populated with that many upcoming sets of values.

For example, consider this AST:

```js
const ast = [
  {
    a: "b",
  },
  {
    c: "d",
  },
  {
    e: "f",
  },
];
```

If you didn't request lookahead, if it's default zero, and you traversed it simply pushing all inputs into an array:

```js
const gathered = [];
traverse(
  input,
  (key1, val1, innerObj) => {
    gathered.push([key1, val1, innerObj]);
  },
  0 // <--- hardcoded lookahead, zero sets requested from the future, but it can be omitted
);
```

You'd get `gathered` populated with:

```
[
  // ===================
  [
    {
      a: "b",
    },
    null,
    {
      depth: 0,
      path: "0",
      parent: [
        {
          a: "b",
        },
        {
          c: "d",
        },
        {
          e: "f",
        },
      ],
      parentType: "array",
      next: [],
    },
  ],
  // ===================
  [
    "a",
    "b",
    {
      depth: 1,
      path: "0.a",
      parent: {
        a: "b",
      },
      parentType: "object",
      next: [],
    },
  ],
  // ===================
  ...
```

Notice above, `next: []` is empty. No future sets are reported.

But, if you request the next set to be reported:

```js
const gathered = [];
traverse(
  input,
  (key1, val1, innerObj) => {
    gathered.push([key1, val1, innerObj]);
  },
  1 // <---------------- ! lookahead
);
```

You'd get `gathered` populated with:

```
[
  // ===================
  [
    {
      a: "b",
    },
    null,
    {
      depth: 0,
      path: "0",
      parent: [
        {
          a: "b",
        },
        {
          c: "d",
        },
        {
          e: "f",
        },
      ],
      parentType: "array",
      next: [
        [
          "a",
          "b",
          {
            depth: 1,
            path: "0.a",
            parent: {
              a: "b",
            },
            parentType: "object",
          },
        ],
      ],
    },
  ],
  // ===================
  [
    "a",
    "b",
    {
      depth: 1,
      path: "0.a",
      parent: {
        a: "b",
      },
      parentType: "object",
      next: [
        [
          {
            c: "d",
          },
          null,
          {
            depth: 0,
            path: "1",
            parent: [
              {
                a: "b",
              },
              {
                c: "d",
              },
              {
                e: "f",
              },
            ],
            parentType: "array",
          },
        ],
      ],
    },
  ],
  // ===================
  ...
```

Notice how `innerObj.next` is reporting one set from the future, as you requested.

{% include "btt.njk" %}

## Stopping

Here's how to stop the traversal. Let's gather all the traversed paths first. By the way, paths are marked in [object-path](https://www.npmjs.com/package/object-path) notation (arrays use dots too, `a.1.b` instead of `a[1].b`).

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse2(input, (key1, val1, innerObj) => {
  const current = val1 !== undefined ? val1 : key1;
  gathered.push(innerObj.path);
  return current;
});
console.log(gathered);
// => ["a", "b", "b.c"]
```

All paths were gathered: `["a", "b", "b.c"]`.

Now let's make the monkey to stop at the path "b":

```js
const traverse2 = require("ast-monkey-traverse-with-lookahead");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse2(input, (key1, val1, innerObj, stop) => {
  const current = val1 !== undefined ? val1 : key1;
  gathered.push(innerObj.path);
  if (innerObj.path === "b") {
    stop.now = true; // <---------------- !!!!!!!!!!
  }
  return current;
});
console.log(gathered);
// => ["a", "b"]
```

Notice how there were no more gathered paths after "b", only `["a", "b"]`.

Stopping is not affected by lookahead, it does not matter how many sets from the future you request, a stopping will happen in the right place.

{% include "btt.njk" %}

## Why this program is read-only

This program is aimed at AST traversal, for example, to be used in [`codsen-parser`](/os/codsen-parser/), to enable the parser to patch up AST errors. When parser sees something wrong, it needs to see the next AST node to make a decision: is it something missing or is it something rogue what should be skipped?

Normally, people don't mutate the AST - if you do need to delete something from it, note the path and perform the operation outside of the traversal.

On the other hand, the deletion feature impacts performance. That's why we made this program read-only.

{% include "btt.njk" %}
