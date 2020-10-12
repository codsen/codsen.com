---
layout: package
title: html-img-alt
---

## Purpose

This program adds missing `alt` attributes to `img` tags and tweaks existing-ones:

1. If `alt` attribute is missing on any `img` tag, it will add an one.
2. If `alt` attribute is present on any `img` tag, it will run its contents through [string-unfancy](/os/string-unfancy/) to:
   - decode all HTML entities, recursively (in case multiple HTML encoding was applied)
   - replace "fancy" characters with their simpler equivalents within ASCII range. For example, single curly quotes are changed into single apostrophes. This includes dashes and all sorts of double quotes.
   - replace all non-breaking spaces with regular spaces
3. If `img` empty `alt` attribute has single quotes, it will be replaced with empty double-quotes.
4. It will also normalise the white space within `img` tags, leaving one space between attributes and leaving one space before the closing slash (XHTML) or closing bracket (HTML).
5. You can turn it off, but by default all the contents of the image `ALT` attributes will be trimmed and [unfancie'd](/os/string-unfancy/) (curly quotes, m/n-dashes replaced with single quotes, minuses). That's to keep it simple for old email consumption software and make it easier to QA them.

`html-img-alt` works fine with both HTML and XHTML; it doesn't touch the closing slashes. Use a separate library for enforcing the closing slashes (or removing them) from singleton tags (`br`, `hr` and so on).

The main USP of this library is that **it does not parse the HTML**. It will never `throw` an error because of a dirty code. It might throw because of wrong input type, but not because of something in the code.

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["html-img-alt"].lect.req }}(str, [opts])
:::

In other words, it's a function which takes two input arguments, second-one being optional (marked by square brackets).

## Options

| `options` object's key  | Type    | Obligatory? | Default | Description                                                                                                                                                 |
| ----------------------- | ------- | ----------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unfancyTheAltContents` | Boolean | no          | `true`  | Are each image's `alt` attributes contents trimmed and processed by [string-unfancy](/os/string-unfancy/) |

Here are the defaults in one place for copying:

```js
{
  unfancyTheAltContents: true;
}
```

{% include "btt.njk" %}

## 2020 summer update

At our today's understanding, `alt` attributes should be enforced via a [linter](/os/emlint/), during coding. Think of `prettier` and `eslint` in web development.

The main consumer of this program - [detergent](/os/detergent/) - evolved greatly since and two reasons stop us from using this package:

**Performance.** Other tools will surely parse (or scanerless-way process) the HTML and another round of processing is both not DRY and perf-taxing

**Reportability.** All string (code) processing we do nowadays is done using [ranges](/ranges/) - composable records where we don't mutate string more than once in the whole program. This opens many opportunities for the next-generation web apps and JS packages.

For example, [ranges](/ranges/) allow [Detergent.io](https://detergent.io) web app to show only toggles, applicable to the current input. The program not only processes the text, but even reports which of the options would not even make a difference for a given input. And UI uses that info to hide those toggles. That's the next-generation web applications we're talking about.
