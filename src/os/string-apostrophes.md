---
layout: package
title: string-apostrophes
packages:
  - detergent
---

## Idea

As you know, straight apostrophes are not always typographically-correct: `John's` should be `John’s`, with [right single quote](https://www.fileformat.info/info/unicode/char/2019/index.htm) instead of [apostrophe](https://www.fileformat.info/info/unicode/char/27/index.htm).

This program converts all cases of single and double apostrophes, plus [primes](<https://en.wikipedia.org/wiki/Prime_(symbol)>).

Sources used in rules logic and unit tests:

- Oxford A-Z of Grammar and Punctuation 2nd Ed., 2009, [ISBN 978-0199564675](https://www.google.com/search?q=isbn+978-0199564675)
- Butterick's Practical Typography 2nd Ed., "Apostrophes" [chapter](https://practicaltypography.com/apostrophes.html)

{% include "btt.njk" %}

## API

When you consume this package,

```js
// Common JS:
const { convertOne, convertAll } = require("string-apostrophes");
// ES Modules:
import { convertOne, convertAll } from "string-apostrophes";
```

you get two functions: [`convertAll()`](#convertall) and [`convertOne()`](#convertone).

{% include "btt.njk" %}

## `convertAll()`

`convertAll` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | no          | Put options here             |

For example,

```js
console.log(convertAll(`test's`, {
  convertApostrophes: true,
  convertEntities: true
})).result,
// => "test&rsquo;s"
```

{% include "btt.njk" %}

### Output

A plain object is returned:

| Returned object's key | The type of its value        | Description                                               |
| --------------------- | ---------------------------- | --------------------------------------------------------- |
| `result`              | String                       | Processed string, with all ranges applied                 |
| `ranges`              | Array of zero or more arrays | [Ranges](/ranges/) that were [gathered](/os/ranges-push/) and [applied](/os/ranges-apply/) to produce `result` |

For example, if you gave string `In the '60s, rock 'n' roll` with apostrophes, the result on default settings would be:

```js
{
  result: `In the ’60s, rock ’n’ roll`,
  ranges: [
    [7, 8, `’`],
    [18, 19, `’`],
    [20, 21, `’`]
  ]
}
```

{% include "btt.njk" %}

### Options Object, `opts`

| Options Object's key | The type of its value | Default | Obligatory? | Description                                            |
| -------------------- | --------------------- | ------- | ----------- | ------------------------------------------------------ |
| `convertEntities`    | Boolean               | `false` | no          | Should we HTML-encode the characters?                  |
| `convertApostrophes` | Boolean               | `true`  | no          | Killswitch. If it's `false`, the program does nothing. |

{% include "btt.njk" %}

## `convertOne()`

`convertOne` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | yes         | Put options here             |

`opts.from` is obligatory — that's how you tell the program which characters to process.

For example:

```js
console.log(convertOne(`test's`, {
  from: 4,
  to: 5,
  convertApostrophes: true,
  convertEntities: false
})),
// => [[4, 5, "&rsquo;"]]
```

{% include "btt.njk" %}

### Output

It returns **an array** of zero or more arrays ([ranges](/ranges/)), each representing what needs to be done.

For example, result `[[2, 3, "&lsquo;"], [5, 6, "&rsquo;"]]` means "replace string chunk from index `2` to `3` with `&lsquo;`" and from index `5` to `6` with `&rsquo;`. You can use [`ranges-apply`](/os/ranges-apply/) to process a string using those ranges (in other words, "to apply those ranges").

{% include "btt.njk" %}

### Options Object, `opts`

| Options Object's key | The type of its value        | Default     | Obligatory? | Description                                                                                                                  |
| -------------------- | ---------------------------- | ----------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `from`               | Natural number, string index | `undefined` | yes         | Where does the character we need to process start in a given index?                                                          |
| `to`                 | Natural number, string index | `from + 1`  | no          | Where does the character we need to process end in a given index?                                                            |
| `value`              | String                       | `undefined` | no          | Override the value of a string value, present at `str.slice(from, to)`                                                       |
| `convertEntities`    | Boolean                      | `false`     | no          | Should we HTML-encode the characters?                                                                                        |
| `convertApostrophes` | Boolean                      | `true`      | no          | Killswitch. If it's `false`, the program does nothing.                                                                       |
| `offsetBy`           | Function                     | `undefined` | no          | If you provide a function, it will be called with a natural number input argument, meaning how much characters to skip next. |

{% include "btt.njk" %}

### opts.offsetBy

Offset is needed to bypass characters we already fixed — it happens for example, with nested quotes - we'd fix many in one go, and we need to skip the further processing; otherwise, those characters would get processed multiple times.

For example, here's how the `convertAll()` index is bumped using `offsetBy`, in a callback-fashion:

```js
function convertAll(str, opts) {
  let ranges = [];
  const preppedOpts = Object.assign({}, opts);
  // loop through the given string
  for (let i = 0, len = str.length; i < len; i++) {
    // define starting index:
    preppedOpts.from = i;
    // offset function:
    preppedOpts.offsetBy = (idx) => {
      i = i + idx;
    };
    // calculate the result:
    const res = convertOne(str, preppedOpts);
    if (Array.isArray(res) && res.length) {
      ranges = ranges.concat(res);
    }
  }
  return {
    result: rangesApply(str, ranges),
    ranges,
  };
}
```

The inner function `convertOne()` bumps outer's `convertAll()` index.

{% include "btt.njk" %}

### opts.value

Consider string `Your's` with HTML-escaped apostrophe:

