---
layout: package
title: string-collapse-leading-whitespace
packages:
  - detergent
---

## Quick Take

It's a custom trim for strings, aimed to clean up the leading/trailing whitespace, considering it might contain linebreaks.

```js
// does nothing to trimmed strings:
'aaa' => 'aaa'
// if leading/trailing whitespace doesn't contain \n, collapse to a single space
'  aaa   ' => ' aaa '
// otherwise, collapse to a single \n (default setting)
'     \n\n   aaa  \n\n\n    ' => '\naaa\n'
```

{% include "btt.njk" %}

## API - Input

| Input argument                 | Type                        | Obligatory? | Default   | Description                                                                            |
| ------------------------------ | --------------------------- | ----------- | --------- | -------------------------------------------------------------------------------------- |
| `str`                          | String                      | yes         | undefined | Source string to work on                                                               |
| `originalLimitLinebreaksCount` | Natural number (excl. zero) | no          | `1`       | Maximum line breaks that will be put when leading or trailing whitespace contains any. |

If first input argument is not a string, it will be just returned back, untouched.
If second input argument is zero or falsey or not a number, it will be set to `1` and application will continue as normal.

{% include "btt.njk" %}

## API - Output

String of zero or more characters. If input was not a string, same thing will be returned back, without an error.

## The logic explained in examples

Sequence of more than one space gets replaced with single space:

```js
const {{ packageJsons["string-collapse-leading-whitespace"].lect.req }} = require("string-collapse-leading-whitespace");
const res1 = {{ packageJsons["string-collapse-leading-whitespace"].lect.req }}("zzz  ");
console.log(res1);
// Those two trailing spaces got trimmed to one space
// => "zzz "
```

Tabs and other whitespace characters which are not non-breaking spaces or new lines (LF) are replaced with spaces. There can't be more than one space (or a custom count, set by second input argument, the `originalLimitLinebreaksCount`) at any outcome.

```js
const {{ packageJsons["string-collapse-leading-whitespace"].lect.req }} = require("string-collapse-leading-whitespace");
const res2 = {{ packageJsons["string-collapse-leading-whitespace"].lect.req }}("\t\t\t\t\t     zzz zzz\t      \t\t\t\t");
console.log(res2);
// => " zzz zzz "
```

{% include "btt.njk" %}
