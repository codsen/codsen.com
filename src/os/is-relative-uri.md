---
layout: package
title: is-relative-uri
---

## Background

For example, HTML attributes `href` have URI-type values.

This program validates, are URI's, specifically, _relative URI references_, typed correctly. It will not "go to the internet" to check is the actual asset online, it will only tell if you mistyped something.

If you consider "URI"-type attribute values in HTML, for example `href`, there two kinds of value types:

- those that start with _scheme_, `http` or `https` or `mailto` or whatever, and
- those that don't.

_Scheme_ like `https` is the "normal" way:

```xml
<a href="https://www.npmjs.com">z</a>
```

But no _scheme_, so called _relative URI's_ are fine too:

```xml
<a href="//example.com/path/resource.txt">z</a>
<a href="/path/resource.txt">z</a>
<a href="path/resource.txt">z</a>
<a href="/path/resource.txt">z</a>
<a href="../resource.txt">z</a>
<a href="./resource.txt">z</a>
<a href="resource.txt">z</a>
<a href="#fragment">z</a>
```

But spec-wise, at least theoretically, these are also fine (see [wikipedia](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#URI_references) for more).

Considering the base URI of `http://a/b/c/d;p?q`, the following URI's would get resolved accordingly:

```xml
<a href="g:h">z</a>     -> "g:h"
<a href="g">z</a>       -> "http://a/b/c/g"
<a href="./g">z</a>     -> "http://a/b/c/g"
<a href="g/">z</a>      -> "http://a/b/c/g/"
<a href="/g">z</a>      -> "http://a/g"
<a href="//g">z</a>     -> "http://g"
<a href="?y">z</a>      -> "http://a/b/c/d;p?y"
<a href="g?y">z</a>     -> "http://a/b/c/g?y"
<a href="#s">z</a>      -> "http://a/b/c/d;p?q#s"
<a href="g#s">z</a>     -> "http://a/b/c/g#s"
<a href="g?y#s">z</a>   -> "http://a/b/c/g?y#s"
<a href=";x">z</a>      -> "http://a/b/c/;x"
<a href="g;x">z</a>     -> "http://a/b/c/g;x"
<a href="g;x?y#s">z</a> -> "http://a/b/c/g;x?y#s"
<a href="">z</a>        -> "http://a/b/c/d;p?q"
<a href=".">z</a>       -> "http://a/b/c/"
<a href="./">z</a>      -> "http://a/b/c/"
<a href="..">z</a>      -> "http://a/b/"
<a href="../">z</a>     -> "http://a/b/"
<a href="../g">z</a>    -> "http://a/b/g"
<a href="../..">z</a>   -> "http://a/"
<a href="../../">z</a>  -> "http://a/"
<a href="../../g">z</a> -> "http://a/g"
```

{% include "btt.njk" %}

## Validating them all

As you saw, relative URI's can be pretty much anything, including empty string and random letters like `zzz`.

What do we do?

The only thing left is to try to **catch bad patterns**.

Conceptually, this program tells **if a given string is not messed up** from the perspective of relative URI pattern, as far as our imperfect algorithm sees.

Mainly: no whitespace, no repeated things (tripple slashes or double question marks), no slashes or dots after a hash, two dots must not be followed by a letter and others.

{% include "btt.njk" %}

## API - Input

**isRel(str, opts)** — in other words, a function which takes a string and options, a plain object.

| Input argument | Type         | Obligatory? | Description                                                                                           |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `str`          | String       | no          | The extracted value of HTML `media` attribute or CSS media query without `@media` or opening bracket. |
| `opts`         | Plain object | no          | Optional options go here.                                                                             |

If input is not a string, error will be thrown.

{% include "btt.njk" %}

### Options object

| `options` object's key  | Type    | Obligatory? | Default | Description                                                            |
| ----------------------- | ------- | ----------- | ------- | ---------------------------------------------------------------------- |
| `flagUpUrisWithSchemes` | boolean | no          | `true`  | Should we yield `false` on URI's with scheme (`https://` for example)? |

{% include "btt.njk" %}

## API - Output

Program returns a clone of a plain object similar to:

```js
{
  res: false,
  message: `Two consecutive hashes.`
}
```

or if schema-URI's are flagged up via `opts.flagUpUrisWithSchemes`, the `message` value can be `null`:

```js
{
  res: false,
  message: null
}
```

or

```js
{
  res: true,
  message: null
}
```

`res` is always boolean.

`message` is either string (error message) or `null`.

False `res` and `null` message happens only on schema-URI's. By checking is `message` set we distinguish were there real errors.

{% include "btt.njk" %}

## Example

```js
const isRel = require("is-relative-uri");
const str = `.../resource.txt`;
const res = isRel(str);
console.log(JSON.stringify(res, null, 4));
// => {
//      res: false,
//      message: `Two consecutive hashes.`
//    }
```

{% include "btt.njk" %}

## `opts.flagUpUrisWithSchemes`

When validating the URI's which can be relative (for example, `href` attribute values) one should use two libraries: one to check strict URI's (those with schema) and one with relative URI's (those without schema).

For example, [is-url-superb](https://www.npmjs.com/package/is-url-superb) and this package.

If `opts.flagUpUrisWithSchemes` is set to `true`, this program will search for schemes and yield a falsy result if it detects a known `<scheme>:` for example `mailto:`.

Another challenge: URI with schema-as-error is not the same "error" — it's not a "real error". To distinguish the two we'll set result object's key `message` to `null`.

That is, seemingly correct URI will have a message `null`:

```js
const isRel = require("is-relative-uri");
const str = `https://codsen.com`;
const res = isRel(str, { flagUpUrisWithSchemes: true });
console.log(JSON.stringify(res, null, 4));
// => {
//      res: false,
//      message: null
//    }
```

{% include "btt.njk" %}
