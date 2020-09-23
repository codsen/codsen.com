---
layout: package
title: string-collapse-white-space
packages:
  - detergent
---

## Whitespace Collapsing

Take string. First **trim** the outsides, then **collapse** two and more spaces into one.

```js
'    aaa    bbbb    ' -> 'aaa bbbb'
```

When trimming, any whitespace will be collapsed, including tabs, line breaks and so on.
When collapsing, _only spaces_ are collapsed. Non-space whitespace within text won't be collapsed.

```js
'   \t\t\t   aaa     \t     bbbb  \t\t\t\t  ' -> 'aaa \t bbbb'
```

(Optional, on by default) **Collapse** more aggressively within recognised **HTML tags**:

```js
'text <   span   >    contents   <  /  span   > more text' -> 'text <span> contents </span> more text'
```

(Optional, off by default) **Trim** each line:

```js
'   aaa   \n   bbb   ' -> 'aaa\nbbb'
```

(Optional, off by default) Delete empty or whitespace-only rows:

```js
'a\n\n\nb' -> 'a\nb'
```

{% include "btt.njk" %}

## API

**collapse (string, \[opts])**

Input:

- the first argument - string only or will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

{% include "btt.njk" %}

### Optional Options Object's API:

| `options` object's key         | Type                   | Obligatory? | Default | Description                                                                                                                                                                         |
| ------------------------------ | ---------------------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trimStart`                    | Boolean                | no          | `true`  | if `false`, leading whitespace will be just collapsed. That might a single space, for example, if there are bunch of leading spaces.                                                |
| `trimEnd`                      | Boolean                | no          | `true`  | if `false`, trailing whitespace will be just collapsed.                                                                                                                             |
| `trimLines`                    | Boolean                | no          | `false` | if `true`, every line will be trimmed (spaces, tabs, line breaks of all kinds will be deleted, also non-breaking spaces, if `trimnbsp` is set to `true`)                            |
| `trimnbsp`                     | Boolean                | no          | `false` | when trimming, do we delete non-breaking spaces (if set to `true`, answer would be "yes"). This setting also affects `trimLines` setting above.                                     |
| `recogniseHTML`                | Boolean                | no          | `true`  | if `true`, the space directly within recognised 118 HTML tag brackets will be collapsed tightly: `< div >` -> `<div>`. It will not touch any other brackets such as string `a > b`. |
| `removeEmptyLines`             | Boolean                | no          | `false` | if any line can be trimmed to empty string, it will be removed.                                                                                                                     |
| `returnRangesOnly`             | Boolean                | no          | `false` | if enabled, ranges array (array of arrays) or `null` (if there was nothing to collapse) will be returned instead                                                                    |
| `limitConsecutiveEmptyLinesTo` | Natural number or zero | no          | `0`     | Set to 1 or more to allow that many blank lines between content                                                                                                                     |

**Defaults**:

```js
{
  trimStart: true, // otherwise, leading whitespace will be collapsed to a single space
  trimEnd: true, // otherwise, trailing whitespace will be collapsed to a single space
  trimLines: false, // activates trim per-line basis
  trimnbsp: false, // non-breaking spaces are trimmed too
  recogniseHTML: true, // collapses whitespace around HTML brackets
  removeEmptyLines: false, // if line trim()'s to an empty string, it's removed
  returnRangesOnly: false, // if on, only ranges array is returned
  limitConsecutiveEmptyLinesTo: 0 // zero lines are allowed (if opts.removeEmptyLines is on)
}
```

{% include "btt.njk" %}

## Algorithm

Traverse the string once, gather a list of ranges indicating white space indexes, delete them all in one go and return the new string.

This library traverses the string _only once_ and performs the deletion _only once_. It recognises Windows, Unix and Linux line endings.

Optionally (on by default), it can recognise (X)HTML tags (any out of 118) and for example collapse `< div..` → `<div..`.

This algorithm **does not use regexes**.

{% include "btt.njk" %}

## Smart bits

There are some sneaky false-positive cases, for example:

`Equations: a < b and c > d, for example.`

Notice the part `< b and c >` almost matches the HTML tag description - it's wrapped with brackets, starts with legit HTML tag name (one out of 118, for example, `b`) and even space follows it. The current version of the algorithm will detect false-positives by counting amount of space, equal, double quote and line break characters within suspected tag (string part between the brackets).

**The plan is**: if there are spaces, this means this suspect tag has got attributes. In that case, there has to be at least one equal sign or equal count of unescaped double quotes. Otherwise, nothing will be collapsed/deleted from that particular tag.

{% include "btt.njk" %}
