---
layout: package
title: string-match-left-right
packages:
  - string-left-right
  - detergent
---

## The Purpose

It is used for checking, does a certain substring exist on the left or on the right of a given index. Where [`string-left-right`](/os/string-left-right) reports the index of a first non-whitespace character on either side of a given index, this library checks, is a certain string located on the either side of a given index.

## The API

### Input

There are four methods; all have the same API's:

- **`matchLeftIncl`** — at least one of given substrings has to match what's on the **left** and including character at the given index
- **`matchRightIncl`** — at least one of given substrings has to match what's on the **right** and including character at the given index
- **`matchLeft`** — at least one of given substrings has to match what's on the **left** of the given index
- **`matchRight`** — at least one of given substrings has to match what's on the **right** of the given index

| Input argument | Type                       | Obligatory? | Description                                                                                                                                                                                                                                                 |
| -------------- | -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `str`          | String                     | yes         | Source string to work on                                                                                                                                                                                                                                    |
| `position`     | Natural number incl. zero  | yes         | Index number of where we start looking. Character at this index may be used (`matchLeftIncl` and `matchRightIncl`) or not (other two methods)                                                                                                               |
| `whatToMatch`  | String or array of strings | yes         | What should we look for on the particular side, left or right, of the aforementioned `position`. If anything was found, it will be returned. It's especially handy when here we pass an array of string - this way you know _which_ of strings was matched. |
| `opts`         | Plain object               | no          | The Optional Options Object. See below.                                                                                                                                                                                                                     |

{% include "btt.njk" %}

### Output

Returns Boolean `false` or value of the string that was matched, that is,

- if `whatToMatch` was a string, then returns it, OR
- if `whatToMatch` was an array, then returns the first match from this array's elements.

{% include "btt.njk" %}

### Optional Options Object's API:

| `options` object's key    | Type    | Default | Description |
| ------------------------- | ------- | ------- | ----------- |
| `i`                       | Boolean | `false` | If `false`, it's case sensitive. If `true`, it's insensitive. |
| `cb`                      | Function                                                                 | `undefined` | If you feed a function to this key, that function will be called with the remainder of the string. Which side, it depends on which side method (left side for `matchLeft` and `matchLeftIncl` and others for right accordingly) is being called. The result of this callback will be joined using "AND" logical operator to calculate the final result. We use `cb` mainly to check for whitespace. |
| `trimBeforeMatching`      | Boolean                                                                  | `false`     | If set to `true`, there can be whitespace before what's being checked starts. Basically, this means, substring can begin (when using right side methods) or end (when using left side methods) with a whitespace.                                                                                                                                                                                  |
| `trimCharsBeforeMatching` | String or Array of zero or more strings, each 1 character-long           | `[]`        | If set to `true`, similarly like `trimBeforeMatching` will remove whitespace, this will remove any characters you provide in an array. For example, useful when checking for tag names to the right of `<`, with or without closing slash, `<div` or `</div`.                                                                                                                                      |
| `maxMismatches` | Natural number or zero           | `0`        | It's like Levenshtein distance - how many characters can mismatch to yield false result? |
| `firstMustMatch` | Boolean           | `false`        | When `opts.maxMismatches` is enabled, you can enforce that the first character must match. |
| `lastMustMatch` | Boolean           | `false`        | When `opts.maxMismatches` is enabled, you can enforce that the last character must match. |
| `hungry`        | Boolean           | `false`        | If all characters we looked for were matched, yet there were extra mismatching characters matched, because of `maxMismatches` allowance, default will fail. Turn this toggle on to pass in such cases. Default setting prevents a whole class of false positives. |


Here it is with defaults, in one place, ready for copying:

```js
{
  cb: undefined,
  i: false,
  trimBeforeMatching: false,
  trimCharsBeforeMatching: [],
  maxMismatches: 0,
  firstMustMatch: false,
  lastMustMatch: false,
}
```

{% include "btt.njk" %}

## Using a callback - `opts.cb`

Often you need not only to match what's on the left/right of the given index within string, but also to perform checks on what's outside.

For example, if you are traversing the string and want to match the `class` attribute, you traverse backwards, "catch" equals character `=`, then check, what's on the left of it using method `matchLeft`. That's not enough, because you also need to check, is the next character outside it is a space, or in algorithm terms, "trims to length zero", that is `(trim(char).length === 0)`. How do you apply this check?

