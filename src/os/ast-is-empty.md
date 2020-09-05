---
layout: package
title: ast-is-empty
---

## Rationale

Imagine, that you have a nested array which contains plain objects, arrays and strings. Huge tree. This library can tell if it consists of only empty things, by which we mean:

- Arrays or objects with no keys, or
- Arrays or objects that have all keys equal to zero-length strings
- Arrays or objects that have all keys equal to strings that `.trim()` to zero-length
- Zero-length strings
- Or strings that would `.trim()` to zero-length (this includes tabs, line breaks, spaces or mix thereof)

These are empty things, for example:

```js
{
  a: "";
}
```

or

```js
{
  a: [""];
  b: {
    c: {
      d: "";
    }
  }
}
```

or

```js
[
  {
    a: ['']
    b: {c: {d: ''}}
  },
  '',
  ['', '', '']
]
```

Practically speaking, when you work with AST's, all the mentioned empty things are a noise which probably doesn't need to be processed (or needs to be removed altogether).

Functions are not considered to be empty and this library will return `null` if it encounters one anywhere within the `input`. Same with as `undefined` or `null` inputs — both will yield `null`.

{% include "btt.njk" %}

## API

Default function is exported.
Its API is "Anything-in, Boolean-out".
Also, when inappropriate things are given that don't belong to AST's, `null`-out.

```js
isEmpty(
  input // AST tree, or object or array or whatever. Can be deeply-nested.
);
// => true||false||null
```

{% include "btt.njk" %}
