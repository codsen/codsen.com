---
layout: package
title: string-extract-class-names
packages:
  - detergent
---

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

## The Use

We use `string-extract-class-names` to extract all the CSS class and id names from HTML/CSS in the library [email-comb](/os/email-comb/) which detects and deletes the unused CSS styles.

{% include "btt.njk" %}
