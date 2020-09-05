---
layout: package
title: array-pull-all-with-glob
---

## Pulling

Let's say you have an array of strings and another array of strings to remove from the aforementioned array. That's easy to achieve with Lodash's [\_.pullAll](https://lodash.com/docs/#pullAll). However, what if you are not sure what _to-be-removed_ strings exactly look like and know only how their names _begin_, or there are too many of them to type manually, yet all begin with the same letters? What if you need to remove 99 elements: `module-1`, `module-2`, ... `module-99` from an array?

You need be able to put a _glob_ in a search query, that is, a _string pattern_ (`*`), which means _any character from here on_.

Check it out how easy it is to achieve that using this library:

```js
var pullAllWithGlob = require("array-pull-all-with-glob");
sourceArray = ["keep_me", "name-1", "name-2", "name-jhkgdhgkhdfghdkghfdk"];
removeThese = ["name-*"];
console.dir(pullAllWithGlob(sourceArray, removeThese));
// => ['keep_me']
```

We needed this library for another library, [email-comb](/os/email-comb/), where we had to _whitelist_ certain CSS classes (array of strings), removing them from another array.

{% include "btt.njk" %}

## API

```js
pullAllWithGlob(
  sourceArray, // input array of strings
  removeThese // array of strings to pull
);
```

### API - Input

| Input argument | Type                                      | Obligatory? | Description                                                                          |
| -------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `sourceArray`  | Array                                     | yes         | Source array of strings                                                              |
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
