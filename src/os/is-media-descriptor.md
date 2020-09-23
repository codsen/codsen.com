---
layout: package
title: is-media-descriptor
---

## Example

```js
const isMediaD = require("is-media-descriptor");
const str = `screeen`;
const res = isMediaD(str);
console.log(JSON.stringify(res, null, 4));
// => [
//      {
//        idxFrom: 0,
//        idxTo: 7,
//        message: `Did you mean "screen"?`,
//        fix: {
//          ranges: [[0, 7, "screen"]]
//        }
//      }
//    ]
```

The error objects match those of [`emlint`](/os/emlint/), ranges value matches the [ranges](/ranges/) spec (in ranges index array, third array element means what to add; only two elements is deletion).

{% include "btt.njk" %}

## Background

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

This is not a replacement for validator, this is a linting tool. We will use it in [`emlint`](/os/emlint/).

Conceptually, CSS spec is very permissive, if it doesn't like something it invalidates that part and moves on. In this light, linting needs to be the opposite.

{% include "btt.njk" %}

## API - Input

**isMediaD(str, opts)** — in other words, a function which takes a string and options, a plain object.

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

falsy `opt.offset` is fine but something truthy which is not a natural number will _throw_.

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

Think, if a tool catches errors, and those errors break parsers, and parser drives a tool, how capable is the tool?

It's similar to:

If a policemen catch thieves, and thieves pay the government each month to pay police wages, how capable is that police?

Parser is for correct code. For broken code or mixed sources, you need _Rambo_ tool, trained at dealing with bad guys. You need this program.

This program is aimed at **broken code processing**, to power linters, to find _and fix_ broken code, possibly at code-editor-level. It does not work from AST; it processes the input as string.

{% include "btt.njk" %}
