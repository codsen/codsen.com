---
layout: package
title: array-group-str-omit-num-char
---

## Idea

Take an array of strings, group those which differ only by a certain number.

For example, consider this array atomic CSS class names coming from some report (for example, `email-comb` [output](/os/email-comb#api-output) object's key `deletedFromHead`):

```js
[
  "wbr425-padding-top-1",
  "wbr425-padding-top-2",
  "main-title",
  "wbr425-padding-top-3",
];
```

In real life, you could have for example, `wbr425-padding-top-*` would be shorter and go up to `500` and there were, let's say, 20 other groups like it.

This npm library groups strings, in this case producing:

```json
{
  "wbr425-padding-top-*": 3,
  "main-title": 1
}
```

Notice the "425" in `wbr425` was not replaced with wildcard because it was constant on all strings that were grouped. This feature, retaining constant digits, was the reason why we got into hassle producing this library.

You see, the quickest, alternative (gung-ho) algorithm is to replace all digits with "`*`" and filter the unique values, but "`425`" in `wbr425` would be lost. That's why we need this library.

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["array-group-str-omit-num-char"].lect.req }}(sourceArray, [opts])
:::

In other words, that variable you imported, "`{{ packageJsons["array-group-str-omit-num-char"].lect.req }}`" (or "`brambles`" or whatever) is a **function** which consumes two input arguments.

{% include "btt.njk" %}

### API - Input

| Input argument | Type         | Obligatory? | Description                                    |
| -------------- | ------------ | ----------- | ---------------------------------------------- |
| `sourceArray`  | Array        | yes         | Array of zero or more strings                  |
| `otps`         | Plain object | no          | An Optional Options Object. See its API below. |

By the way, none of the input arguments are mutated.

{% include "btt.njk" %}

### API - Output

An empty array input will give output of a empty plain object.
A non-empty array (with at least one string inside) will yield a plain object: strings will be grouped and put as **keys**, they count will be put as integer **values**.

For example:

```js
console.log({{ packageJsons["array-group-str-omit-num-char"].lect.req }}(["a1-1", "a2-2", "b3-3", "c4-4"]));
// {
//   "a*-*": 2,
//   "b3-3": 1,
//   "c4-4": 1
// }
```

{% include "btt.njk" %}

### An Optional Options Object

Type: `object` - an Optional Options Object.

| `options` object's key | Type    | Default | Description                                                                                                                                                     |
| ---------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `wildcard`             | String  | `*`     | What to use to mark grouped characters                                                                                                                          |
| `dedupePlease`         | Boolean | `true`  | By default, input array's contents will be deduped. But that's at a cost of performance, so if you're 100% sure your strings will be unique, set it to `false`. |

**Here are all defaults in one place for copying**:

```js
{
  wildcard: "*",
  dedupePlease: true
}
```

To explicitly mark the refusal to set custom Optional Options, it can be also passed as a `null` or `undefined` value. In that case, defaults will be set.

{% include "btt.njk" %}
