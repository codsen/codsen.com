---
layout: package
title: html-crush
packages:
  - email-comb
  - ranges-apply
---

## Purpose

* Minify email template, reducing size to the least possible.
* Remove indentations, keep line breaks (opposite of [tabifier](http://tools.arantius.com/tabifier) / beautifiers).

## Features

This program:

- Does not parse the input — input can be (X)HTML or whatever or mixed with whatever
- Equally, the input can be with HTML errors, broken HTML, incomplete HTML or not-quite-HTML or whatever
- Mailchimp, Responsys, Exact Target, Campaign Monitor tags in your HTML - all fine

As a side priority, this application also takes into consideration **human-friendliness**:

1. Its API (this npm library) reports progress and its GUI front-end https://htmlcrush.com utilises it to allow a responsive UI
2. We deliberately keep options count under [7](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two)
3. GUI also considers white and dark interfaces, use of modern toggle switches, CSS hovers to react to any interaction
4. API (this library) considers giving all possible JavaScript use choices: CommonJS transpiled to ES5, modern untranspiled ES Modules code in ES6, and UMD transpiled to ES5 with all dependencies baked-in, all published to npm and accessible via [jsDelivr](https://cdn.jsdelivr.net/npm/html-crush/dist/html-crush.umd.js) CDN
5. Developer friendliness - source is fully set up with `console.log`s which report the line numbers and all actions as they happen. Production builds (`dist/`) strip all logging, of course. This means it's easy to come back later or the first time and debug the code

{% include "btt.njk" %}

## API - Input

This program exports a plain object where main function is under a key "crush". That's why you consume it like this:

```js
import { crush, defaults, version } from "html-crush";
```

**crush(str, \[opts])** — in other words, function with two input arguments:

| Input argument position | We call it | Type | Obligatory? | Description                                        |
| ----- | -------------- | ---------------- | ----------- | -------------------------------------------------- |
| first | `str`          | String           | yes         | The input string of zero or more characters        |
| second | `opts`         | Plain object     | no          | An Optional Options Object. See [below](/os/html-crush/#optional-options-object) for its API. |

If supplied input arguments are of any other types, an error will be thrown.

{% include "btt.njk" %}

## API - Output

The function exported under key `crush` will return **a plain object** where you'll find log data, result string and corresponding string ranges of all actions performed:

| Key's name | Key value's type                          | Description                                                                                                                       |
| ---------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `log`      | Plain object                              | For example, `{ timeTakenInMilliseconds: 6, originalLength: 0, cleanedLength: 0, bytesSaved: 0, percentageReducedOfOriginal: 0 }` |
| `ranges`   | Array of zero or more string range arrays | Result in [ranges](/ranges/) notation.                |
| `result`   | String                                    | The result as string.                                                                           |

{% include "btt.njk" %}

### Optional Options Object

| Options Object's key     | The type of its value                   | Default              | Description                                                                                                                                                                                                                                                                          |
| ------------------------ | --------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lineLengthLimit`        | number                                  | `500`                | When removing line breaks, what is the maximum line length to keep. Relevant only when `opts.removeLineBreaks` is on                                                                                                                                                                 |
| `removeIndentations`     | Boolean                                 | `true`               | Should we remove indentations? The default is, yes.                                                                                                                                                                                                                                  |
| `removeLineBreaks`       | Boolean                                 | `false`              | Should we remove the line breaks? The default answer is, no. Enabling it automatically enables `opts.removeIndentations`.                                                                                                                                                            |
| `removeHTMLComments`     | Boolean or Numbers: `0`, `1` or `2`     | `false`              | Should we remove the HTML comments? Default answer, `false` is no, but there are settings to remove comments: `0` is off, `1` instructs to remove non-Outlook comments, `2` removes all comments including Outlook conditionals                                                      |
| `removeCSSComments`      | Boolean                                 | `true`               | Should we remove CSS comments? This concerns both head CSS comments and inline CSS style comments within HTML style attributes.                                                                                                                                                      |
| `reportProgressFunc`     | `null` or Boolean `false` or `function` | `null`               | If you supply a function here, it will be called, and an argument will be given to it, a natural number, which means percentage complete at that moment. Values will range from `1` to `99`, and finally, the main function will return the result's plain object.                   |
| `reportProgressFuncFrom` | Natural number                          | `0`                  | Default is zero percent but you can squeeze reporting percentages to start from a different number                                                                                                                                                                                   |
| `reportProgressFuncTo`   | Natural number                          | `100`                | Default is 100 percent but you can squeeze reporting percentages to go up to a different number                                                                                                                                                                                      |
| `breakToTheLeftOf`       | `array` of zero or more strings         | `see the list below` | When any of given strings are encountered AND `removeLineBreaks` option is on, current line will be terminated. This setting is not active if `removeLineBreaks` is turned off. If you want to disable a default set, either set this key to `false` or `null` or to an empty array. |
| `mindTheInlineTags`      | `array` of zero or more strings         | `see the list below` | Inline HTML tags such as `<span>` can accidentally introduce extra text. We take extra precautions when minifying around inline tags.                                                                                                                                                |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  removeHTMLComments: false,
  removeCSSComments: true,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
  breakToTheLeftOf: [
    "</td",
    "<html",
    "</html",
    "<head",
    "</head",
    "<meta",
    "<link",
    "<table",
    "<script",
    "</script",
    "<!DOCTYPE",
    "<style",
    "</style",
    "<title",
    "<body",
    "@media",
    "</body",
    "<!--[if",
    "<!--<![endif",
    "<![endif]",
  ],
  mindTheInlineTags: [
    "a",
    "abbr",
    "acronym",
    "audio",
    "b",
    "bdi",
    "bdo",
    "big",
    "br",
    "button",
    "canvas",
    "cite",
    "code",
    "data",
    "datalist",
    "del",
    "dfn",
    "em",
    "embed",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "label",
    "map",
    "mark",
    "meter",
    "noscript",
    "object",
    "output",
    "picture",
    "progress",
    "q",
    "ruby",
    "s",
    "samp",
    "script",
    "select",
    "slot",
    "small",
    "span",
    "strong",
    "sub",
    "sup",
    "svg",
    "template",
    "textarea",
    "time",
    "u",
    "tt",
    "var",
    "video",
    "wbr",
  ],
}
```

{% include "btt.njk" %}

## `opts.reportProgressFunc`

This feature is used in [a web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) setup. Basically, you pass the web worker the input (source, options) and it passes you one or more messages back. That can be one message, final result, but it can equally be many messages, for example, a sequence of natural numbers, each meaning progress percentage done so far, AND THEN, finally, full result.

This latter case is exactly what is happening on our front-end GUI, https://emailcrush.com

If you set the optional options object's key's `reportProgressFunc` value to anything else than a function, an error will be thrown.
If you set it to a function, that function will be fed a natural number string, meaning percentage done so far, from `1` to `100`.

Now, it's up to you how to distinguish "in progress" results and the final result. We use a random string, which is unlikely to happen in the input and we append that secret random string in front of the percentage being passed. Then, front-end checks did result that came through have a secret random string in front or not. If so, it's progress. If not, it's a final result.

## Example - using the `ranges` from the result

We use [`ranges-apply`](/os/ranges-apply/) to render the result from gathered _ranges_ and a source string.

```js
const htmlCrush = require("html-crush");
const rangesApply = require("ranges-apply");
const sourceHtml = `some text <strong>here</strong> and more text`;

const { log, ranges, result } = htmlCrush(sourceHtml);

// check the result string:
console.log(result);

// let's calculate same result by applying result ranges onto a source string:
console.log(rangesApply(sourceHtml, ranges));
```

Both results above will be the same. The _ranges_ approach lets us process the string further and add more ranges, then later [merge](/os/ranges-merge/) them and [apply](/os/ranges-apply/) in one go.
