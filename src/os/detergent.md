---
layout: package
title: detergent
packages:
  - html-entities-not-email-friendly
  - string-apostrophes
  - string-collapse-white-space
  - string-fix-broken-named-entities
  - string-left-right
  - string-remove-widows
  - string-strip-html
  - string-trim-spaces-only
---

## Purpose

`detergent` prepares text for placing into HTML, especially, _email-template_ HTML:

- deletes invisible Unicode characters (like [ETX](http://www.fileformat.info/info/unicode/char/0003/index.htm))
- [collapses](/os/string-collapse-white-space) whitespace
- trims
- prevents [widow words](https://en.wikipedia.org/wiki/Widows_and_orphans)
- recursively decodes entities and encodes it back, preferring _named_ HTML entities over _numeric_-ones, switching to _numeric_ for entities which [don't render correctly](/os/html-entities-not-email-friendly/) across email clients
- optionally [strips HTML](/os/string-strip-html) (with optional granular control over which tags exactly)
- improves English grammar style: converts [M- and N-dashes](http://practicaltypography.com/hyphens-and-dashes.html) [apostrophes](http://practicaltypography.com/apostrophes.html) and [curly quotes](http://practicaltypography.com/straight-and-curly-quotes.html)

Extra features are:

- You can skip the HTML encoding of non-Latin language letters. Useful when you are deploying Japanese or Chinese emails because otherwise, _everything_ would be HTML-encoded.
- Detergent is both XHTML and HTML-friendly. You can set which way you want your `<br>`'s to appear: with a closing slash, `<br/>` (XHTML) or without (HTML), `<br>` — that's to reduce code validator errors.

{% include "btt.njk" %}

## API

The main function is exported in a plain object under key `det`:

```js
const { det } = require("detergent");
// or request everything:
const { det, opts, version } = require("detergent");
// this gives extra plain object `opts` with default options. Handy when
// developing front-ends that consume the Detergent.
```

`det` is the main function. See its API below.

`opts` is default options' object. You pass it (or its tweaked version) to `det`.

`version` returns same-named package.json key's value - the version of the particular copy of Detergent you've got.

{% include "btt.njk" %}

### API - `det()` Input

The `det` above is a function. You pass two input arguments to it:

| Input argument | Type   | Obligatory? | Description                                    |
| -------------- | ------ | ----------- | ---------------------------------------------- |
| `input`        | String | yes         | The string you want to clean.                  |
| `options`      | Object | no          | Options object. See its key arrangement below. |

{% include "btt.njk" %}

### API - `det()` second input argument, the options object

| Options object's key     | Type of its value                | Default                                   | Description                                                                                                                                                                       |
| ------------------------ | -------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fixBrokenEntities`      | Boolean                          | True                                      | should we try to fix any broken named HTML entities like `&nsp;` ("b" missing)                                                                                                    |
| `removeWidows`           | Boolean                          | True                                      | replace the last space in paragraph with a non-breaking space                                                                                                                     |
| `convertEntities`        | Boolean                          | True                                      | encode all non-[ASCII](https://en.wikipedia.org/wiki/ASCII) chars                                                                                                                 |
| `convertDashes`          | Boolean                          | True                                      | typographically-correct the n/m-dashes                                                                                                                                            |
| `convertApostrophes`     | Boolean                          | True                                      | typographically-correct the apostrophes                                                                                                                                           |
| `replaceLineBreaks`      | Boolean                          | True                                      | replace all line breaks with `br`'s                                                                                                                                               |
| `removeLineBreaks`       | Boolean                          | False                                     | put everything on one line (removes any line breaks, inserting space where necessary)                                                                                             |
| `useXHTML`               | Boolean                          | True                                      | add closing slashes on `br`'s                                                                                                                                                     |
| `dontEncodeNonLatin`     | Boolean                          | True                                      | skip non-latin character encoding (for example, [CJK](https://en.wikipedia.org/wiki/CJK_characters), Alefbet Ivri or Arabic abjad)                                                |
| `addMissingSpaces`       | Boolean                          | True                                      | adds missing spaces after dots/colons/semicolons, unless it's an URL                                                                                                              |
| `convertDotsToEllipsis`  | Boolean                          | True                                      | convert three dots into `&hellip;` - ellipsis character. When set to `false`, all encoded ellipses will be converted to three dots.                                               |
| `stripHtml`              | Boolean                          | True                                      | by default, all HTML tags are stripped (with exception to `opts.keepBoldEtc` - option to ignore `b`, `strong` and other tags). You can turn off HTML tag removal completely here. |
| `stripHtmlButIgnoreTags` | Array                            | `["b", "strong", "i", "em", "br", "sup"]` | List zero or more strings, each meaning a tag name that should not be stripped. For example, `["a", "sup"]`.                                                                      |
| `stripHtmlAddNewLine`    | Array                            | `["li", "/ul"]`                           | List of zero or more tag names which, if stripped, are replaced with a line break. Closing tags must start with slash.                                                            |
| `cb`                     | something _falsy_ or a function | `null`                                    | Callback function to additionally process characters between tags (like turning letters uppercase)                                                                                |

Here it is in one place:

```js
det("text to clean", {
  fixBrokenEntities: true,
  removeWidows: true,
  convertEntities: true,
  convertDashes: true,
  convertApostrophes: true,
  replaceLineBreaks: true,
  removeLineBreaks: false,
  useXHTML: true,
  dontEncodeNonLatin: true,
  addMissingSpaces: true,
  convertDotsToEllipsis: true,
  stripHtml: true,
  stripHtmlButIgnoreTags: ["b", "strong", "i", "em", "br", "sup"],
  stripHtmlAddNewLine: ["li", "/ul"],
  cb: null,
});
```

The default set is a wise choice for the most common scenario - preparing text to be pasted into HTML.

You can also set the options to numeric `0` or `1`, that's shorter than Boolean `true` or `false`.

{% include "btt.njk" %}

### API - `det()` output - an object

| output object's key | Type of its value | Description                                                                                                                 |
| ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `res`               | String            | The cleaned string                                                                                                          |
| `applicableOpts`    | Plain Object      | Copy of options object without keys that have array values, each set to boolean, is that function applicable to given input |

Function `det` returns a plain object, for example:

```js
{
  res: "abc",
  applicableOpts: {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false
  }
}
```

{% include "btt.njk" %}

## `applicableOpts`

Next generation web applications are designed to show only the options that are applicable to the given input. This saves user's time and also conserves mental resources — you don't even need to read all the labels of the options if they are not applicable.

Detergent currently has 14 option keys, 12 of them boolean. That's not a lot but if you use the tool every day, every optimisation counts.

We got inspiration for this feature while visiting competitor application [typograf](https://typograf.github.io) — it has 110 checkboxes grouped into 12 groups and options are hidden twice — first sidebar is hidden when you visit the page, second, option groups are collapsed.

Another example of overwhelming options set — Kangax minifier — [html-minifier](https://kangax.github.io/html-minifier/) — it's got 26 options with heavy descriptions.

Detergent tackles this problem by changing its algorithm: it processes the given input and then makes a note, is particular option applicable or not, independently, is it enabled or not. Then, if it's enabled, it changes the result value.

For example, detergent's output might look like this — all options not applicable because there's nothing to do on "abc":

```js
{
  res: "abc",
  applicableOpts: {
    fixBrokenEntities: false,
    removeWidows: false,
    convertEntities: false,
    convertDashes: false,
    convertApostrophes: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    useXHTML: false,
    dontEncodeNonLatin: false,
    addMissingSpaces: false,
    convertDotsToEllipsis: false,
    stripHtml: false
  }
}
```

The options keys which have values of a type _array_ (`stripHtmlButIgnoreTags` and `stripHtmlAddNewLine`) are omitted from `applicableOpts` report.

{% include "btt.njk" %}

## Example

Custom settings object with one custom setting `convertEntities` (others are left default):

```js
const { det } = require("detergent");
let { res } = det("clean this text £", {
  convertEntities: 0, // <--- zero is like "false", turns off the feature
});
console.log(res);
// > 'clean this text £'
```

{% include "btt.njk" %}

## `opts.cb`

One of the unique (and complex) features of this program is HTML tag recognition. We process only the text and don't touch the tags, for example, widow word removal won't add non-breaking spaces within your tags if you choose not to strip the HTML.

`opts.cb` lets you perform additional operations on all the string characters outside any HTML tags. For example, [detergent.io](https://detergent.io) uppercase-lowercase functionality relies on `opts.cb`.

Here's an example, consider this case — HTML tags skipped when turning letters uppercase:

```js
const { det } = require("detergent");
const { res } = det(`aAa\n\nbBb\n\ncCc`, {
  cb: (str) => str.toUpperCase(),
});
console.log(res);
// => "AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC"
```

{% include "btt.njk" %}
