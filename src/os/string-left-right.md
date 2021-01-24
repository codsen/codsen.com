---
layout: package
title: string-left-right
packages:
  - string-match-left-right
  - detergent
---

## Whole idea

It's trivial to check, is something on the left or on the right of a given index in a string. That's `str[i - 1]`/`str[i + 1]`. Done.

It's not that trivial to check, what is the index of the first non-whitespace character on either side. You need to use loops or trim functions and calculate the position, also consider the `null` cases where there are no such characters.

That's what this program is about — it is a string value lookup helper.

{% include "btt.njk" %}

## API - left() and right()

Both exported functions have the same API:

:::api
left(str, [idx])
:::

:::api
right(str, [idx])
:::

On both, the first input argument is a string, the optional second (marked by brackets above) is a starting index. We "look" to the left or to the right of that index, then report a first non-whitespace character's index on that side. In absence, we return `null`.

The determinator for whitespace is truthy `string.trim().length` - the trimmed string must have length; otherwise, it's a whitespace.

These functions allow you to locate the first non-whitespace character on left or right.

For example,

```js
const { left } = require("string-left-right");
// we start at index 2, which is character "b".
const res = left("a b", 2);
// the first non-whitespace character to the left of "b" is "a", at index 0:
console.log(res);
// => 0
```

The output is either **natural number index**, pointing to the nearest non-whitespace character on either side or `null` (if the string ends further, for example).

{% include "btt.njk" %}

## API - chompLeft() and chompRight()

These two allow you to jump over certain repeated characters, possibly spaced out with whitespace.

For example, imagine you have this string:

```
text x  y xyyyyxxxx       x x x x x yyyy y y y .
```

Imagine, you are "located" at the index of dot ".", `47`. In this case, `chompLeft()` lets you "jump" over x's and y's and locate the index of a second "t" in "text", `3`.

Both exported functions have the same API:

:::api
chompLeft(
  str, 
  idx, 
  [opts], 
  char1, 
  char2, 
  char3
)
:::

:::api
chompRight(
  str, 
  idx, 
  [opts], 
  char1, 
  char2, 
  char3
)
:::

You can pass a plain object - options - as the third argument, or you can omit it.

For example:

```js
const { chompLeft } = require("string-left-right");
// we're saying, jump over all b's and c's when traversing left from "x",
// then report the index of a first non-whitespace string you landed upon (
// or leave space, depending on the chosen mode, see next chapter for its API)
const res1 = chompLeft("a  b c b c  x y", 12, "b", "c");
console.log(`res1`);
// => 2

// the default mode is 0 and it's omitted, so above example is the same as:
const res2 = chompLeft("a  b c b c  x y", 12, { mode: 0 }, "b", "c");
console.log(`res2`);
// => 2
```

{% include "btt.njk" %}

## API - chompLeft() and chompRight() modes

You can pass an options object as a third argument before characters to match.

Modes:

