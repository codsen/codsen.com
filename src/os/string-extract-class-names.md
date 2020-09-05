---
layout: package
title: string-extract-class-names
packages:
  - detergent
---

## Quick Take

Extract the class and id names from a string and returns an array.

```js
const extract = require("string-extract-class-names");
const str = "div.first-class.second-class";

// default settings: each selector as string will be put in an array and returned:
const res1 = extract(str);
console.log("res1 = " + res1);
// => res1 = [".first-class", ".second-class"]

// optionally, you can request ranges:
const res2 = extract(str, true);
console.log("res2 = " + res2);
// => res2 = [[3, 15], [15, 28]]
```

{% include "btt.njk" %}

## API

```js
extract(inputString, [returnRangesInstead]);
```

In other words, it's a function which takes two input arguments. Brackets mean that argument is optional.

{% include "btt.njk" %}

### API - Input

| Input argument      | Type    | Obligatory? | Description                                                                                            |
| ------------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| inputString         | String  | yes         | String to process                                                                                      |
| returnRangesInstead | Boolean | no          | Default - `false` - return arrays of strings - selectors; optionally - `true` - return array of ranges |

By ranges we mean string slice ranges, arrays of two elements where both arguments match the `String.slice` first two arguments, `beginIndex` and `endIndex`.

{% include "btt.njk" %}

## More examples

```js
const extract = require("string-extract-class-names");

// two classes and one id extracted:
const res3 = extract("div.first.second#third a[target=_blank]");
console.log("res3 = " + res3);
// => res3 = ['.first', '.second', '#third']

// six id's extracted (works even despite the nonsensical question mark characters):
const res4 = extract("?#id1#id2? #id3#id4> p > #id5#id6");
console.log("res4 = " + res4);
// => res4 = ['#id1', '#id2', '#id3', '#id4', '#id5', '#id6']
```

{% include "btt.njk" %}

## Other packages

We use `string-extract-class-names` to identify all the CSS class names from the parsed HTML/CSS in the library [email-comb](/os/email-comb/) which detects and deletes the unused CSS styles.

{% include "btt.njk" %}
