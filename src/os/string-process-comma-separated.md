---
layout: package
title: string-process-comma-separated
packages:
  - detergent
---

## Purpose

Imagine, you need to extract and validate `50%` and `50%` of HTML attribute values: `<FRAMESET rows="50%, 50%">`.

The first algorithm idea seems simple:

```js
str
  .split(",")
  .forEach(oneOfValues => {
    ...
  })
```

But in real life, the proper extraction is quite complex and you need to cover all error cases:

- There might be surrounding whitespace `<FRAMESET rows=" 50%, 50% ">`
- There might be spaces after the comma - it might be OK or not - `<FRAMESET rows=" 50%, 50% ">`
- Plain errors like leading comma - `<FRAMESET rows=" ,, 50%, 50% ">`
- There might be non-space characters that look like space like [NBSP](http://www.fileformat.info/info/unicode/char/00a0/index.htm)

This program helps to extract chunks of strings from potentially comma-separated list of string (it might be a single value, without commas).

Separator is configurable via `opts.separator`, so it might be not comma if you wish.

Errors are pinged to a separate callback function.

{% include "btt.njk" %}

## Usage

Same thing like in `Array.forEach`, we use callbacks, which allows you to tailor what happens with the values that the program gives you.

Here is quite a contrived example, too crazy to be real, but it shows the capabilities of the algorithm:

Instead of expected,

```html
<frameset rows="50%,50%"></frameset>
```

we have:

```html
<frameset rows=" ,,\t50% ,    50% ,\t\t,"></frameset>
```

The program above extracts both values `50%` (string index ranges are fed to the callback, [20, 23] and [27, 30]) and reports all rogue spaces, tabs, non-breaking space and commas.

This program saves you time from having to tackle all those possible error cases: rogue separators, consecutive separators and spaces.

{% include "btt.njk" %}

## API

**processCommaSeparated(str, [opts])**

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

### API - Input

| Input argument | Key value's type | Obligatory? | Description                            |
| -------------- | ---------------- | ----------- | -------------------------------------- |
| `input`        | String           | yes         | Input string                           |
| `opts`         | Plain object     | yes         | Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n. Empty string or no options object (thus no callbacks) is fine, program will exit early.

{% include "btt.njk" %}

### Options Object

Main thing, you must pass the callbacks in the options object, `cb` and `errCb`:

| An Options Object's key  | Type of its value      | Default      | Description                                                                                                                  |
| ------------------------ | ---------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `from`                   | Integer or falsy      | `0`          | Where in the string does the comma-separated chunk start                                                                     |
| `to`                     | Integer or falsy      | `str.length` | Where in the string does the comma-separated chunk end                                                                       |
| `offset`                 | Integer or falsy      | `0`          | Handy when you've been given cropped string and want to report real indexes. Offset adds that number to each reported index. |
| `leadingWhitespaceOK`    | Boolean                | `false`      | Is whitespace at the beginning of the range OK?                                                                              |
| `trailingWhitespaceOK`   | Boolean                | `false`      | Is whitespace at the end of the range OK?                                                                                    |
| `oneSpaceAfterCommaOK`   | Boolean                | `false`      | Can values have space after comma?                                                                                           |
| `innerWhitespaceAllowed` | Boolean                | `false`      | After we split into chunks, can those chunks have whitespace?                                                                |
| `separator`              | String, non-whitespace | `,`          | What is the separator character?                                                                                             |
| `cb`                     | Function               | `null`       | Function to ping the extracted value ranges to                                                                               |
| `errCb`                  | Function               | `null`       | Function to ping the errors to                                                                                               |

Here is the default options object in one place:

```js
{
  from: 0,
  to: str.length,
  offset: 0,
  leadingWhitespaceOK: false,
  trailingWhitespaceOK: false,
  oneSpaceAfterCommaOK: false,
  innerWhitespaceAllowed: false,
  separator: ",",
  cb: null,
  errCb: null
}
```

{% include "btt.njk" %}

### API - Function's Output

The function does not return anything (it returns `undefined` to be precise) — you extract the values via callbacks.

### API - opts.cb - INPUT

`opts` is a plain object. Its key's `cb` value must be a function.

Like in the example above — processCommaSeparated is a function, the second argument is the options object. Below, we set an arrow function to be `cb` value (you could pass a "normal", declared function as well).

```js
const gatheredChunks = [];
...
processCommaSeparated(
  `<FRAMESET...`,
  {
    ...
    cb: (idxFrom, idxTo) => {
      gatheredChunks.push([idxFrom, idxTo]);
    },
    ...
  }
);
```

The program will pass two arguments to the callback function you pass:

| Passed argument at position | We call it | Type    | Description                          |
| --------------------------- | ---------- | ------- | ------------------------------------ |
| 1                           | `idxFrom`  | Integer | Where does the extracted value start |
| 2                           | `idxTo`    | Integer | Where does the extracted value end   |

For example, if you passed the whole string `abc,def` (we assume it's whole HTML attribute's value, already extracted) and didn't give `opts.from` and `opts.to` and thus, program traversed the whole string, it would ping your callback function with two ranges: `[0, 3]` and `[4, 7]`. Full code:

```js
const processCommaSeparated = require("string-process-comma-separated");
const gatheredChunks = [];
processCommaSeparated("abc,def", {
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
});
console.log(JSON.stringify(gatheredChunks, null, 4));
// => [
//      [0, 3],
//      [4, 7]
//    ],
```

We omitted the error callback for brevity (`opts.errCb`, see its API below), here would be no errors anyway.

{% include "btt.njk" %}

### API - opts.cb - OUTPUT

Strictly speaking, function you pass as `opts.cb` value does not return anything, it's like `Array.forEach(key => {})` — you don't expect that arrow function to return something, as in:

```js
["abc", "def"].forEach((key) => {
  return "whatever"; // <-- that returned value will be lost
});
```

Above, `return` does not matter; you grab `key` value and do things with it instead.

Same way with our program's callbacks.

{% include "btt.njk" %}

### API - opts.errCb - INPUT

Similar to `opts.cb`, here two arguments are passed into the callback function, only this time first one is ranges, second-one is message string.

```js
const processCommaSeparated = require("string-process-comma-separated");
const gatheredChunks = [];
const gatheredErrors = [];
processCommaSeparated(`<FRAMESET rows="50%, 50%">`, {
  from: 16,
  to: 24,
  cb: (idxFrom, idxTo) => {
    gatheredChunks.push([idxFrom, idxTo]);
  },
  errCb: (ranges, message) => {
    gatheredErrors.push({ ranges, message });
  },
});
console.log(JSON.stringify(gatheredChunks, null, 4));
// => [
//      [16, 19],
//      [21, 24]
//    ]
console.log(JSON.stringify(gatheredErrors, null, 4));
// => [
//      {
//        ranges: [[20, 21]],
//        message: "Remove the whitespace."
//      }
//    ]
```

| Passed argument at position | We call it | Type                         | Description                             |
| --------------------------- | ---------- | ---------------------------- | --------------------------------------- |
| 1                           | `ranges`   | Array of zero or more arrays | Ranges which indicate the "fix" recipe. |
| 2                           | `message`  | String                       | Message about the error.                |

A quick primer on `ranges` — each range is an array of two or three elements. First two match `String.slice` indexes. If an optional third is present, it means what to add instead. Two element range array — only deletion. Three element range array — replacement.

We have made [more](/os/#range-libraries) _range_ processing libraries.

{% include "btt.njk" %}

### API - opts.errCb - OUTPUT

Same thing like in `opts.cb` — whatever your callback function returns does not matter. You take the values that are passed into function's arguments and do things with them. You don't return anything from the callback function.

```js
["abc", "def"].forEach((key) => {
  return "whatever"; // <-- that returned value will be lost
});
```

This returned string `"whatever"` will be discarded. It's not `Array.map`. Same with this program.

{% include "btt.njk" %}

## `opts.innerWhitespaceAllowed`

Sometimes comma-separated values are keywords — then we don't want to allow any whitespace between characters:

```
<input accept=".jpg,.g if,.png">
                      ^
```

But sometimes it's fine, like in media queries:

```
<link rel="stylesheet" media="screen and (max-width: 100px)" href="zzz.css" />
                                                    ^
```

Setting `opts.innerWhitespaceAllowed` by default doesn't allow inner whitespace within split chunk but you can turn it off.

{% include "btt.njk" %}
