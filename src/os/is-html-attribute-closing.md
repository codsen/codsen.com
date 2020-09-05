---
layout: package
title: is-html-attribute-closing
---

## Idea

Detect, is a character at a given index in a given string being a closing of an attribute?

In happy path scenarios, the closing is a closing quote of an attribute:

```js
const isAttrClosing = require("is-html-attribute-closing");
const str = `<a href="zzz" target="_blank" style="color: black;">`;

// <a href="zzz" target="_blank" ...
//                      ^
//                  index 21

// <a href="zzz" target="_blank" ...
//                             ^
//                         index 28

const res = is(
  str, // reference string
  21, // known opening (or in absence of a quote, a start of a value)
  28 // we question, is this a closing on the attribute?
);
console.log(res);
// => true - it is indeed a closing of an attribute
```

But this program detects all the crazy cases of realistic and unrealistic HTML attribute endings:

```js
const isAttrClosing = require("is-html-attribute-closing");
const res1 = is(
  `<a href="z' click here</a>`,
  //       ^ ^
  //       | \
  //       |  \_________________________________
  //       |                                   |
  8, // known opening                          |
  10 // is this an attribute closing at index 10?
);
console.log(res1);
// => true - yes, indeed a closing of an attribute

// -----------------------------------------------------------------------------

const res2 = is(
  `<a b = = = "c" d = = = 'e'>`,
  //          ^ ^
  //          | |
  //          | L_______________________________
  //          |                                |
  11, // known opening                         |
  13 // is this an attribute closing at index 13?
);
console.log(res2);
// => true - indeed a closing of an attribute

// -----------------------------------------------------------------------------

// imagine a healthy tag:
// <img class="so-called" alt="!" border='10'/>
// now let's mess it up a little bit:
const str = `<img class="so-called "alt !' border 10'/>`;

// all targetting the class opening at 11
console.log(is(str, 11, 22));
// => true - indeed a closing of an attribute

console.log(is(str, 11, 28));
// => false

console.log(is(str, 11, 28));
// => false
```

{% include "btt.njk" %}

## API - Input

**isOpening(str, idxOfAttrOpening, isThisClosingIdx)** — in other words, function which takes three arguments:

| Input argument     | Key value's type       | Obligatory? | Description                                             |
| ------------------ | ---------------------- | ----------- | ------------------------------------------------------- |
| `str`              | String                 | yes         | The input string of zero or more characters             |
| `idxOfAttrOpening` | Natural number or zero | yes         | Index of an opening quote of an attribute               |
| `isThisClosingIdx` | Natural number         | yes         | Index we ask program to evaluate, is it a closing quote |

This program does not throw. It just returns `false`.

If anything is wrong with the input arguments, the program returns **false**. It never throws. That's because it's to be used inside other programs. Idea is, proper algorithms that will use this program will "care" only about the **truthy** case: does the given quote pass as a closing-one. Crappy input arguments yields `false`, happy days, consuming algorithms continue whatever dodgy journeys they have been making.

We don't throw errors in this program.

{% include "btt.njk" %}

## API - Output

Boolean, `true` or `false`. Erroneous input arguments will yield `false` as well.

## Bigger picture

This program will drive [`codsen-tokenizer`](/os/codsen-tokenizer/).

There's already a similar program from yours truly, [`is-html-tag-opening`](/os/is-html-tag-opening/) which tells, is given opening bracket a start of a tag.

The same situation - program with its unit tests became too big to even be placed in `src/utils/` folder, so we separated it into a standalone package...

{% include "btt.njk" %}