Using `opts.cb` callbacks ("cb" stands for CallBack):

```js
const {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} = require("string-match-left-right");
// imagine you looped the string and wanted to catch where does attribute "class" start
// and end (not to mention to ensure that it's a real attribute, not something ending with this
// string "class").
// You catch "=", an index number 8.
// This library can check, is "class" to the left of it and feed what's to the left of it
// to your supplied callback function, which happens to be a checker "is it a space":
function isSpace(char) {
  return typeof char === "string" && char.trim() === "";
}
let res = matchLeft('<a class="something">', 8, "class", { cb: isSpace });
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// => res = 'class'
```

The callback function will receive three arguments:

- first argument - the character on the left/right side (depending which side method this is)
- second argment - whole substring that begins or ends with first argument. This might come handy if you want to perform check on more than one character outside of the matched characters.
- third argment - the index of the first character that follows what was matched. You use it to perform actions of the content outside.

For example:

```js
const { matchLeftIncl, matchRightIncl, matchLeft, matchRight } = require('string-match-left-right')

function startsWithZ(firstCharacter, wholeSubstring, index) {
  // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
  // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
  // console.log(`index = ${JSON.stringify(index, null, 4)}`)
  return wholeSubstring.startsWith('z')
}

// "zzz" and "yyy" are dummies to show there can be multiple values to match against

const test01 = matchLeft('<div><b>aaa</b></div>', 5, ['zzz', 'yyy', '<div>'])
console.log(`test01 = ${JSON.stringify(test01, null, 4)}`)
// => '<div>', // the 5th index is left bracket of <b>. Yes, <div> is on the left.

const test02 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div>'])
console.log(`test02 = ${JSON.stringify(test02, null, 4)}`)
// => false, // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test03 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div'], { trimCharsBeforeMatching: ['>', ' '] })
console.log(`test03 = ${JSON.stringify(test03, null, 4)}`)
// => '<div', // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test04 = matchLeft('z<div ><b>aaa</b></div>', 7, ['zzz', 'yyy', '<div'], { cb: startsWithZ, trimCharsBeforeMatching: ['>', ' '] })
console.log(`test04 = ${JSON.stringify(test04, null, 4)}`)
// => '<div', // the 7th index is left bracket of <b>. Yes, <div> is on the left.

const test05 = matchLeft('<div ><b>aaa</b></div>', 6, ['zzz', 'yyy', '<div'], { cb: startsWithZ, trimCharsBeforeMatching: ['>', ' '] }),
console.log(`test05 = ${JSON.stringify(test05, null, 4)}`)
// => false, // deliberately making the second arg of cb to be blank and fail startsWithZ
```

Notice how the first matched element is being returned (or Boolean `false`).

**VERY IMPORTANT**

Callback's returned value will be used to calculate the final result.

Final result = Boolean value of **matching** AND Boolean value of **callback**

This means, if you set a callback and forget to return a truthy value from it, even if there was a match, return would be `false`, because both match comparison AND the callback have to be _truthy_ to yield _truthy_ output.

Imagine, what if you forgot to return something in `Array.map()` — same thing here.

You can also use the callback inline:

```js
const res = matchRightIncl("ab      cdef", 2, "cd", {
  trimBeforeMatching: true,
  cb: (char, theRemainderOfTheString, index) => {
    console.log("char = " + char);
    // => char = e

    console.log("theRemainderOfTheString = " + theRemainderOfTheString);
    // => theRemainderOfTheString = ef

    console.log("index = " + index);
    // => index = 10

    // return "true" if you don't want to affect the result, or do it conditionally,
    // adding extra rules depending on these new variables you've got above.
    return true;
  },
});
console.log(`res = ${JSON.stringify(res, null, 4)}`);
```

{% include "btt.njk" %}

## Matching relying only on a callback

Sometimes, you want to match beyond "character is equal to" level. For example, you might want to run the regex against what's on the side and let that equation to judge the result. Sine `v3.1.0` you can do it. Pass the empty string as third argument, `whatToMatch` and a callback. If you don't pass the callback error will be thrown.

Normally, callback receives the first matched element you gave in `whatToMatch`, but here we don't have anything!

Instead, callback receives (in the order of arguments):

