---
layout: package
title: ranges-ent-decode
---

## Purpose

{% include "src/components/content/tldr-ranges-ent-decode.md" %}

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["ranges-crop"].lect.req }}(str, [opts])
:::

In other words, it's a function which takes a string and an optional options object.

### API - Input

| Input argument | Key value's type | Obligatory? | Description                                        |
| -------------- | ---------------- | ----------- | -------------------------------------------------- |
| `input`        | String           | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object     | no          | The Optional Options Object, see below for its API |

If any input arguments supplied are in any other types, an error will be `throw`n.

{% include "btt.njk" %}

### API - Output

Returns [ranges](/ranges/) — `null` or array of one or more range arrays.

{% include "btt.njk" %}

### Optional Options Object

The Optional Options Object completely matches the [he.js](https://github.com/mathiasbynens/he) options as of `v.1.1.1`:

| An Optional Options Object's key | Type of its value | Default | Description                                                                                                                                                                                                           |
| -------------------------------- | ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isAttributeValue`               | Boolean           | `false` | If on, entities will be decoded as if they were in attribute values. If off (default), entities will be decoded as if they were in HTML text. Read more [here](https://github.com/mathiasbynens/he#isattributevalue). |
| `strict`                         | Boolean           | `false` | If on, entities that can cause parsing errors will cause `throw`s. Read more [here](https://github.com/mathiasbynens/he#strict-1).                                                                                    |

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  isAttributeValue: false,
  strict: false
}
```

{% include "btt.njk" %}

## More on the algorithm

The biggest pain to code and the main [USP](https://en.wikipedia.org/wiki/Unique_selling_proposition) of this library is **being able to recursively decode and give the result as ranges**.

By _recursively_, we mean, the input string is decoded over and over until there's no difference in the result between previous and last decoding. Practically, this means we can tackle the unlikely, but possible cases of double and triple encoded strings, for example, this is a double-encoded string: `&amp;mdash;`. The original m-dash was turned into `&mdash;` on the first encoding round; then during second round its ampersand got turned into `&amp;` which lead to `&amp;mdash;`.

By _ranges_ we mean, the result is not a decoded string, but _instructions_ — what to change in that string in order for the string to be _decoded_. Practically, this means, we decode and don't lose the original character indexes. In turn, this means, we can gather more "instructions" (ranges) and join them later.

{% include "btt.njk" %}

## Where's encode?

If you wonder, where's `encode()` _in ranges_, we don't need it! When you traverse the string and gather ranges, you can pass each ~code point~ grapheme (where emoji of length six should be counted "one") through `he.js` encode, compare "before" and "after" and if the two are different, create a new range for it.

The `decode()` is not that simple because the input string has to be processed, you can't iterate grapheme-by-grapheme (or character-by-character, if you don't care about Unicode's astral characters).

{% include "btt.njk" %}
