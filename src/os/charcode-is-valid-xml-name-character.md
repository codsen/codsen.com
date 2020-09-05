---
layout: package
title: charcode-is-valid-xml-name-character
packages:
  - emlint
  - is-media-descriptor
  - is-relative-uri
---

## What is does

It returns a Boolean, is the given character the [Production 4a](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) of XML spec, or in human terms, a possible ending character of an XML element.

This library is used to detect where (X)HTML element names end.

This article contains an in-depth explanation of the spec terminology: https://www.xml.com/pub/a/2001/07/25/namingparts.html — it helped me to get up to speed on this subject.

{% include "btt.njk" %}

## In practice

Let's say you are iterating through string, character-by-character and it contains (X)HTML code source. This library will evaluate any given character and tell, is it a valid character for an element name. You use this library to detect where element names end.

In the most simple scenario:

```
<img class="">
    ^     ^
    1     2
```

Characters `space` (1) and `=` (2) in the example above mark the ending of the element names (`img` and `class`). OK, so we know spaces and equals' are not allowed as element names and therefore mark their ending. Are there more of such characters? Oh yes. Quite a lot according to [spec](https://www.w3.org/TR/REC-xml/#NT-NameChar) what warrants a proper library dedicated only for that purpose.

{% include "btt.njk" %}

## API

Two functions - one to check requirements for **first character**, another to check requirements for **second character** and onwards. Both functions return a Boolean.

<table>
  <tr>
    <th>Function's name</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><code>isProduction4</code></td>
    <td colspan="2">To tell, is this character suitable to be the first character</td>
  </tr>
  <tr>
    <td><code>validFirstChar</code></td>
  </tr>
  <tr>
    <td><code>isProduction4a</code></td>
    <td colspan="2">To tell, is this character suitable to be the second character and onwards</td>
  </tr>
  <tr>
    <td><code>validSecondCharOnwards</code></td>
  </tr>
</table>

{% include "btt.njk" %}

### `isProduction4()` / `validFirstChar()` - requirements for 1st char

XML spec [production 4](https://www.w3.org/TR/REC-xml/#NT-NameStartChar) - the requirements for the first character of the XML element. It's more strict than requirements for the subsequent characters, see [production 4a]() below.

Pass any character (including astral-one) into function `isProduction4()`, and it will respond with a Boolean, is it acceptable as first XML character (or not).

```js
const {
  isProduction4,
  validFirstChar,
  // isProduction4a,
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4("-"); // or use validFirstChar(), the same
console.log("res1 = " + res1);
// => 'res1 = false <---- minus is not allowed for first character

const res2 = isProduction4("z"); // or use validFirstChar(), the same
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising two surrogates).
**Returns** Boolean - is it acceptable as the first character in XML element's name.

{% include "btt.njk" %}

### `isProduction4a()` / `validSecondCharOnwards()` - requirements for 2nd char onwards

XML spec [production 4a](https://www.w3.org/TR/REC-xml/#NT-NameChar) - the requirements for the second character onwards in XML element's name.

Pass any character (including astral-one) into function `isProduction4a()`, and it will respond with a Boolean, is it acceptable as second XML character and onwards (or not). Requirements are same as for the first character but a bit more permissive.

```js
const {
  // isProduction4,
  isProduction4a,
} = require("charcode-is-valid-xml-name-character");

const res1 = isProduction4a("-"); // or use validSecondCharOnwards(), the same
console.log("res1 = " + res1);
// => 'res1 = true <---- minus is allowed for second character-onwards

const res2 = isProduction4a("z"); // or use validSecondCharOnwards(), the same
console.log("res2 = " + res2);
// => 'res2 = true
```

It **consumes** a single character (can be any Unicode character, including astral-one, comprising two surrogates).
**Returns** Boolean - is it acceptable as the second or subsequent character in XML element's name.

{% include "btt.njk" %}
