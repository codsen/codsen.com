---
layout: package
title: easy-replace
---

## Purpose

It's an alternative to JS regexes.

{% include "btt.njk" %}

## API

**{{ packageJsons["easy-replace"].lect.req }}(source_string, options_object, replacement_string)**

In other words, it's a "string-in, string-out" function with three input arguments, see them below.

{% include "btt.njk" %}

## API - Input

| Input argument       | Type         | Obligatory? | Description     |
| -------------------- | ------------ | ----------- | --------------- |
| `source_string`      | String       | yes         | Original string |
| `options_object`     | Plain Object | yes         | Settings        |
| `replacement_string` | String       | no          | Replace all the findings with this. If missing, library runs on _delete-only mode_, it won't replace, just delete. |

{% include "btt.njk" %}

## Options object:

| Options object's key | Type                    | Obligatory? | Description |
| -------------------- | ----------------------- | ----------- | ----------- |
| `leftOutsideNot`     | String/Array of strings | no          | Equivalent of regex negative lookbehind. This/these string(s) must **not be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.  |
| `leftOutside`        | String/Array of strings | no          | Equivalent of regex positive lookbehind. This/these string(s) must **be** present to the left of `searchFor` (plus any "maybe's" strings, see below), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.      |
| `leftMaybe`          | String/Array            | no          | If this is present on the left side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found. |
| `searchFor`          | String only             | yes         | The keyword to look for in the `source_string` |
| `rightMaybe`         | String/Array of strings | no          | If this is present on the right side of the `searchFor`, replace/delete it together with `searchFor`, but don't fret if it's not found. |
| `rightOutside`       | String/Array of strings | no          | Equivalent of regex positive lookahead. This/these string(s) must **be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted.     |
| `rightOutsideNot`    | String/Array of strings | no          | Equivalent of regex negative lookahead. This/these string(s) must **not be** present to the right of `searchFor` (plus any "maybe's" strings, see higher), in order for `searchFor` to be counted as "found". This input's contents are not replaced/deleted. |
| `i`                  | Plain object            | no          | Each key mentioned above can be set to a Boolean `true`/`false` to optionally be case-insensitive. Same thing as `i` flag in regexes. |

{% include "btt.njk" %}

## API - Output

| Type   | Description                 |
| ------ | --------------------------- |
| String | String with things replaced |

## Examples

_Simple replace:_

- **Example replacement recipe in words** — replace all instances of `x` with `🦄`.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "a x c x d",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "x",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: "",
  },
  "🦄"
);
console.log(res);
//=> 'a 🦄 c 🦄 d'
```

Case insensitive setting — set each and every key you want to ignore the case via `opts.i`:

```js
const er = require("easy-replace");
const res = er(
  "a X c x d",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "x",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      searchFor: true,
    },
  },
  "🦄"
);
console.log(res);
//=> 'a 🦄 c 🦄 d'
```

{% include "btt.njk" %}

### "Maybes" — optional surrounding strings to be replaced as well

- **Example replacement recipe in words** — Replace all instances of `i`. If there are `🐴` or `🦄` characters on the left, count them as part of found `i` and replace together as one thing. If there are `🐴` or `🦄` characters on the right, count them as part of found `i` and replace together as one thing.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "🐴i🦄 🐴i i🦄 i",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: ["🐴", "🦄"],
    searchFor: "i",
    rightMaybe: ["🐴", "🦄"],
    rightOutside: "",
    rightOutsideNot: "",
  },
  "x"
);
console.log(res);
//=> 'x x x x'
```

By the way, notice, how the values can be strings or arrays! The `easy-replace` doesn't accept array only for `searchFor` values — create a loop from the outside of this library, then call this library many times if you want to search for multiple values.

Case-insensitive setting will cover more surroundings' cases:

```js
const er = require("easy-replace");
const res = er(
  "Ai ib Aib i",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: ["a", "z"],
    searchFor: "i",
    rightMaybe: ["y", "b"],
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      leftMaybe: true,
    },
  },
  "x"
);
console.log(res);
//=> 'x x x x'
```

{% include "btt.njk" %}

### Negative lookahead - if you want to match something _not followed_ by something else

- **Example replacement recipe in words** — Replace all instances of `🦄`, but only ones that don't have `c` or `d` on the right.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "a🦄c x🦄x",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "🦄",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ["c", "d"],
  },
  "🐴"
);
console.log(res);
//=> 'a🦄c x🐴x'
```

Case insensitive setting will narrow-down the amount of findings/replacements:

```js
const er = require("easy-replace");
const res = er(
  "a🦄C x🦄x",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "🦄",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: ["c", "d"],
    i: {
      rightOutsideNot: true,
    },
  },
  "🐴"
);
console.log(res);
//=> 'a🦄c x🐴x'
```

{% include "btt.njk" %}

### Positive lookbehind - if you want to match something that is _preceded_ by something else

For example, search for space characters that have another space right to their left, and delete them

- **Example replacement recipe in words** — Replace all occurencies of space character, but only those that have another space character in front of them.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "zzzzz  zzzzzz zzzzzz",
  {
    leftOutsideNot: "",
    leftOutside: " ", // <- space
    leftMaybe: "",
    searchFor: " ", // <- space
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: "",
  },
  "" // <- empty string
);
console.log(res);
//=> 'zzzzz zzzzzz zzzzzz'
```

{% include "btt.njk" %}

### Negative lookbehind - if you want to match something that is NOT preceded by something else

For example, our `<br />` sometimes look like `<br/>`. Replace all occurencies of `/>` with <code>&#x7B;&#x7B;space character&#x7D;&#x7D;&#x2F;&#x3E;</code> (disregard curly braces, it's only to make it more visible here) if they are not preceded with space already:

- **Example replacement recipe in words** — Add missing spaces before closing slashes on tags. Do not add spaces where they exist already.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "<br /><br/><br />",
  {
    leftOutsideNot: " ",
    leftOutside: "",
    leftMaybe: "",
    searchFor: "/>",
    rightMaybe: "",
    rightOutside: "",
    rightOutsideNot: "",
  },
  " />"
);
console.log(res);
//=> '<br /><br /><br />'
```

{% include "btt.njk" %}

### Real life scenario

- **Example replacement recipe in words** — Add a missing semicolon and/or ampersand on `&nbsp;`, but only where they are missing.

- **Solution using this library:**:

```js
const er = require("easy-replace");
const res = er(
  "&nbsp; nbsp &nbsp nbsp;",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "&",
    searchFor: "nbsp",
    rightMaybe: ";",
    rightOutside: "",
    rightOutsideNot: "",
  },
  "&nbsp;"
);
console.log(res);
//=> '&nbsp; &nbsp; &nbsp; &nbsp;'
```

If you want to cover cases of random letter capitalisation of `n`, `b`, `s` and `p`, just set case-insensitive flag for `searchFor`:

```js
const er = require("easy-replace");
const res = er(
  "&nBsp; NBsp &nbSP NbsP;",
  {
    leftOutsideNot: "",
    leftOutside: "",
    leftMaybe: "&",
    searchFor: "nbsp",
    rightMaybe: ";",
    rightOutside: "",
    rightOutsideNot: "",
    i: {
      searchFor: true,
    },
  },
  "&nbsp;"
);
console.log(res);
//=> '&nbsp; &nbsp; &nbsp; &nbsp;'
```

{% include "btt.njk" %}
