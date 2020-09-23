---
layout: package
title: string-character-is-astral-surrogate
packages:
  - detergent
---

## Idea

This program identifies high and low surrogates, specifically.

The API comprises of two functions:

**isHighSurrogate (char)**

**isLowSurrogate (char)**

It reads the character at first index (the first Unicode code point) and evaluates its `charcode`. That's it. If there are more characters they are ignored.

In theory, high surrogate goes first, low surrogate goes second [source](https://unicodebook.readthedocs.io/unicode_encodings.html#surrogates). This program enables us to detect surrogate-related errors, for example, malformed emoji or parts of emoji.

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
