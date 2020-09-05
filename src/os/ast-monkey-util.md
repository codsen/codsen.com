---
layout: package
title: ast-monkey-util
---

## Idea

[`codsen-parser`](/os/codsen-parser/) and [`emlint`](/os/emlint/) both use [`object-path`](https://www.npmjs.com/package/object-path) notation. This utility program contains helper functions to traverse the paths.

Conceptually, we'd use [`ast-monkey-traverse`](/os/ast-monkey-traverse/), identify the node we need, then get its path (from the same program, from callbacks), then amend that path (using this program), then use `object-path` to get/set/delete that path.

{% include "btt.njk" %}

## API - `pathNext`

It takes (a string) path and increments the last digit:

```js
console.log(pathNext("0"));
// => "1"

console.log(pathNext("9.children.3"));
// => "9.children.4"

console.log(pathNext("9.children.1.children.0"));
// => "9.children.1.children.1"
```

{% include "btt.njk" %}

## API - `pathPrev`

It takes (a string) path and decrements the last digit:

```js
console.log(pathPrev("0"));
// => null

console.log(pathPrev("9.children.33"));
// => "9.children.32"

console.log(pathPrev("9.children.1.children.2"));
// => "9.children.1.children.1"
```

{% include "btt.njk" %}

## API - `pathUp`

It takes (a string) path and goes "one level" up, discarding the last two path parts:

```js
console.log(pathUp("1"));
// => null

console.log(pathUp("9.children.3"));
// => "9"

console.log(pathUp("9.children.1.children.2"));
// => "9.children.1"
```

Practically, if you think, [`codsen-parser`](/os/codsen-parser/) always outputs an array. It contains zero or more plain objects, each representing a tag, a chunk of text, a comment tag and so on.

Since root element is array, paths of those plain objects are digits: `0`, `1`, `5.children.0` and so on.

In [`codsen-parser`](/os/codsen-parser/) AST's, child nodes are nested within `children` key - its value is array:

The following HTML:

```html
<a>text</a>
```

Would yield AST (many keys omitted):

```json
[
  {
    "type": "tag",
    "start": 0,
    "end": 3,
    "value": "<a>",
    "attribs": [],
    "children": [
      {
        "type": "text",
        "start": 3,
        "end": 7,
        "value": "text"
      }
    ]
  },
  {
    "type": "tag",
    "start": 7,
    "end": 11,
    "value": "</a>",
    "attribs": [],
    "children": []
  }
]
```

Thus, a text node for value "text" (one with `"start": 3` above) is at the path `0.children.0` (first element's first child node) and "going up" would mean "0" - that's splitting by dot into an array and discarding the last two elements from that array, then joining it back with a dot.

```
0 . children . 0
        ^      ^
    these two are removed during the "go up" action
```

{% include "btt.njk" %}

## `object-path` notation

The notation used in this program is based on [`object-path`](https://www.npmjs.com/package/object-path) - an array elements are marked with dot - if object's key value is an array and we want to a path of the fourth element in there, it's `key.3`, not `key[3]`.

A drawback of this notation is that keys can't be numeric strings. But the advantage of this notation is that all children are now separated with a dot - you can split by dot `String.split(".")` and quickly process the path elements, unlike JS notation with square brackets.

{% include "btt.njk" %}