- `0` - leave single space if possible
- `1` - stop at first space, leave whitespace alone
- `2` - aggressively chomp all whitespace except newlines ([CR](https://en.wikipedia.org/wiki/Carriage_return), [LF](https://en.wikipedia.org/wiki/Newline))
- `3` - aggressively chomp all whitespace including newlines ([CR](https://en.wikipedia.org/wiki/Carriage_return), [LF](https://en.wikipedia.org/wiki/Newline))

For example:

```js
const { chompLeft } = require("string-left-right");
const res1 = chompLeft("a\n  b c b c  x y", 13, "b", "c");
console.log(res1);
// => 2
// the default chomp stopped when it reached line break character. It didn't leave a space because it's not a non-whitespace character. If it were not a line break but a letter, it would have stopped one space short of it.

// passing default { mode: 0 } is the same result:
const res2 = chompLeft("a\n  b c b c  x y", { mode: 0 }, 13, "b", "c");
console.log(res2);
// => 2

// mode 1 - stops at first space met, in this case at first "b"
const res3 = chompLeft("a\n  b c b c  x y", 12, { mode: 1 }, "b", "c");
console.log(res3);
// => 4
// PS. "\n" counts as length of one

// mode 2 - chomps all whitespace except newlines
// in this case it stops to the right of \n, index 2:
const res4 = chompLeft("a\n  b c b c  x y", 12, { mode: 2 }, "b", "c");
// => 2

// mode 3 - hungriest of all whitespace chomps - chomps until it meets
// edge of a string or non-whitespace character (one which String.trim()'s
// to non-zero length character):
const res5 = chompLeft("a\n  b c b c  x y", 12, { mode: 3 }, "b", "c");
// => 1
```

The `chompRight()` works the same way, just towards the right side of a given index.

{% include "btt.njk" %}

## API - leftSeq() and rightSeq()

`leftSeq()` and `rightSeq()` matches the characters in that order, on the particular
side of given index, disregarding the whitespace.

Both exported functions have the same API:

:::api
leftSeq(
  str, 
  idx, 
  [opts], 
  str1ToMatch, 
  str2ToMatch, 
  str3ToMatch
)
:::

:::api
rightSeq(
  str, 
  idx, 
  [opts], 
  str1ToMatch, 
  str2ToMatch, 
  str3ToMatch
)
:::

Above, square brackets mean options are optional, you can omit them.

| Input argument | Type                     | Obligatory? | Description                                        |
| -------------- | ------------------------ | ----------- | -------------------------------------------------- |
| `str`          | String                   | yes         | String to work upon                                |
| `idx`          | Natural number or zero   | yes         | At which index we start looking on either side     |
| `opts`         | Plain object             | no          | The Optional Options Object, see below for its API |
| `str1ToMatch`  | String, single character | no          | The first character to match on the sequence       |
| `str2ToMatch`  | String, single character | no          | The second character to match on the sequence      |
| `str3ToMatch`  | String, single character | no          | The third character to match on the sequence       |
| ...            | String, single character | no          | The n-th character to match on the sequence        |

You can put as many characters as you want.

Example:

```js
const { leftSeq } = require("string-left-right");
// we start at index 5, that's "f" and look on the left, are there sequence
// of characters "c", "d" and "e", possibly separated by whitespace
const result = leftSeq("abcdefghijk", 5, "c", "d", "e");
// yes, and there are no gaps:
console.log(JSON.stringify(result, null, 4));
// => {
//      gaps: [],
//      leftmostChar: 2,
//      rightmostChar: 4
//    }
```

Now example with gaps:

We're also on "f" and we're also looking left, are the sequence "c", "d", "e" on that side.

```js
t.same(
  leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "e"),
  {
    gaps: [
      [7, 9],
      [10, 12],
      [13, 15],
    ],
    leftmostChar: 6,
    rightmostChar: 12,
  },
  "04.01.02"
);
```

Program reports any whitespace gap ranges it encountered and also indexes of leftmost and rightmost character.

{% include "btt.njk" %}

## API - leftStopAtNewLines() and rightStopAtNewLines()

Both exported functions have the same API.

:::api
leftStopAtNewLines(str, [idx])
:::

:::api
rightStopAtNewLines(str, [idx])
:::

On both, the first input argument is a string, the optional second (marked by brackets above) is a starting index.

Both functions are the same as `left()`/`right()`, except that besides non-whitespace characters, they also stop at CR and LF, line break characters.

For example,

```js
const { right, rightStopAtNewLines } = require("string-left-right");
const str = "a \n\n\nb";
// right() does not stop at whitespace characters and linebreaks are
// whitespace characters:
const res1 = right(str, 0);
// rightStopAtNewLines() will also stop at line break characters:
const res2 = rightStopAtNewLines(str, 0);
console.log(`res1 = ${res1}; res2 = ${res2}`);
// res1 = 5; res2 = 2
```

PS. While you type Mac line ending LF as two characters, backwards slash and "n" - `\n` - it counts as one character.

{% include "btt.njk" %}

## More complex lookups

If you need more complex string lookups, check out [`string-match-left-right`](/os/string-match-left-right/). It can trim whitespace or certain characters before matching.

{% include "btt.njk" %}
