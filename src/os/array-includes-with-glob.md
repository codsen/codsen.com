---
layout: package
title: array-includes-with-glob
---

## How it works

Lodash `_.includes` can tell, does an array contain given string among its elements:

```js
_.includes(["abcd", "aaa", "bbb"], "bc");
// => true

_.includes(["abcd", "aaa", "bbb"], "zzz");
// => false
```

This library is a supercharged version of the Lodash `_.includes`, letting you to put _wildcards_:

```js
includesWithGlob(["xc", "yc", "zc"], "*c");
// => true (all 3)

includesWithGlob(["xc", "yc", "zc"], "*a");
// => false (none found)

includesWithGlob(["something", "anything", "zzz"], "some*");
// => true (1 hit)
```

**Wildcard means zero or more Unicode characters.**

You can also do fancy things like a wildcard in the middle of a string, or multiple wildcards in a string:

```js
includesWithGlob(["something", "zzz", "soothing"], "so*ing");
// => true (2 hits)
```

This library will tolerate non-string values in the source array; it will skip those values.

This library is astral-character friendly, supports all Unicode characters (including emoji) and doesn't mutate the input.

You can also query multiple values and request that ANY (default behaviour) or ALL (optional setting) should be found in the source, to yield a result "`true`". See examples [below](#options-object-examples).

{% include "btt.njk" %}

## API

:::api
includesWithGlob(
  source,
  whatToFind,
  [options]
)
:::

In other words, it's a function which takes three input arguments, third-one optional.

{% include "btt.njk" %}

### API - Input

| Input argument | Type                         | Obligatory? | Description                                                                    |
| -------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `source`       | A string or array of strings | yes         | Source string or array of strings                                              |
| `whatToFind`   | A string or array of strings | yes         | What to look for. Can contain wildcards. Can be one string or array of strings |
| `options`      | Plain object                 | no          | Options object. See below for its API.                                         |

None of the input arguments is mutated.

| Options object's key         | Value          | Default | Description                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrayVsArrayAllMustBeFound` | `any` or `all` | `any`   | When a source (the first argument) is array, and what to look for (the second argument) is also array, you can have the match performed two ways: `any` setting will return true if _any_ of the second argument array's elements are found in the source array. `all` setting will return `true` only if _all_ elements within the second argument are found within the source array. |
| `caseSensitive` | boolean | `true`   | Passed directly to `matcher()` |

{% include "btt.njk" %}

#### Options object examples

```js
var arrayIncludesWithGlob = require("array-includes-with-glob");
var source = ["aaa", "bbb", "ccc"];
var whatToLookFor = ["a*", "d*"];

var res1 = arrayIncludesWithGlob(source, whatToLookFor);
console.log("res1 = " + res1);
// => res1 = true, because at one element, 'a*' was found in source (it was its first element)

var res2 = arrayIncludesWithGlob(source, whatToLookFor, {
  arrayVsArrayAllMustBeFound: "all",
});
console.log("res2 = " + res2);
// => res2 = false, because not all elements were found in source: 'd*' was not present in source!
```

{% include "btt.njk" %}

### Practical usage

It's very useful tackling options' objects — for example, [object-merge-advanced](/os/object-merge-advanced/) can skip certain keys upon request. That request, technically, is an array, it may or may not contain globs, and this program processes all that:

```js
mergeAdvanced(
  {
    // first object to merge
    something: "a",
    anything: "b",
    everything: "c",
  },
  {
    // second object to merge
    something: ["a"],
    anything: ["b"],
    everything: "d",
  },
  {
    ignoreKeys: ["*thing"],
  }
);
```

In the example above, we need to run a check through all keys of the first object and check, are any covered by the `ignoreKeys` array. If so, those keys would not get merged and keep their values.

{% include "btt.njk" %}

### API - Output

| Type    | Description                                                           |
| ------- | --------------------------------------------------------------------- |
| Boolean | Returns `true` if at least one `stringToFind` is found, else `false`. |

{% include "btt.njk" %}

## Conditions when this library will throw

This library will throw an error if:

- any of inputs are missing
- any of inputs are of the wrong type

Also, if first input argument, a source array, is an empty array or empty string, the result will always be `false`.

{% include "btt.njk" %}