```xml
Your&apos;s
```

There are various other cases of apostrophes and quotes where we have a sentence, and all apostrophes/quotes are there, and we know where just different character(s) represent them. Values are not `'` and `"`.

We are not going to code up all those cases!

Instead, use `convertOne()`, process each "symbol" one-by-one and instruct the program from where (`from`) to where (`to`) is a particular character (`value`).

For example,

```js
const { convertOne, convertAll } = require("string-apostrophes");
const res = convertOne(`test&apos;s`, {
  from: 4,
  to: 10,
  value: "'", // <-------- we insist to program that it's an apostrophe between indexes 4 and 10
  convertEntities: 0,
});
console.log(JSON.stringify(res, null, 0));
// => [[4, 10, "’"]]
```

In the example above, the program evaluates surroundings of `&apos;` as if it was a "normal" apostrophe and suggests a replacement.

In practice, that's how [`detergent`](/os/detergent/) uses this package.

{% include "btt.njk" %}

## Compared to Others

|                                                                           | This program, <br> [`string-apostrophes`](/os/string-apostrophes)                                              | [`straight-to-curly-quotes`](https://www.npmjs.com/package/straight-to-curly-quotes)                                                               | [`smartquotes`](https://www.npmjs.com/package/smartquotes)                                                               | [`typographic-quotes`](https://www.npmjs.com/package/typographic-quotes)                                                               |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
|                                                                           | [![npm link](https://img.shields.io/npm/v/string-apostrophes.svg?style=flat-square)](/os/string-remove-widows/) | [![npm link](https://img.shields.io/npm/v/straight-to-curly-quotes.svg?style=flat-square)](https://www.npmjs.com/package/straight-to-curly-quotes) | [![npm link](https://img.shields.io/npm/v/smartquotes.svg?style=flat-square)](https://www.npmjs.com/package/smartquotes) | [![npm link](https://img.shields.io/npm/v/typographic-quotes.svg?style=flat-square)](https://www.npmjs.com/package/typographic-quotes) |
| Returns processed string                                                  | ✅                                                                                                                                       | ✅                                                                                                                                                 | ✅                                                                                                                       | ✅                                                                                                                                     |
| Additionally returns index [ranges](/ranges/)                                                      | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Replaces quotes in DOM, on a web page, where you put a script in          | ❌                                                                                                                                       | ❌                                                                                                                                                 | ✅                                                                                                                       | ❌                                                                                                                                     |
| Not regex-based                                                           | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Can output HTML-encoded content upon request                              | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Killswitch to bypass processing                                           | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Allows to process any part of string as if it were single or double quote | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| CommonJS (`require()`) and ES Modules (in ES6+, `import`) builds          | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| UMD builds published to npm and available from unpkg or jsdelivr          | ✅                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ❌                                                                                                                                     |
| Serves other languages besides English                                    | ❌                                                                                                                                       | ❌                                                                                                                                                 | ❌                                                                                                                       | ✅                                                                                                                                     |

This program has string-in, string-out type API; the DOM changes capabilities are not bundled because _browser_ is only one of many possible targets of an npm program. Other consuming programs might not even have DOM or consumers might be Electron or whatever. It's best to write other, standalone apps which use API-like core function and work from original (string-in string-out), "API" package.

{% include "btt.njk" %}
