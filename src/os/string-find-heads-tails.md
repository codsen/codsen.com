---
layout: package
title: string-find-heads-tails
packages:
  - json-variables
  - detergent
---

## Quick Take

{% raw %}

Imagine a templating scenario: you have a string and you want to put a value somewhere. The "somewhere" will be marked by special markers — Nunjucks use `{{` and `}}`, Salesforce use `{!` and `}`, Mailchimp use `*|` and `|*` — there are many templating languages.

Specific names to distinguish the two, like "an opening marker" or "a closing marker" don't exist so we invented a term, _heads_ and _tails_.

This program finds out, **where are templating marker heads and tails located in a given string**.
{% endraw %}

```js
const {{ packageJsons["string-find-heads-tails"].lect.req }} = require('string-find-heads-tails')
const result = {{ packageJsons["string-find-heads-tails"].lect.req }}(
  "some text %%_var1-%% more text %%_var2_%%",
  ["%%_", "%%-"], // two flavours of heads
  ["-%%", "_%%"] // two flavours of tails
),
console.log(result);
// => [
//      {
//        headsStartAt: 10,
//        headsEndAt: 13,
//        tailsStartAt: 17,
//        tailsEndAt: 20,
//      },
//      {
//        headsStartAt: 31,
//        headsEndAt: 34,
//        tailsStartAt: 38,
//        tailsEndAt: 41,
//      }
//    ]
```

{% include "btt.njk" %}

## Purpose

It will be used in JSON [pre-processing](/os/json-variables/), replacing the dumb string search being used currently.

## Context

{% raw %}

Different programming languages, templating languages and even proprietary notations (such as used by Email Service Providers) use different `heads` and `tails` to mark variable names.

For example,

- Nunjucks templating language would use `{%` and `%}`, then `{{` and `}}` (among others).
- Java JSP's would use `${` and `}` (among others).
- Oracle Responsys, ESP, would use `$(` and `)`.
- ex-eDialog/ex-eBay Enterprise/Zeta Interactive ESP use `_` and `__`.

This library enables to build tools which process such code. All processing starts with searching for variables in a string and `string-find-heads-tails` will help you here.

It's a (scanerless) parser for arbitrary templating language markers.

There are few rules:

- Each finding must be in sequence: _heads_ - _tails_ - _heads_ - _tails_.
- When one _heads_ is found, no new heads findings will be accepted into the results until there's a new _tails_ finding. Same goes the opposite way, for _tails_.
- Both _heads_ and _tails_ can be supplied either as a single string or array of strings. Findings are prioritised by their order in the array.

{% endraw %}
{% include "btt.njk" %}

## API

**{{ packageJsons["string-find-heads-tails"].lect.req }}(str, heads, tails, \[fromIndex])**

**IMPORTANT**
The index is based on native JavaScript string indexing where each astral character's length will be counted as two. If you wish to convert the index system to be based on _Unicode character count_, use `nativeToUnicode()` method of [string-convert-indexes](/os/string-convert-indexes/). It can convert the whole nested array output of this library (not to mention number indexes).

{% include "btt.njk" %}

### API - Input

| Input argument | Type                       | Obligatory? | Description                                                                    |
| -------------- | -------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `str`          | String                     | yes         | The string in which you want to perform a search                               |
| `heads`        | String or Array of strings | yes         | One or more string, the first half of the set. For example, `['%%-', '%%_']`.  |
| `tails`        | String or Array of strings | yes         | One or more string, the second half of the set. For example, `['-%%', '_%%']`. |
| `opts`         | Plain object               | no          | An Optional Options Object. See its API below.                                 |

PS. Input arguments are not mutated.

{% include "btt.njk" %}

### Optional Options Object

| options object's key                            | Type of its value                          | Default                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fromIndex`                                     | Natural number or zero as number or string | `0`                       | If you want to start the search later, only from a certain index, set it here. Same as 2nd argument `position` in `String.includes`.                                                                                                                                                                                                                                                                                                                                                                                |
| `throwWhenSomethingWrongIsDetected`             | Boolean                                    | `true`                    | By default, if anything wrong is detected, error will be thrown. For example, tails precede heads. Or two conescutive heads or tails are detected. If you want to turn this functionality off, set to `false`. Turning this off automatically sets the `allowWholeValueToBeOnlyHeadsOrTails` (see below) to `true`, that is, error won't be thrown when whole input is equal to one of heads or tails. This setting does not concern wrong input types. To allow input in wrong types, set `relaxedAPI`, see below. |
| `allowWholeValueToBeOnlyHeadsOrTails`           | Boolean                                    | `true`                    | If whole input `str` is equal to one of `heads` or `tails` AND `opts.throwWhenSomethingWrongIsDetected` is `true`, THEN error won't be thrown and that input will not be processed. But if you set this to `false` AND error throwing is on (`opts.throwWhenSomethingWrongIsDetected` is `true`), error will be thrown. This feature is activated only when `opts.throwWhenSomethingWrongIsDetected` is `true`.                                                                                                     |
| `source`                                        | String                                     | `string-find-heads-tails` | Packages that consume this package as a dependency might rely on some of our error `throw`ing functionality. Since `throw`n message mentions the name of the `throw`ee, you can override it, setting to parent package's name.                                                                                                                                                                                                                                                                                      |
| `matchHeadsAndTailsStrictlyInPairsByTheirOrder` | Boolean                                    | `false`                   | If it's set to `true`, the index numbers of heads and tails in their input arrays must match. Different pairs can have different indexes, as long as they match between the pair. For example, `%%_test-%%` or `%%-test_%%`.                                                                                                                                                                                                                                                                                        |
| `relaxedAPI`                                    | Boolean                                    | `false`                   | If it's set to `true`, wrong inputs will instantly yield `[]`. If it's default setting, `false`, it would `throw` an error. This only concerns the checks **before** any real work is done on the input, where error-throwing is controlled by `throwWhenSomethingWrongIsDetected` (see above).                                                                                                                                                                                                                     |

Here is the Optional Options Object in one place with all default settings:

```js
{
  fromIndex: 0,
  throwWhenSomethingWrongIsDetected: true,
  allowWholeValueToBeOnlyHeadsOrTails: true,
  source: 'string-find-heads-tails',
  matchHeadsAndTailsStrictlyInPairsByTheirOrder: false,
  relaxedAPI: false
}
```

{% include "btt.njk" %}

### API - Output

Returns an array of zero or more plain objects, each having format:

```js
{
  headsStartAt: 1,
  headsEndAt: 2,
  tailsStartAt: 4,
  tailsEndAt: 5,
}
```

The whole idea is that you should be able to get the `heads` if you put `str.slice(headsStartAt, headsEndAt)`.

If you want to use grapheme-count-based indexing, first convert the output of this library using [string-convert-indexes](/os/string-convert-indexes/), then use Unicode-character-count-based string slice libraries, for example: [string-slice](https://www.npmjs.com/package/string-slice).

{% include "btt.njk" %}
