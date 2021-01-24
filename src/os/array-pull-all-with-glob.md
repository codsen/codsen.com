---
layout: package
title: array-pull-all-with-glob
packages:
  - lodash.pullall
  - globby
---

## Purpose

This program removes strings from array if they match a glob pattern. It's like Lodash's [\_.pullAll](https://lodash.com/docs/#pullAll) except with [`globby`](https://www.npmjs.com/package/globby) on top.

For example, we use it in [email-comb](/os/email-comb/) to _whitelist_ CSS class/id names.

{% include "btt.njk" %}

## API

:::api
pull(
  sourceArray,
  removeThese,
  [opts]
)
:::

In other words, it's a function which takes three input arguments, third-one being optional (marked by square brackets).

{% include "btt.njk" %}

### API - Input

| Input argument | Type                                      | Obligatory? | Description                                                                          |
| -------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `sourceArray`  | Array of zero or more strings | yes         | Source array of zero or more strings                                                              |
| `removeThese`  | Array of zero or more strings or a string | yes         | Array of zero or more strings or a single string to be removed from the source array |
| `otps`         | Plain object                              | no          | An Optional Options Object. See its API below.                                       |

By the way, none of the input arguments are mutated. That's checked by unit tests from group 4.x

{% include "btt.njk" %}

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description                                                                                          |
| ---------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `caseSensitive`        | Boolean | `true`  | Are comparisons case-sensitive? Default answer is `yes`, but you can override it to `no` using this. |

**Here are all defaults in one place for copying**:

```js
{
  caseSensitive: true,
}
```

When unused, Optional Options Object can be also passed as a `null` or `undefined` value.

{% include "btt.njk" %}

### API - Output

| Type  | Description                            |
| ----- | -------------------------------------- |
| Array | Array of strings with elements removed |

{% include "btt.njk" %}
