---
layout: package
title: is-language-code
---

## Idea

This program tells, is a given string a _valid_ language tag.

It is based on [RFC #5646](https://tools.ietf.org/html/rfc5646) "Tags for Identifying Languages" which was released in 2009 and as of Jan 2020 it is still [current](https://datatracker.ietf.org/doc/rfc5646/).

Language tags are used in many places, for example, in HTML attribute `hreflang`:

```html
<link rel="alternate" href="http://example.com" hreflang="es-es" />
```

It's very hard to properly match the spec using regex only - you can validate that allowed characters are in allowed places but you can't validate the meaning those characters have. The position of subtag and arrangement matters. Also, this program returns explanations _why_ it deemed the input not to be a language tag.

For example, `de-419-DE` is wrong because it contains two region tags, `419` and `DE`:

```js
{
  res: false,
  message: `Two region subtags, "419" and "DE".`
}
```

Existing regex-based solutions like [ietf-language-tag-regex](https://www.npmjs.com/package/ietf-language-tag-regex) don't have much of a logic besides enforcing subtag _order_ and subtag _length_, for example, it reports any string, longer than two characters, as a valid language tag. We, on other hand, validate each value against known IANA-registered names.

{% include "btt.njk" %}

## API - Input

**isLangCode(str)** — in other words, a function which takes string.

If input is not a string or an empty string, a negative answer will be returned.

## API - Output

Program returns a clone of a plain object:

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

## For example,

```js
const isLangCode = require("is-language-code");
console.log(isLangCode("de").res);
// => true because it's a German language code
console.log(isLangCode("fr").res);
// => true because it's a French language code
console.log(isLangCode("ja").res);
// => true because it's a Japanese language code
console.log(isLangCode("zzz").res);
// => false - unrecognised. npm package "ietf-language-tag-regex" would fail this
console.log(isLangCode("1").res);
// => false - not recognised language code
console.log(isLangCode("x-klingon").res);
// => true - private use
console.log(isLangCode("x-whatever").res);
// => true - private use
console.log(isLangCode("zh-Hant").res);
// => true - Chinese written using the Traditional Chinese script
console.log(isLangCode("zh-cmn-Hans-CN").res);
// => true - Chinese, Mandarin, Simplified script, as used in China
console.log(isLangCode("zh-Hans-CN").res);
// => true - Chinese written using the Simplified script as used in mainland China
console.log(isLangCode("sr-Latn-RS").res);
// => true - Serbian written using the Latin script as used in Serbia
console.log(isLangCode("sl-rozaj").res);
// => true - Resian dialect of Slovenian
console.log(isLangCode("sl-nedis").res);
// => true - Nadiza dialect of Slovenian
console.log(isLangCode("de-CH-1901").res);
// => true - German as used in Switzerland using the 1901 variant [orthography]
console.log(isLangCode("sl-IT-nedis").res);
// => true - Slovenian as used in Italy, Nadiza dialect
console.log(isLangCode("hy-Latn-IT-arevela").res);
// => true - Eastern Armenian written in Latin script, as used in Italy
console.log(isLangCode("en-US").res);
// => true - English as used in the United States
console.log(isLangCode("de-CH-x-phonebk").res);
// => true - private use subtag (x-)
console.log(isLangCode("az-Arab-x-AZE-derbend").res);
// => true - private use subtag
console.log(isLangCode("x-whatever").res);
// => true - private use subtag using singleton x-
console.log(isLangCode("qaa-Qaaa-QM-x-southern").res);
// => true
console.log(isLangCode("de-Qaaa").res);
// => true - private use script subtag (Qaaa)
console.log(isLangCode("sr-Latn-QM").res);
// => true - Serbian, Latin script, private region QM
console.log(isLangCode("en-US-u-islamcal").res);
// => true - tag with extension
console.log(isLangCode("zh-CN-a-myext-x-private").res);
// => true - tag with extension
console.log(isLangCode("en-a-myext-b-another").res);
// => true - tag with extension

console.log(isLangCode("de-419-DE").res);
// => false - two region tags
console.log(isLangCode("a-DE").res);
// => false - use of a single-character subtag in primary position
console.log(isLangCode("ar-a-aaa-b-bbb-a-ccc").res);
// => false - two extensions with same single-letter prefix
```

{% include "btt.njk" %}

## By the way

Back in 1989, code `iw` was replaced with `he` so we won't include `iw`. Similar way, `ji` and `in` are not included.

> The following codes have been added in 1989 (nothing later): ug (Uigur), iu (Inuktitut, also called Eskimo), za (Zhuang), he (Hebrew, replacing iw), yi (Yiddish, replacing ji), and id (Indonesian, replacing in).
> — https://www.ietf.org/rfc/rfc1766.txt

{% include "btt.njk" %}

