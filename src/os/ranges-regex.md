---
layout: package
title: ranges-regex
---

## Quick Take

{% include "src/components/content/tldr-ranges-regex.md" %}

{% include "btt.njk" %}

## API

**{{ packageJsons["ranges-regex"].lect.req }}(regexp, str, \[replacement])**

In other words, it's a function which takes three input arguments, third one is optional (marked with brackets).

| Input argument | Type               | Obligatory? | Description                                                                                       |
| -------------- | ------------------ | ----------- | ------------------------------------------------------------------------------------------------- |
| `regexp`       | Regular expression | yes         | Provide the regexp to apply onto a string                                                         |
| `str`          | String             | yes         | Provide a string upon which to match the regex                                                    |
| `replacement`  | String or `null`   | no          | If you want to add a third argument on every of the finding's third argument values, put it here. |

**Output**: array of zero or more arrays (so-called _ranges_) where each consists of two or more natural number (or zero) indexes OR `null`.

This package does not mutate its inputs.

If the input arguments' types are incorrect or absent, library will `throw` an error.

{% include "btt.njk" %}

## Examples

Nothing to find:

```js
// nothing to find:
console.log({{ packageJsons["ranges-regex"].lect.req }}(/yyy/g, "zzzzzzzz"));
// => null

// stick `null` to add onto every of the findings:
const res = {{ packageJsons["ranges-regex"].lect.req }}(/def/g, "abcdefghij_abcdefghij", null);
console.log(JSON.stringify(res, null, 4));
// => [[3, 6, null], [14, 17, null]]
```

Notice, you can use all the features of regexes: global, case insensitive flags and so on.

PS. Be careful not to signify the intention to omit the third argument by setting it to `null`. The `null` is a valid value in _ranges_ [ecosystem](https://gitlab.com/codsen/codsen#-11-range-libraries) and it is used in ranges to "kill off" any present insertion values. For example, you merge two ranges and one says "add this" (in a form of third argument) and second says, disregard all that content to add, here's `null` to defuse them for good.

{% include "btt.njk" %}
