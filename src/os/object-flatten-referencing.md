---
layout: package
title: object-flatten-referencing
---

## Idea

Sometimes you need to make one nested object to look like another, type-wise.

For example, you've got a key `a`, whose value is array of object(s):

```js
{
  a: [
    {
      b: "c",
      d: "e",
    },
  ];
}
```

but, you need the key to have its value as string:

```js
{
  a: "b.c<br />d.e";
}
```

This library does such object "flattening".

{% include "btt.njk" %}

## API

:::api
flattenReferencing(
  plainObject, 
  referenceObject,
  [options]
)
:::

Returns a new plain object, flattened according to your supplied reference object.

{% include "btt.njk" %}

#### 1st argument - `plainObject`

Type: `object` (plain object)
Obligatory: `yes`

First input argument — the object which you want to flatten.

#### 2nd argument - `searchValue`

Type: `object` (plain object)
Obligatory: `yes`

A reference object — according to what you want to flatten the `plainObject`.

#### 3rd argument (optional) - `options`

{% raw %}

Type: `object` (plain object)
Obligatory: `no`

Third argument - an Optional Options Object.

| `options` object's key                   | Type                         | Obligatory? | Default     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------- | ---------------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `wrapHeadsWith`                          | String                       | no          | `%%_`       | Prepend this to each value, each result of flattening or simply other encountered value.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `wrapTailsWith`                          | String                       | no          | `_%%`       | Append this to each value, each result of flattening or simply other encountered value.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `dontWrapKeys`                           | Array of strings or String   | no          | empty array | We won't append or prepend anything to the keys that match value(s) given here (applies to child nodes as well). Also, we won't flatten them (or their child nodes). This is used to prevent mangling of keys containing your [data storage](/os/json-variables/), for example. You can put wildcards (\*) to match zero or more characters.                                                                                                                |
| `dontWrapPaths`                          | Array of strings or String   | no          | empty array | This is a more-precise cousin of `dontWrapKeys`. Put the exact path(s) to the key you want to ignore. Remember to append `[number]` after keys that have values as arrays. For example, here's a path to ignore: `modules[0].part2[1].ccc[0].kkk` - key `modules` in root, equal to array. Take zero'th element from that array, it's an object. Take that object's key `part2`, it's equal to an array. Take that array's second element (index `1`)... and so on. This path would be ignored, for example. |
| `xhtml`                                  | Boolean                      | no          | `true`      | When flattening, arrays or plain objects are converted into strings. Each value is separated by a line break, and this controls which type to use: HTML (`<br>`) or XHTML (`<br />`)                                                                                                                                                                                                                                                                                                                         |
| `preventDoubleWrapping`                  | Boolean                      | no          | `true`      | If the current value already contains a string from `wrapHeadsWith` or `wrapTailsWith`, don't wrap to prevent double wrapping.                                                                                                                                                                                                                                                                                                                                                                               |
| `preventWrappingIfContains`              | Array of strings or String   | no          | empty array | Sometimes variables you set in mapping can have various notations, for example in Nunjucks default `wrapHeadsWith` would be `{{` but also some variables are marked with `{%`. Obviously they would not get recognised and whole string containing them would get wrapped with let's say `{{` and `}}`. But no more. State your system variable heads and tails here, put them as string array.                                                                                                              |
| `objectKeyAndValueJoinChar`              | String                       | no          | `.`         | When an object is turned into a string, its key is joined with its value, with another string in-between. This controls what that in-between string is.                                                                                                                                                                                                                                                                                                                                                      |
| `wrapGlobalFlipSwitch`                   | Boolean                      | no          | `true`      | You can turn off the wrapping function completely using this.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `ignore`                                 | Array or String              | no          | empty array | Don't apply any flattening to any of these keys. Naturally, don't wrap them with anything either.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `whatToDoWhenReferenceIsMissing`         | Integer or Integer as String | no          | `0`         | 0 = skip, 1 = throw, 2 = flatten to string                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `mergeArraysWithLineBreaks`              | Boolean                      | no          | `true`      | Should we merge arrays using `<br />`'s? It's handy to turn it off when mapping variables on email templates where values in data arrays are IF statements, and `<br />`'s are hardcoded inside of them.                                                                                                                                                                                                                                                                                                     |
| `mergeWithoutTrailingBrIfLineContainsBr` | Boolean                      | no          | `true`      | When merging arrays to produce a string, each row's contents will be checked do they contain `<br`, and if so, line break in front of it will not be added. Added in `v4`.                                                                                                                                                                                                                                                                                                                                   |
| `enforceStrictKeyset`                    | Boolean                      | no          | `true`      | Are you allowed to pass in an unrecognised keys in the options object?                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Here are all the defaults, compiled in one place just in case you want to copy and tweak:

```js
{
  wrapHeadsWith: '%%_',
  wrapTailsWith: '_%%',
  dontWrapKeys: [],
  xhtml: true,
  preventDoubleWrapping: true,
  preventWrappingIfContains: [],
  objectKeyAndValueJoinChar: '.',
  wrapGlobalFlipSwitch: true,
  ignore: [],
  whatToDoWhenReferenceIsMissing: 0,
  mergeArraysWithLineBreaks: true,
  mergeWithoutTrailingBrIfLineContainsBr: true,
  enforceStrictKeyset: true,
}
```

{% endraw %}
{% include "btt.njk" %}

## The algorithm

In its core, this library uses two functions:

- one which flattens objects
- another which flattens arrays

**Objects** are flattened into arrays (yes, not strings) in the following fashion:

```js
// from:
{
  a: 'b',
  c: 'd'
}
// to:
['%%_a.b_%%', '%%_c.d_%%']
```

Arrays are flattened into strings:

```js
// from:
["a", "b", "c"];
// to:
("%%_a_%%<br />%%_b_%%<br />%%_c_%%");
```

This library recursively traverses both inputs, compares their types and if one type is lesser in the food chain (object vs. string), it uses the above functions to flatten all mismatching elements into strings.

{% include "btt.njk" %}

## In practice

In practice, this library is used to map the variables in email templates.

For example, your _data content file_ in JSON (development version) that controls your template is:

```js
// data file:
{
  "title": "Welcome",
  "name": "John"
}
```

but you need to turn it into the following when generating PROD version:

```js
// you want your data file to look like this after processing:
{
  "title": "Welcome",
  "name": "${object.name}"
}
```

To achieve that, you use another JSON _mapping file_,

```js
// mapping file:
{
  "name": {
    "object": "name"
  }
}
```

It's easy to [merge](/os/object-merge-advanced/) the _mapping file_ onto the _data file_, but you get:

```js
// intermediate data file after merging the mapping file over data file
{
  "title": "Welcome",
  "name": {
    "object": "name"
  }
}
```

Now you need to **flatten** the above object, so that the key called `name` has a value of `string` type, not `object`. This library helps to achieve that:

```js
const mergedDataFile = {
  title: "Welcome",
  name: {
    object: "name",
  },
};
const reference = {
  title: "Welcome",
  name: "John",
};
mergedDataFile = flattenReferencing(mergedDataFile, reference, {
  wrapHeadsWith: "${",
  wrapTailsWith: "}",
});
console.log(JSON.stringify(mergedDataFile, null, 4));
// => {
//      "title": "Welcome",
//      "name": "${object.name}"
//    }
```

Voilà!

{% include "btt.njk" %}
