---
layout: package
title: string-find-heads-tails
packages:
  - json-variables
  - detergent
---

## Purpose

{% raw %}

There are many templating languages out there, each using different special "markers" — Nunjucks use `{{` and `}}`, Salesforce use `{!` and `}`, Mailchimp use `*|` and `|*` — there are many templating languages.

We call those "markers" _heads_ and _tails_ (invented term) because we need to distinguish between the two.

This program finds out, **where are the templating marker heads and tails located in a given string**.

It will be used in JSON [pre-processing](/os/json-variables/) and it will let you use any existing or invented templating language.

{% endraw %}
{% include "btt.njk" %}

## Context

{% raw %}

It's a (scanerless) parser for arbitrary templating language markers.

There are few rules:

- Each finding must be in sequence: _heads_ - _tails_ - _heads_ - _tails_.
- When one _heads_ is found, no new heads findings will be accepted into the results until there's a new _tails_ finding. Same goes the opposite way, for _tails_.
- Both _heads_ and _tails_ can be supplied either as a single string or array of strings. Findings are prioritised by their order in the array.

{% endraw %}
{% include "btt.njk" %}

## API

::: api
{{ packageJsons["string-find-heads-tails"].lect.req }}(str, heads, tails, [fromIndex])
:::

In other words, it's a function which takes four input arguments, last-one optional (marked with square brackets).

::: tip
You can switch to _grapheme count_-based index system — use `nativeToUnicode()` method of [string-convert-indexes](/os/string-convert-indexes/). It can process the whole output of this library.
:::

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