1.  callback's 1st argument - only next character on the left/right side if it's `matchLeft`/`matchRight`, or the character at `position` (second argument) if it's `matchLeftIncl`/`matchRightIncl`
2.  callback's 2nd argument - slice on the particular side, including (`matchLeftIncl`/`matchRightIncl` methods) or not including (`matchLeft`/`matchRight`) character at `position`
3.  callback's 3rd argument - index of the character right outside of the character at `position` (`matchLeft`/`matchRight`) or index of character at `position` (`matchLeftIncl`/`matchRightIncl` methods)

```js
const res1 = matchRight(
  "abc",
  1, // <--- it's the letter "b" at index 1
  "", // <-- notice it's empty, meaning we rely on just callback, "cb" now
  {
    cb: (characterOutside, wholeStringOnThatSide, indexOfCharacterOutside) => {
      return characterOutside === "a";
    },
  }
);
console.log(res1);
// => false
// because matchRight matches everything what's on the right, in this case it's "c".

const res2 = matchRight(
  "abcdef",
  2, // <--- it's letter "c" at index 2
  "", // <-- notice 3rd argument is empty string. This means we rely on cb only.
  {
    cb: (char) => char === "d",
  }
);
console.log(res2);
// => true

const res3 = matchRight(
  "abcdef",
  2, // <--- it's letter "c" at index 2
  "", // <-- notice 3rd argument is empty string. This means we rely on cb only.
  {
    cb: (char, rest) => rest === "def",
  }
);
console.log(res3);
// => true

const res4 = matchRight(
  "abcdef",
  2, // <--- it's letter "c" at index 2
  "", // <-- notice 3rd argument is empty string. This means we rely on cb only.
  {
    cb: (char, rest, index) => index === 3,
  }
);
console.log(res4);
// => true
```

{% include "btt.njk" %}

## `opts.trimBeforeMatching`

For example, [string-strip-html](/os/string-strip-html/) is using this library to check, is there a known HTML tag name to the right of the opening bracket character (`<`). Like `<div` or `<img`. Now, we want to allow dirty code cases when there's whitespace after the bracket, like `< div`, just in case somebody would sneak in `< script` and some browser would "patch it up". In `string-strip-html`, we want to be able to detect and strip even `<\n\n\nscript>`. That's easy, we set `opts.trimBeforeMatching` to `true`. When matching is performed, substring on the right of `<`, the `\n\n\nscript`, is trimmed into `script`, then matched.

By the way it's not on by default because such scenarios are rare. Default comparison should be a strict-one.

{% include "btt.njk" %}

## `opts.trimCharsBeforeMatching`

For example, [string-strip-html](/os/string-strip-html/) will look for opening and closing tags. First it will locate opening bracket `<`. Then it will check, is there a known tag name to the right, but trimming any `/`'s, to account for closing slashes.

{% include "btt.njk" %}

## Matching the beginning of ending of the string

Since `3.5.0`, you can match the beginning or ending of a string (further called "EOL"), for example, is there nothing on the left or right of a given index.

The algorithm is currently limited in that you can't match if "something that ends with EOL is on the left or on the right" of a given index. Currently we can only match "if EOL is on the left or on the right" of a given index.

To avoid "EOL" being interpreted as "real" three letters, we pass an arrow function which returns the same string. In JavaScript, functions are first-class citizens and can be used as raw values.

Algorithm will still be able to retrieve "EOL" from `() => "EOL"`, yet the argument will be function, not string, which will allow to match the beginning or ending correctly:

Consider this example:

```js
const res = matchRight("az", 0, ["x", () => "EOL"], {
  trimCharsBeforeMatching: ["z"],
});
console.log(res);
// => "EOL"
```

We match, is "EOL" or "x" to the right of the character at index `0` (letter "a"). While traversing towards right, we instruct to skip any characters "z". Result is string "EOL".

{% include "btt.njk" %}

## Unicode is somewhat supported

Algorithm covers the emoji that comprise of two characters but not longer emoji.

## Algorithm

The code in this library contains only `for` loops, iterating on the input string. There's no splitting-by-grapheme into array and later performing all the operations on that array. We think this approach is the most performant. In the end, which library would you choose: more performant-one or less performant but with with less lines of code?

{% include "btt.njk" %}
