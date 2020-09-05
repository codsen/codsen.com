---
layout: package
title: ast-contains-only-empty-space
---

## Use

```js
const empty = require('ast-contains-only-empty-space')
...
// All values are empty, this means this object contains only empty space.
// Notice it's nested in an array, it does not matter.
console.log(empty([{ 'content': {} }]))
// => true

console.log(empty([{ 'tag': 'style' }]))
// => false

// Works on simple arrays as well:
console.log(empty(['   ', ' ']))
// => true

// Works on strings as well:
console.log(empty('   '))
// => true

// Object keys that have values as null are considered empty:
console.log(empty({a: null}))
// => true

// Works no matter how deeply nested input is:
console.log(empty(
  {
    a: [{
      x: {
        y: [
          {
            z: [
              '\n'
            ]
          }
        ]
      }
    }],
    b: ['\t\t\t  '],
    c: ['\n \n\n'],
    d: ['\t   ']
  }
))
// => true
```

{% include "btt.njk" %}

## Rationale

Working with parsed HTML is always a battle against the white space. Often you need to know, does certain AST piece (object/array/whatever) contain anything real, or just an empty space. That's what this library is for.

In real life, parsed HTML trees will have many levels of nested arrays, objects and strings. While it's easy to check does a plain object contain only empty space (`'\n'`, `' '`, `'\t'`, line break or a mix of thereof), it's not so easy when your object has arrays of empty objects. We want a solid, tested library which can identify emptiness (or lack of) in anything, nested or not nested.

By the way, weird things (like functions, which don't belong to parsed HTML structures) will yield a result `false`.

{% include "btt.njk" %}

## API

Input - anything. Output - Boolean.

```js
empty(input); // array, object or string — normally AST (which is array of nested objects/strings/arrays)
// => true/false
```

This library does not mutate the input arguments.

{% include "btt.njk" %}
