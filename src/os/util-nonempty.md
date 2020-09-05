---
layout: package
title: util-nonempty
---

## Quick Take

A quick utility function, to be able to detect is the input not empty.

```js
nonEmpty("z");
// => true

nonEmpty("");
// => false

nonEmpty(["a"]);
// => true

nonEmpty([123]);
// => true

nonEmpty([[[[[[[[[[[]]]]]]]]]]]);
// => false

nonEmpty({ a: "a" });
// => true

nonEmpty({});
// => false

var f = function () {
  return "z";
};
nonEmpty(f);
// => false (answer is instantly false if input is not array, plain object or string)
```

If you want to check _non-emptiness_ of complex nested trees of objects, arrays and strings (like parsed HTML [AST](/os/codsen-parser/)), you need a library which can **recursively traverse that**. There are two options:

- If you want to check for **strict** emptiness, that is `[]` or `{}` is empty, but `{aaa: ' \n\n\n ', ' \t'}` is not, see [ast-is-empty](/os/ast-is-empty)
- If your "emptiness" definition is "everything that `String.trim()`'s to an empty string'" (this includes tabs, spaces and line breaks for example, but not letters), see [ast-contains-only-empty-space](/os/ast-contains-only-empty-space).

{% include "btt.njk" %}

## API

A function: anything-in, boolean-out.
