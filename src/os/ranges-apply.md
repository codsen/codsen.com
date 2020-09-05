---
layout: package
title: ranges-apply
---

## Quick Take

{% include "src/components/content/tldr-ranges-apply.md" %}

{% include "btt.njk" %}

## API

**stringReplaceSlicesArray(inputString, rangesArray\[, progressFn])**

In other words, this library gives you a _function_ and you must feed a string (`inputString`, above) into its first argument and a ranges array (`rangesArray`, above.). Also, if you wish, you can feed a third argument, a _progressFn_ (bracket in `[, progressFn]` means "optional").

Function returns a string with requested slices deleted/replaced.

{% include "btt.njk" %}

#### inputString - 1st argument

**Type**: `string` - the string we want to work on.

#### rangesArray - 2nd argument

**Type**:

- `array` - the array of zero or more arrays containing a range and an optional replacement string.
- `null` - alternatively, it can be given as `null`. That's the alternative output of range classes in [ranges-push](/os/ranges-push/).

For example,

```js
[
  [10, 15], // <-- deletion
  [18, 20, "replace with this"], // <-- replacement
];
```

**PSST.** Check out [ranges-push](/os/ranges-push/) which helps to manage the `rangesArray`. It has methods to add and retrieve the slices. Also, it helps in cases where slices overlap and helps to maintain the order of index ranges (it always goes from smallest to largest index, everywhere).

{% include "btt.njk" %}

#### progressFn - 3rd argument

This optional third input argument is used in worker setups where user wants to report the progress of the job. If a function is passed as third input argument, it will be called with first argument, natural number, which means percentage done so far (from `0` to `100`).

{% include "btt.njk" %}

## The algorithm

The plan is simple - we `array.reduce` your given ranges array, slicing the input string accordingly.

The main thing is unit tests and edge case scenarios. Also, fancy optional features (upcoming) like using character enumeration counting emoji as one character.

{% include "btt.njk" %}

## In our case

Originally this library was part of [email-comb](/os/email-comb/), where we traversed HTML as a string and compiled an array of things to delete or replace later, in one go. The performance was important, so it was not a good idea to delete/replace things on the spot because each deletion slowed down the process. Instead, we traversed the string, compiled this _to-do_ array, then did the deletion/replacement on the whole thing, **once**. This appears to be the fastest way.

We're going to use this library in all our HTML processing libraries who work on HTML as on string, without parsing it.

{% include "btt.njk" %}
