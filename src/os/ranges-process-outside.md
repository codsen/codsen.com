---
layout: package
title: ranges-process-outside
---

## Quick Take

{% include "src/components/content/tldr-ranges-process-outside.md" %}

{% include "btt.njk" %}

## API

**{{ packageJsons["ranges-process-outside"].lect.req }}(originalStr, originalRanges, cb, \[skipChecks])**

In other words, it's a function which takes 4 arguments:

| Input argument | Type         | Obligatory? | Description                                                                  |
| -------------- | ------------ | ----------- | ---------------------------------------------------------------------------- |
| `originalStr`  | string        | yes         | Source string |
| `originalRanges`  | `null` or _ranges_ - array of arrays        | yes         | String indexes outside these ranges will be processed (fed to callback function) |
| `cb`         | function | yes          | Callback function you provide (like in `Array.forEach`) |
| `skipChecks`         | boolean | no          | By default checks are performed upon inputs but you can turn that off to boost the performance |

## Callback `cb`

This program operates in a callback fashion, just like `Array.prototype.forEach()`, for example:

```js
const {{ packageJsons["ranges-process-outside"].lect.req }} = require("ranges-process-outside");
const gather = [];
{{ packageJsons["ranges-process-outside"].lect.req }}(
  "abcdefghij",
  [[0, 5]],
  (idx) => {
    gather.push(idx);
  }
);
console.log(gather);
// => [5, 6, 7, 8, 9]
```

This `(idx) => { gather.push(idx); }` above is the callback function (as [arrow](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)-function).

It's API is the following:

| Input argument | Type         | Description |
| -------------- | ------------ | ----------- |
| `fromIdx`      | String index: natural number or zero | Starting index of the chunk programs pings you |
| `toIdx`        | String index: natural number or zero | Ending index of the chunk programs pings you |
| `offsetValueCb`        | Function or something _falsey_ | Callback function to bump the indexes in the loop that pings you all this. See [below](#offsetvaluecb-api) for more. |

## `offsetValueCb` API

A callback inside a callback!

`offsetValueCb` argument the `cb()` gives you is _a function_. Call it with a single argument, a natural number — that will instruct the outer loop function to skip that many characters.

For example, skip one character:

```js
const {{ packageJsons["ranges-process-outside"].lect.req }} = require("ranges-process-outside");
const gather = [];
processOutside(
  "abcdefghij",
  [[0, 5]],
  (fromIdx, toIdx, offsetValueCb) => {
    gather.push(fromIdx);
    if (fromIdx === 6) {
      // at index 6, skip the next index:
      offsetValueCb(1);
    }
  }
);
console.log(gather);
// => [5, 6, 8, 9]
// notice 7 is missing because we skipped by 1 while being at index 6
```

The third argument in the callback `cb` (the arrow function `(fromIdx, toIdx, offsetValueCb) => {...}` above) is a function which lets you bump the looping index. This way, you can skip the characters being pinged.

For example, [Detergent](/os/detergent/) processes HTML code. A string with bunch of invisible characters are detected and their from-to ranges are pushed to _ranges_ being gathered. While processing the input further, [Detergent](/os/detergent/) avoids processing the characters booked for deletion (marked by _ranges_). It uses this program to work on everything in-between the ranges (invisible character locations). Now, Detergent detects a named HTML entity: `&nbsp;`. Once it stumbles on its first character, the ampersand `&`, it does what it has to do and it needs to skip 6 characters further.

This skipping is performed by this callback. You can see it in action [here](https://gitlab.com/codsen/codsen/-/blob/master/packages/detergent/src/main.js#L884).

`offsetBy` is a function which is passed to `processCharacter()` module, an imported function from a file nearby, [processCharacter.js](https://gitlab.com/codsen/codsen/-/blob/master/packages/detergent/src/processCharacter.js). Now, `processCharacter()` can initiate the [skipping](https://gitlab.com/codsen/codsen/-/blob/master/packages/detergent/src/processCharacter.js#L497) of any characters taking more than single character's length, like CRLF line breaks or encoded entities.
