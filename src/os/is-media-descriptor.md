---
layout: package
title: is-media-descriptor
---

## Purpose

We are talking about so-called _media descriptors_ ([older spec](https://www.w3.org/TR/html4/types.html#type-media-descriptors), [newer spec - CSS MQ Level 4, draft at the moment](https://drafts.csswg.org/mediaqueries/)), for example, the part `screen and (color), projection and (color)` in both HTML and CSS:

```
<link media="screen and (color), projection and (color)" rel="stylesheet" href="example.css">

<link media="screen and (color), projection and (color)" rel="stylesheet" href="example.css" />

<?xml-stylesheet media="screen and (color), projection and (color)" rel="stylesheet" href="example.css" ?>

@import url(example.css) screen and (color), projection and (color);

@media screen and (color), projection and (color) { ... }
```

We plan to catch as many errors as possible:

- typos
- unclosed brackets
- redundant characters
- untangle the boolean logic
- ... anything that can happen to media queries and media selectors in general.

This is not a replacement for the validator; this is a linting tool. We will use it in [`emlint`](/os/emlint/).

Conceptually, CSS spec is very permissive, if it doesn't like something it invalidates that part and moves on. In this light, linting needs to be the opposite.

{% include "btt.njk" %}

## API - Input

::: api
{{ packageJsons["is-media-descriptor"].lect.req }}(str, opts)
:::

In other words, a function which takes a string and options, a plain object.

| Input argument | Type         | Obligatory? | Description                                                                                           |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `str`          | String       | no          | The extracted value of HTML `media` attribute or CSS media query without `@media` or opening bracket. |
| `opts`         | Plain object | no          | Optional options go here.                                                                             |

For example, all the calls below will yield an empty array (no errors):

```js
isMediaD();
isMediaD("");
isMediaD("screen");
isMediaD("screen", {});
isMediaD("screen", null);
isMediaD("screen", { offset: 0 });
isMediaD("screen", { offset: 51 });
```

⚠️ A bad example is below - don't put `@media`, please extract the value:

```js
// program won't work with `@media` - extract the value first!
isMediaD(
  "@media only (screen) and (min-width: 320px) and (max-width: 500px) {"
);
```

Feed function with extracted value, with no `@media`:

```js
isMediaD("only (screen) and (min-width: 320px) and (max-width: 500px)");
```

If an input is not a string or an empty string, an empty array will be returned.

{% include "btt.njk" %}

### Options object

| `options` object's key | Type    | Obligatory? | Default | Description                                            |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------ |
| `offset`               | Integer | no          | `0`     | All reported indexes will be incremented by this much. |

Falsy `opt.offset` is fine but something truthy which is not a natural number will _throw_.

{% include "btt.njk" %}

## API - Output

The program returns an array of zero or more plain objects, each meaning an error. Each object's notation is the same as in [`emlint`](/os/emlint/) (except there's no `ruleId`):

```js
{
  idxFrom: 21,
  idxTo: 22,
  message: `Rogue bracket.`,
  fix: {
    ranges: [[21, 22]]
  }
}
```

Quick basics: `idxFrom` and `idxTo` are the same as in `String.slice`, just used for marking.

The `fix` key is either `null` or has value — plain object — with key `ranges`. ESLint uses singular, `range`, EMLint uses `ranges`, plural, because EMLint uses Ranges notation — where ESLint marks "to add" thing separately, EMLint puts it as the third element in ranges array.

Ranges are always either `null` or array of arrays.

EMLint and ranges arrays here follow Ranges notation and [all Ranges packages](/ranges/) can be used to process them — [merging](/os/ranges-merge/), [inverting](/os/ranges-invert/), [resolving/applying](/os/ranges-apply/) and so on.

{% include "btt.njk" %}

## Competition

There are capable CSS parsers out there, but they are all oriented at parsing the **correct code** and strictly pure HTML or CSS. Code validators built upon such parsers are not really serious validators.

- [W3C](http://jigsaw.w3.org/css-validator/#validate_by_input+with_options)
- [CSSTree Validator](https://csstree.github.io/docs/validator.html)

Conceptually, code checking tools should use advanced but slow parsers, likely _scanerless_-ones to find and fix errors. Then, for general parsing (like syntax highlighting), parsers which can't recognise many errors but are fast should be used.

We're talking about two different levels of the "food-chain". Currently, there is not much competition for this program in this sense.

{% include "btt.njk" %}
