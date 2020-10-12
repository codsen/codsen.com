---
layout: package
title: string-find-malformed
packages:
  - detergent
---

## The Purpose

We need a program to help to find malformed string instances.

For example, consider opening HTML comment tag, `<!--`.

There can be many things wrong with it:

- Missing characters from the set, for example, `<--` or `<!-`
- Rogue characters present between characters in the set, for example: `<!-.-` or `<z!--`
- Also rogue whitespace characters: `<! --` or `<!--`

Basically, something too similar to what we are looking for, but not exactly the same.

Technically, that's a lot to cover - and this program does all that.

{% include "btt.njk" %}

## Idea

[Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) is a number which signifies, how many character changes is needed to turn one string into another.

In technical terms, for example, we would look for a set of characters Levenshtein distance `1`, but disregarding the whitespace.

Difference between `dog`, `dot` is `1` ("g" needs to be changed into "t").

Another thing, not all characters are equal (sorry for a pun) - a whitespace should/could be disregarded. For example, five spaces is not the same as _any five characters_: `<! --` is definitely an instance of malformed `<!--` but `<!<a id--` is very weird - even though both might be Levenshtein distance 5.

**Takeaway** - program will aggressively chomp the whitespace but it will be sensitive to all other characters.

{% include "btt.njk" %}

## API

**strFindMalformed(str, refStr, cb, [opts])**

In other words, above we say first three arguments are obligatory and fourth is optional (marked with square brackets).

### API - Input

| Input argument | Type         | Obligatory? | Description                                                                           |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------------------------- |
| `str`          | String       | yes         | The string in which you want to perform a search                                      |
| `refStr`       | String       | yes         | What to look for                                                                      |
| `cb`           | Function     | yes         | You supply a callback function. It will be called on each finding. See its API below. |
| `opts`         | Plain object | no          | An Optional Options Object. See its API below.                                        |

PS. Input arguments are not mutated.

{% include "btt.njk" %}

### Optional Options Object

| options object's key | Type of its value      | Default | Description                                                                                   |
| -------------------- | ---------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `stringOffset`       | Natural number or zero | `0`     | Every index fed to the callback will be incremented by this much.                             |
| `maxDistance`        | Natural number or zero | `1`     | Controls, how many characters can differ before we disregard the particular chunk as a result, [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) |
| `ignoreWhitespace`        | Boolean                | `true`  | Whitepace (characters that trim to zero length) is skipped by default.                        |

Here is the Optional Options Object in one place with all default settings:

```js
{
  stringOffset: 0, // this number will be added to every index reported to the callback
  maxDistance: 1, // how many characters can differ before we disregard that chunk
  ignoreWhitespace: true // if character trims to zero length, we skip on default setting
}
```

{% include "btt.njk" %}

### API - 3rd argument - a callback

The third input argument is a callback function that you supply. When a result is found, this function is called and a plain object is passed to function's first argument.

For example:

```js
// we create an empty array to dump the results into
const gathered = [];
// we call the function
strFindMalformed(
  // first input argument: source
  "abcdef",
  // second input argument: what to look for but mangled
  "bde",
  // callback function:
  (obj) => {
    gathered.push(obj);
  },
  // empty options object:
  {}
);
console.log(gathered);
// => [
//      {
//        idxFrom: 1,
//        idxTo: 5
//      }
//    ]

// you can double-check with String.slice():
console.log(abcdef.slice(1, 5));
// => "bcde"
// it's mangled because rogue letter "c" is between the "good" letters.
```

The result above means, mangled `bde` is present in `abcdef` on indexes range from `1` to `5`. The indexes follow the same principles as in `String.slice()`.

{% include "btt.njk" %}

### API - Output

Returns an array of zero or more plain objects, each having format:

```js
{
  idxFrom: 1,
  idxTo: 5
}
```

## Further Ideas

Nobody would mistype "owned" as "ewned" — "fat finger" errors occur on vicinity keys, in this case, "o" can be mistyped with "i" or "p" because those keys are near. Key "e" is far, it's unrealistic.

In this light, _Levenshtein distance_ is not strictly suited for purpose. Alternative version of it should be written, where algorithm considers both distance AND neighbouring keys and evaluates accordingly.
