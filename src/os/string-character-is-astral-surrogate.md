---
layout: package
title: string-character-is-astral-surrogate
packages:
  - detergent
---

## Idea

When you traverse a string the most efficient way, index-by-index, using a `for` loop, you might stumble upon an astral character's low and high surrogates. This library helps to identify them.

No other library seems to be able to do that. For example, [astral-regex](https://www.npmjs.com/package/astral-regex) can tell you, does a string contain astral characters or does the given character comprise of two surrogates. But it won't help you identify them _separately_.

We need to be able to identify **surrogates separately** to be able to cover cases such as surrogates without second counterpart.

In itself, this library is very simple, two functions:

**isHighSurrogate (char)**

**isLowSurrogate (char)**

It reads the character at first index (the first Unicode code point) and evaluates its `charcode`. That's it. If there are more characters they are ignored.

In theory, high surrogate goes first, low surrogate goes second [source](https://unicodebook.readthedocs.io/unicode_encodings.html#surrogates).

{% include "btt.njk" %}

## Usage

```js
const {
  isHighSurrogate,
  isLowSurrogate,
} = require("string-character-is-astral-surrogate");
// 🧢 = \uD83E\uDDE2
console.log(isHighSurrogate("\uD83E"));
// => true
// the first character, high surrogate of the cap is indeed a high surrogate

console.log(isHighSurrogate("\uDDE2"));
// => false
// the second character, low surrogate of the cap is NOT a high surrogate

console.log(isLowSurrogate("\uD83E"));
// => false
// the first character, high surrogate of the cap is NOT a low surrogate
// it's high surrogate

console.log(isLowSurrogate("\uDDE2"));
// => true
// the second character, low surrogate of the cap is indeed a low surrogate

// PS.
// undefined yields false, doesn't throw
console.log(isHighSurrogate(undefined));
// => false

console.log(isLowSurrogate(undefined));
// => false
```

{% include "btt.njk" %}

## API

Two functions, same API:
**isHighSurrogate(str)**
**isLowSurrogate(str)**

**Input**: zero or more characters, where `charCodeAt(0)` will be evaluated.
**Output**: Boolean

- If input is empty string or undefined, `false` is returned.
- If input is anything other than the string or undefined, type error is thrown.
- If input consists of more characters, everything beyond `.charCodeAt(0)` is ignored.

We return false to make life easier when traversing the string. When you check "next" character, if it doesn't exist, as far as astral-ness is concerned, we're fine, so it yields `false`. Otherwise, you'd have to check the input before feeding into this library and that's is tedious. This is a low-level library and it doesn't have to be picky.

{% include "btt.njk" %}
