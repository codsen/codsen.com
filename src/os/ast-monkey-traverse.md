---
layout: package
title: ast-monkey-traverse
---

## Idea

Walk through every single element of an array or key of an object or every string in the given input, use familiar callback function interface (just like `Array.forEach` or `Array.map`).

## API

`traverse()` is an inner method meant to be used by other functions. It does the actual traversal of the AST tree (or whatever input you gave, from simplest string to most complex spaghetti of nested arrays and plain objects). This ~method~ function is used via a callback function, similarly to `Array.forEach()`.

```js
const traverse = require("ast-monkey-traverse");
var ast = [{ a: "a", b: "b" }];
ast = traverse(ast, function (key, val, innerObj, stop) {
  let current = val !== undefined ? val : key;
  // if you are traversing and "stumbled" upon an object, it will have both "key" and "val"
  // if you are traversing and "stumbled" upon an array, it will have only "key"
  // you can detect either using the principle above.
  // you can also now change "current" - what you return will be overwritten.
  // return `NaN` to give instruction to delete currently traversed piece of AST.
  return current; // #1 <------ it's obligatory to return it, unless you want to assign it to "undefined"
});
```

It's very important to **return the value of the callback function** (point marked `#1` above) because otherwise whatever you return will be written over the current AST piece being iterated.

If you want to delete, return `NaN`.

{% include "btt.njk" %}

#### innerObj in the callback

When you call `traverse()` like this:

```js
input = traverse(input, function (key, val, innerObj, stop) {
  ...
})
```

you get four variables:

- `key`
- `val`
- `innerObj`
- `stop` - set `stop.now = true;` to stop the traversal

If `traverse()` is currently traversing a plain object, going each key/value pair, `key` will be the object's current key and `val` will be the value.
If `traverse()` is currently traversing an array, going through all elements, a `key` will be the current element and `val` will be `null`.

| `innerObj` object's key | Type                                                  | Description                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `depth`                 | Integer number                                        | Zero is root, topmost level. Every level deeper increments `depth` by `1`.                                                                                                                                                                                                                                                                      |
| `path`                  | String                                                | The path to the current value. The path uses exactly the same notation as the popular [object-path](https://www.npmjs.com/package/object-path) package. For example, `a.1.b` would be: input object's key `a` > value is array, take `1`st index (second element in a row, since indexes start from zero) > value is object, take it's key `b`. |
| `topmostKey`            | String                                                | When you are very deep, this is the topmost parent's key.                                                                                                                                                                                                                                                                                       |
| `parent`                | Type of the parent of current element being traversed | A whole parent (array or a plain object) which contains the current element. Its purpose is to allow you to query the **siblings** of the current element.                                                                                                                                                                                      |
| `parentType`            | String                                                | Either `array` if parent is array or `object` if parent is **a plain object** (not the "object" type, which includes functions, arrays etc.).                                                                                                                                                                                                   |

{% include "btt.njk" %}

## Stopping

Here's how to stop the traversal. Let's gather all the traversed paths first. By the way, paths are marked in [object-path](https://www.npmjs.com/package/object-path) notation (arrays use dots too, `a.1.b` instead of `a[1].b`).

```js
const traverse = require("ast-monkey-traverse");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse(input, (key1, val1, innerObj) => {
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
const traverse = require("ast-monkey-traverse");
const input = { a: "1", b: { c: "2" } };
const gathered = [];
traverse(input, (key1, val1, innerObj, stop) => {
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

{% include "btt.njk" %}

## Compared to `ast-monkey-traverse-with-lookahead`

`ast-monkey-traverse` can amend AST (it matters what you return within a callback)
`ast-monkey-traverse-with-lookahead` is read-only, it can't amend AST it reads

`ast-monkey-traverse` does not "see" future nodes, it just reports what it has just traversed
`ast-monkey-traverse-with-lookahead` can report as many nodes "from the future", upon request

Personally, in the context of [linting](/os/emlint), [parsing](/os/codsen-parser/) and other [tooling](/os/codsen-tokenizer/), we're going to use `ast-monkey-traverse-with-lookahead` because we don't need to mutate the AST, yet we need to "see" what's next in order to patch AST tree errors.

{% include "btt.njk" %}
