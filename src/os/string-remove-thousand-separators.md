---
layout: package
title: string-remove-thousand-separators
packages:
  - detergent
---

## Use it

```js
const remSep = require("string-remove-thousand-separators");
let res = remSep("100,000.01");
console.log(res);
// => 100000.01
```

## Purpose

This library detects and removes a thousand separators from numeric strings.

The main consumer will be [`csv-split-easy`](/os/csv-split-easy/) which deals with exported Internet Banking CSV files in a double-entry accounting format.

The numeric string must be NUMERIC, that is, not contain any letters or other unrelated characters. It can contain empty space though, which will be automatically trimmed.

{% include "btt.njk" %}

## Examples

```js
var remSep = require("string-remove-thousand-separators");

// 🇬🇧 🇺🇸 thousand separators:
console.log(remSep("1,000,000.00"));
// => "1000000.00"

// 🇷🇺  thousand separators:
console.log(remSep("1 000 000,00"));
// => "1000000,00"
// (if you want it converted to Western notation with dot,
// set opts.forceUKStyle = true, see below)

// 🇨🇭 thousand separators:
console.log(remSep("1'000'000.00"));
// => "1000000.00"

// IT'S SMART TOO:

// will not delete if the thousand separators are mixed:
console.log(remSep("100,000,000.000")); // => does nothing

// but will remove empty space, even if there is no decimal separator:
// (that's to cope with Russian notation integers that use thousand separators)
console.log(remSep("100 000 000 000")); // => 100000000000

// while removing thousand separators, it will also pad the digits to two decimal places
// (optional, on by default, to turn it off set opts.padSingleDecimalPlaceNumbers to `false`):
console.log(remSep("100,000.2"));
// => "100000.20" (Western notation)

console.log(remSep("100 000,2"));
// => "100000,20" (Russian notation)

console.log(remSep("100'000.2"));
// => "100000.20" (Swiss notation)
```

{% include "btt.njk" %}

## API

**remSep('str'[, opts])**

If first argument (input) is not `string`, it will `throw` and error.
Second input argument, `opts`, is optional. However, if _it is_ present and is not `null`, not `undefined` and not a plain object, it will `throw` and error.

{% include "btt.njk" %}

### options

**Defaults**:

```js
    {
      removeThousandSeparatorsFromNumbers: true,
      padSingleDecimalPlaceNumbers: true,
      forceUKStyle: false
    }
```

| `options` object's key                | Type    | Obligatory? | Default | Description                                                                                                                                     |
| ------------------------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `removeThousandSeparatorsFromNumbers` | Boolean | no          | `true`  | Should remove thousand separators? `1,000,000` → `1000000`? Or Swiss-style, `1'000'000` → `1000000`? Or Russian-style, `1 000 000` → `1000000`? |
| `padSingleDecimalPlaceNumbers`        | Boolean | no          | `true`  | Should we pad one decimal place numbers with zero? `100.2` → `100.20`?                                                                          |
| `forceUKStyle`                        | Boolean | no          | `false` | Should we convert the decimal separator commas into dots? `1,5` → `1.5`?                                                                        |

{% include "btt.njk" %}
