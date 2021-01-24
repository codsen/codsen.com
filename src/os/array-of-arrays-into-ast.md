---
layout: package
title: array-of-arrays-into-ast
---

## Purpose

It consumes array of arrays and produces a [trie](https://en.wikipedia.org/wiki/Trie)-like AST from them. This library was a piece of a one experimental code generator of ours.

{% include "btt.njk" %}

## API

:::api
generateAst(
  inputArr,
  [opts]
)
:::

### API - Input

| Input argument | Type                         | Obligatory? | Description                                    |
| -------------- | ---------------------------- | ----------- | ---------------------------------------------- |
| `input`        | Array of zero or more arrays | yes         | Source of data to put into an AST              |
| `otps`         | Plain object                 | no          | An Optional Options Object. See its API below. |

{% include "btt.njk" %}

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description     |
| ---------------------- | ------- | ------- | --------------- |
| `dedupe`               | Boolean | `true`  | Skip duplicates |

**Here are all defaults in one place for copying**:

```js
{
  dedupe: true,
}
```

When unused, Optional Options Object can also be passed as a `null` or `undefined` value.

{% include "btt.njk" %}

### API - Output

| Type         | Description      |
| ------------ | ---------------- |
| Plain object | AST of the input |

## `opts.dedupe`

If you generate the AST with default settings, `dedupe` setting will be active and duplicate paths won't be created:

```js
import generateAst from "array-of-arrays-into-ast";
const res = generateAst([[1], [1], [1]]);
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// res = {
//   1: [null]
// }
```

Now, see what happens when you turn off `opts.dedupe`:

```js
import generateAst from "array-of-arrays-into-ast";
const res = generateAst([[1], [1], [1]], { dedupe: false });
console.log(
  `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(res, null, 4)}`
);
// res = {
//   1: [null, null, null]
// }
}
```

Notice how entries for each branch were created.

Generally, we don't see the reason why you'd want duplicates, but the setting is there if you ever need it. 👍🏻

{% include "btt.njk" %}

## Principles

Every object's key will have a value of `array`.

- `null` inside that array means it's the tip of the branch.

- An object inside that array means the branch continues.

Simples.

## Compared vs. `datastructures-js`

There are libraries that produce and manage _trie_ data structures, for example, [datastructures-js](https://www.npmjs.com/package/datastructures-js#trie). In particular case, the problem is, the data structure is abstracted behind the `let trie = ds.trie();` and you can't access it directly, traversing the nested tree of arrays and objects.

[datastructures-js](https://www.npmjs.com/package/datastructures-js#trie) _trie_ would limit to `search()`, `traverse()` and `count()` methods. However, we need to recursively traverse every node and look up and down, what's around it.

Here's where this library comes in. It doesn't abstract the data it's producing - you get a nested plain object which you can traverse and further process any way you like, using a vast ocean of `object-` processing libraries.

{% include "btt.njk" %}
