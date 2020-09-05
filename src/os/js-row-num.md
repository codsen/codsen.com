---
layout: package
title: js-row-num
---

## Idea

When we create libraries, add new features to them and/or look for bugs, we rely on `console.log` statements. On every one of our libraries, there's Rollup plugins set ([rollup-plugin-strip](
https://www.npmjs.com/package/@rollup/plugin-strip) and [rollup-plugin-cleanup](https://www.npmjs.com/package/rollup-plugin-cleanup)) who remove all comments and `console.log` statements from the built files that later get published (`dist/` folder's contents). This means we can commit our source files (`src/` folder's contents) **with** `console.log` statements.

Now, when troubleshooting code, there are two essential pieces of information: **what** happened and **from where** it happened:

```js
console.log(`056 SET counter = ${counter}`);
//            ^  └-----------------------┘
//          where      what happened
```

_Where_ part is the `console.log` statement's row number we like to add.

Now, we need an automated tool to update row numbers because there will be many `console.log` rows and it's enough to add or remove one line of code, and all numbers below will be offset.

This library updates row numbers in JS file `console.log` statements. It is an API for other tools - it consumes string (hopefully some JS code) and returns a string (hopefully, also, some JS code). Browser plugins, web apps or Node CLI applications can tap this application to do all the updating work.

{% include "btt.njk" %}

## Usage

Let's say we want to put row numbers in front of each `console.log` statement and automatically update them:

```js
const fixRowNums = require("js-row-num");
const source = `let filler = "z"; // 1st row
filler = "z"; // 2nd row
filler = "z"; // 3rd row
filler = "z"; // 4th row
filler = "z"; // 5th row
console.log(
  \`099 filler = \${filler} // 7th row
\`);
`;
const res = fixRowNums(source);
// =>
// "let filler = "z"; // 1st row
//  filler = "z"; // 2nd row
//  filler = "z"; // 3rd row
//  filler = "z"; // 4th row
//  filler = "z"; // 5th row
//  console.log(
//    \`007 filler = \${filler} // 7th row
//  \`);
// "
```

Notice how the first number within `console.log` got updated from `099` to `007`.

{% include "btt.njk" %}

## API

API is simple: `string` in, `string` out. No options, everything beyond the 1st argument will be ignored.

### Optional Options Object

| options object's key | Type of its value                       | Default value     | Description                                                                                                                                                                                                                         |
| -------------------- | --------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `padStart`           | Zero, natural number or anything falsey | `3`               | Sets how much digits will be padded                                                                                                                                                                                                 |
| `overrideRowNum`     | integer or something falsey             | `null`            | If you have console.log contents already extracted and know the row number, you can pass that row number here. Multiple `console.log`s on multiple lines won't be recognised, we assume you'll process each console.log one by one. |
| `returnRangesOnly`   | boolean                                 | `false`           | When enabled, instead of string, program will return result in [ranges](/ranges/) notation.                                                                                                             |
| `triggerKeywords`    | `null` or array of zero or more strings | `["console.log"]` | After this string, first met chunks of numbers will be replaced with padded row number, unless letter is met first                                                                                                                  |
| `extractedLogContentsWereGiven`    | Normally we expect whole line to be given, but if you give extracted contents of `console.log`, activate this flag. |

Here it is all in one place:

```js
{
  padStart: 3,
  overrideRowNum: null,
  returnRangesOnly: false,
  triggerKeywords: ["console.log"],
  extractedLogContentsWereGiven: false,
}
```

{% include "btt.njk" %}

## Rules

Only the digits within `console.log` string will be replaced.

If the letter (either case) precedes the number, it will not be replaced. We agree that numbers should be in front of the `console.log` statement:

This row number will be replaced:

```js
console.log("000 This number in front will be replaced");
// ...replaced into:
console.log("001 This number in front will be replaced");
```

But not this (because letters precede `000`):

```js
// will not be replaced:
console.log("This number: 000 will not be replaced because letter precedes it");
```

The type of quotes doesn't matter: single, double or backticks, as long as opening quote matches the closing quote.

All non-letter characters in front of a digit will not be touched.

Only one lump of digits will be replaced. Second lump onwards will not be touched:

```js
console.log("888 999 This number in front will be replaced");
// ...replaced with:
console.log("001 999 This number in front will be replaced"); // it's first line, so "001"
```

EOL type does not matter; we support all three types of EOL's: `\n`, `\r` and `\r\n` (see unit tests under group `05.01`).

If you don't use `console.log`, put your function's name in `opts.triggerKeywords`:

```js
fixRowNums(`a\nb\nc\n log(\`1 something\`)`, { triggerKeywords: ["log"] }),
// => "a\nb\nc\n log(\`004 something\`)"
```

Above, `log()` is used and it's on the fourth row and padding is default (three).

{% include "btt.njk" %}

## `opts.overrideRowNum`

If you process each `console.log` one by one (like we do in [`eslint-plugin-row-num`](/os/eslint-plugin-row-num/)) and you already know the row number, you can use this program to pad it and perform the replacement.

```js
const fixRowNums = require("js-row-num");
const res = fixRowNums(
  `
console.log('099 something')
`,
  {
    overrideRowNum: 5,
  }
);
console.log(res);
// =>
// console.log('005 something')
//
```

## `opts.returnRanges`

{% markdown '/src/components/content/ranges-explanation.md' %}

Upon request, `string-strip-html` can also return _ranges_ instead of a final string.

```js
const fixRowNums = require("js-row-num");
const res = fixRowNums(
  `
console.log('099 something')
`,
  {
    overrideRowNum: 5,
    returnRangesOnly: true,
  }
);
console.log(res);
// =>
// [
//    [ 15, 18, "005"]
// ]
//
```

{% include "btt.njk" %}

## `opts.triggerKeywords`

Setting `opts.triggerKeywords` to `null` will disable all keywords, program will do nothing. In all other cases, where `opts.triggerKeywords` is an empty array, `undefined` or boolean `false`, the default, `console.log` will kick in and the input will be processed.

{% include "btt.njk" %}

## `opts.extractedLogContentsWereGiven`

Sometimes we have other programs processing the code and `console.log` contents come in already extracted. We just want this program to extract line numbers and update them. That's when this option comes in.

{% include "btt.njk" %}
