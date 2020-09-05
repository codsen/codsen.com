---
layout: package
title: string-range-expander
packages:
  - ranges-push
  - ranges-apply
  - string-left-right
---

## Usage

```js
const expand = require("string-range-expander");
// let's say we have picked the "zzzz" index range - [16, 20]
// "something>\n\t    zzzz <here"
//                    |   |
//                  from  to
//
// PS. "\n" and "\t" take up a single character's length
//
const res = expand({
  str: "something>\n\t    zzzz <here",
  from: 16,
  to: 20,
  ifRightSideIncludesThisThenCropTightly: "<",
});
console.log("res = " + JSON.stringify(res1, null, 4));
// => [10, 21]
```

This library is used to manage the whitespace in the string index selections. The "from" and "to" indexes correspond the `String.slice()` "beginIndex" and "endIndex" API as described in [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice).

{% include "btt.njk" %}

## API

**expand(opts)**

The function is exported as _default_, you can name it any way you like when you `import`/`require`.

### API - Function's Input

| Input argument | Key value's type | Obligatory? | Description                               |
| -------------- | ---------------- | ----------- | ----------------------------------------- |
| `opts`         | Plain object     | yes         | An Options Object. See below for its API. |

If input arguments are supplied have any other types, an error will be `throw`n.

{% include "btt.njk" %}

### Optional Options Object

| Options Object's key                             | Type of its value                            | Obligatory? | Default      | Description                                                                                                       |
| ------------------------------------------------ | -------------------------------------------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------- |
| `str`                                            | string                                       | yes         | `""` (empty) | String to reference                                                                                               |
| `from`                                           | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `to`                                             | number (natural number)                      | yes         | `0`          | Index from which we should expand backwards                                                                       |
| `ifLeftSideIncludesThisThenCropTightly`          | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to tigger a tight crop. All concatenated into one chunk.  |
| `ifLeftSideIncludesThisCropItToo`                | string                                       | no          | `""` (empty) | All characters to the left side of given range you want to skip as if they were whitespace                        |
| `ifRightSideIncludesThisThenCropTightly`         | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to tigger a tight crop. All concatenated into one chunk. |
| `ifRightSideIncludesThisCropItToo`               | string                                       | no          | `""` (empty) | All characters to the right side of given range you want to skip as if they were whitespace                       |
| `extendToOneSide`                                | Boolean `false` or strings "left" or "right" | no          | `false`      | You can expand the range only to one side if you want using this.                                                 |
| `wipeAllWhitespaceOnLeft`                        | Boolean                                      | no          | `false`      | If on, range will be extended to the left until it reaches the first non-whitespace character (or EOL)            |
| `wipeAllWhitespaceOnRight`                       | Boolean                                      | no          | `false`      | If on, range will be extended to the right until it reaches the first non-whitespace character (or EOL)           |
| `addSingleSpaceToPreventAccidentalConcatenation` | Boolean                                      | no          | `false`      | If on, it will prevent accidental concatenation of strings by inserting a single space in tight crop situations   |

Here it is in one place if you want to copy-paste it somewhere:

```js
{
  str: "",
  from: 0,
  to: 0,
  ifLeftSideIncludesThisThenCropTightly: "",
  ifLeftSideIncludesThisCropItToo: "",
  ifRightSideIncludesThisThenCropTightly: "",
  ifRightSideIncludesThisCropItToo: "",
  extendToOneSide: false,
  wipeAllWhitespaceOnLeft: false,
  wipeAllWhitespaceOnRight: false,
  addSingleSpaceToPreventAccidentalConcatenation: false
}
```

{% include "btt.njk" %}

### API - Function's Output

The output is an array of two indexes, the new "from" and new "to". For example, `[12, 14]`.
