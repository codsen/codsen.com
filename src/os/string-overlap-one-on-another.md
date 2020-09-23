---
layout: package
title: string-overlap-one-on-another
packages:
  - detergent
---

## Idea

In essence,

```js
//           aaa
//      +  bbb      (negative offset of 2 means it's pushed to the left by 2 places)
//         -----
//      =  bbbaa
```

{% include "btt.njk" %}

## API

**{{ packageJsons["string-overlap-one-on-another"].lect.req }}(str1, str2, [, opts])**

### API - Input

API for both methods is the same:

| Input argument | Type         | Obligatory? | Description                                                         |
| -------------- | ------------ | ----------- | ------------------------------------------------------------------- |
| `str1`         | String       | yes         | The string which will be put "under" `str2`                         |
| `str2`         | String       | yes         | The string which will be put "over" `str1`                          |
| `opts`         | Plain object | no          | An Optional Options Object. See its API below, in a separate table. |

{% include "btt.njk" %}

### Optional Options Object

| Optional Options Object's key | Type of its value                    | Default                                                                                                                                                                                                                                             | Description                                                                                                                                                         |
| ----------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `offset`                      | Positive or negative integer or zero | `0`                                                                                                                                                                                                                                                 | It instructs to offset the top string by this many characters to the right (if a positive number) or to the left (if a negative number). The default value is zero. |
| `offsetFillerCharacter`       | String                               | `` (space) | If the offset value (character amount to push left) pushes the `str2` outside the boundaries of `str1` and not even there's no overlap, but there is a gap, this gap is formed out of these characters. The default is a single space. |

Here are all the defaults in one place:

```js
{
  offset: 0, // how many characters str2 is to the right? (negative means it's off to the left)
  offsetFillerCharacter: " " // how many characters str2 is to the right? (negative means it's off to the left)
}
```

{% include "btt.njk" %}

## Edge cases

The algorithm is the following:

1. If one and only one of two input strings is zero-long, the other string is returned as a result.
2. If both input strings are empty, an empty string is returned.
3. If both input strings are non-empty, the result is second string overlaid on the first, considering the offset.

{% include "btt.njk" %}
