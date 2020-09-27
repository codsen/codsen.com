---
layout: package
title: is-language-code
---

## Purpose

This program tells, is a given string a _valid_ language tag.

It is based on [RFC #5646](https://tools.ietf.org/html/rfc5646) "Tags for Identifying Languages" which was released in 2009 and as of Jan 2020 it is still [current](https://datatracker.ietf.org/doc/rfc5646/).

Language tags are used in many places, for example, in HTML attribute `hreflang`:

```html
<link rel="alternate" href="http://example.com" hreflang="es-es" />
```

It's impossible to properly match the spec using regex only - you can validate that allowed characters are in allowed places but you can't validate the meaning those characters have. The position of subtag and arrangement matters. Also, this program returns explanations _why_ it deemed the input not to be a language tag.

For example, `de-419-DE` is wrong because it contains two region tags, `419` and `DE`.

Existing regex-based solutions like [ietf-language-tag-regex](https://www.npmjs.com/package/ietf-language-tag-regex) don't have much of a logic besides enforcing subtag _order_ and subtag _length_, for example, it reports any string, longer than two characters, as a valid language tag. We, on other hand, validate each value against known IANA-registered names.

{% include "btt.njk" %}

## API

**{{ packageJsons["is-language-code"].lect.req }}(\[str])**

In other words, a function which takes a string.

Theoretically, input string is optional — if the input is not a string or an empty string, a negative answer will be returned. The program is liberal and doesn't throw errors.

Returns _a plain object_:

| Key's name | Key value's type  | Description                                 |
| ---------- | ----------------- | ------------------------------------------- |
| `res`      | boolean           | Answers, is this valid language code        |
| `message`  | `null` or string  | Explains what's wrong if answer is negative |

For example,

```js
{
  res: false,
  message: `Unrecognised language subtag, "posix".`
}
```

or

```js
{
  res: true,
  message: null
}
```

Non-string or empty-string inputs always yield `false`, program does not _throw_.

Language tags are not case-sensitive (there exist conventions for the capitalization of some of the subtags but they don't carry meaning). For performance reasons, all references of the input uses lowercase, even if you entered in uppercase. For example, `en-US-POSIX` would get reported as lowercase "posix":

```js
{
  res: false,
  message: `Unrecognised language subtag, "posix".`
}
```

{% include "btt.njk" %}

## By the way

Back in 1989, code `iw` was replaced with `he` so we won't include `iw`. Similar way, `ji` and `in` are not included.

> The following codes have been added in 1989 (nothing later): ug (Uigur), iu (Inuktitut, also called Eskimo), za (Zhuang), he (Hebrew, replacing iw), yi (Yiddish, replacing ji), and id (Indonesian, replacing in).
> — https://www.ietf.org/rfc/rfc1766.txt

{% include "btt.njk" %}
