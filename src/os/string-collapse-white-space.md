---
layout: package
title: string-collapse-white-space
packages:
  - detergent
---

## API

::: api
collapse(str, [opts])
:::

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

### API - Input

| Input argument | Type                                            | Obligatory? | Description                                                                                                      |
| -------------- | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------- |
| `str`          | String | yes         | Source string to work upon |
| `opts`        | Something _falsy_ or a Plain object | no          | The Optional Options Object, see below for its API |

{% include "btt.njk" %}

### API - Output

Function returns a plain object, for example:

```js
{
  result: "abc click me def",
  ranges: [
    [3, 6, " "],
    [14, 18, " "],
  ]
}
```

It has the following keys:

| Key's name | Key value's type                          | Description                                                                                                                       |
| ---------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `result`   | String                                    | The string output where all ranges were applied to it.                                                                           |
| `ranges`   | [ranges](/ranges/): an array of one or more arrays containing from-to string index ranges OR `null` | For example, if characters from index `0` to `5` and `30` to `35` were deleted, that would be `[[0, 5], [30, 35]]`. Another example, if nothing was found, it would put here `null`.                |

{% include "btt.njk" %}

### Optional Options Object

`opts` is a plain object. Here are all its keys:

| `options` object's key         | Type                   | Obligatory? | Default | Description                                                                                                                                                                         |
| ------------------------------ | ---------------------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trimStart`                    | Boolean                | no          | `true`  | if `false`, leading whitespace will be just collapsed. |
| `trimEnd`                      | Boolean                | no          | `true`  | if `false`, trailing whitespace will be just collapsed.                                                                                                                             |
| `trimLines`                    | Boolean                | no          | `false` | if `true`, every line will be trimmed (all whitespace characters except line breaks CR and LF will be deleted, also non-breaking spaces will be deleted, if `trimnbsp` is set to `true`)                            |
| `trimnbsp`                     | Boolean                | no          | `false` | when trimming, do we delete non-breaking spaces (if set to `true`, answer would be "yes"). This setting also affects `trimLines` setting above.                                     |
| `removeEmptyLines`             | Boolean                | no          | `false` | if any line can be trimmed to empty string, it will be removed.                                                                                                                     |
| `limitConsecutiveEmptyLinesTo` | Natural number or zero | no          | `0`     | Set to 1 or more to allow that many blank lines between content                                                                                                                     |
| `enforceSpacesOnly` | Boolean | no          | `false`     | If enabled, not only consecutive space character chunks will be collapsed but any whitespace character chunks (except line breaks). |
| `cb` | Function | no          | see below     | All output and every whitespace chunk (including single spaces) is fed to it. Whatever you return, gets written to resulting [ranges](/ranges/). |

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb: ({ suggested, whiteSpaceStartsAt, whiteSpaceEndsAt, str }) => suggested,
}
```

{% include "btt.njk" %}

## `opts.cb`

This program implements a callback interface - every reported range is fed to the callback. The default callback is `({ suggested }) => suggested` but you can tweak it.

See [examples](/os/string-collapse-white-space/examples/).

When nothing is to be removed, callback will ping `suggested` key value as `null`. You can still return any string index range and it will be deleted (array of two elements) or replaced (array of three elements). Learn more about [ranges](/ranges/) notation.

{% include "btt.njk" %}
