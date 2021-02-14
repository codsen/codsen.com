---
layout: package
title: string-remove-widows
packages:
  - detergent
---

## Idea

This library takes a string and removes [widow words](https://en.wikipedia.org/wiki/Widows_and_orphans), by replacing last space in the paragraph with [non-breaking space](http://www.fileformat.info/info/unicode/char/00a0/index.htm).

- Not just adds but if want, **removes** widow word prevention measures
- Tackles both paragraphs and single lines
- Recognises existing measures and if found, skips operation
- Option to encode for HTML, CSS or JS strings or put a raw non-breaking space
- Does not mangle the [line endings](https://stackoverflow.com/a/1552775/3943954) (Mac `LF`, Old style `CR` or Windows-style `CR LF`)
- A customisable minimum amount of words per line/paragraph to trigger widow word removal
- Can be used in different stages of the workflow: before HTML/CSS/JS-encoding or after
- Optionally replaces spaces with non-breaking spaces in front of all kinds of **dashes**
- Optionally replaces spaces with non-breaking spaces within **UK postcodes**
- Optionally it can skip content between templating tags, for example, Nunjucks `{{` and `}}` — presets are given for Jinja, Nunjucks, Liquid, Hexo and Hugo

{% include "btt.njk" %}

## API features

- This program is a "string-in — string-out" style function — decoupled from DOM, web pages or UI or CLI or terminal or file system. Build those on top of this program.
- This program delivers three builds: _UMD_ (for websites), _CommonJS_ (for Node applications) and _ES Modules_ (for modern Node applications and evergreen browsers too)

This program is used by [`detergent`](/os/detergent/).

{% include "btt.njk" %}

## API

When you `require`/`import`, you get three things:

```js
const { removeWidows, defaults, version } = require("string-remove-widows");
```

`removeWidows` is a function which does all the work.

`defaultOpts` is a plain object, all the default options.

`version` is a semver string like `1.0.0` brought straight from `package.json`.

{% include "btt.njk" %}

### API - `removeWidows()` Input

`removeWidows` is a function; its API is the following:

| Input argument | Key value's type | Obligatory? | Description                  |
| -------------- | ---------------- | ----------- | ---------------------------- |
| `str`          | String           | yes         | String which we will process |
| `opts`         | Plain object     | no          | Put options here             |

{% include "btt.njk" %}

### Optional Options Object

| Options Object's key            | The type of its value                                                     | Default | Description                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `removeWidowPreventionMeasures` | boolean                                                                   | `false` | If it's `true`, it will replace all widow word nbsp locations, with a single space                               |
| `convertEntities`               | boolean                                                                   | `true`  | If it's `false`, raw non-breaking space is inserted. If `true`, encoded in particular language (default HTML)    |
| `targetLanguage`                | string                                                                    | `html`  | Choose out of `html`, `css` or `js` — non-breaking spaces will be encoded in this language                       |
| `UKPostcodes`                   | boolean                                                                   | `false` | If enabled, every whitespace between two parts of UK postcodes will be replaced with non-breaking space          |
| `hyphens`                       | boolean                                                                   | `true`  | Whitespace in front of dashes (`-`), n-dashes (`–`) or m-dashes (`—`) will be replaced with a non-breaking space |
| `minWordCount`                  | natural number, `0` (disables feature), _falsy_ thing (disables feature) | `4`     | Minimum word count on a paragraph to trigger widow removal                                                       |
| `minCharCount`                  | natural number, `0` (disables feature), _falsy_ thing (disables feature) | `20`    | Minimum non-whitespace character count on a paragraph to trigger widow removal                                   |
| `ignore`                        | array of zero or more strings OR string                                   | `[]`    | List templating languages whose heads/tails will be recognised and skipped                                       |
| `reportProgressFunc`            | function or `null`                                                        | `null`  | If function is given, it will be pinged a natural number, for each percentage-done (in its first input argument) |
| `reportProgressFuncFrom`        | natural number or `0`                                                     | `0`     | Normally `reportProgressFunc()` reports percentages starting from zero, but you can set it to a custom value     |
| `reportProgressFuncTo`          | natural number                                                            | `100`   | Normally `reportProgressFunc()` reports percentages up to `100`, but you can set it to a custom value            |
| `tagRanges`                     | array of zero or more arrays                                              | `[]`    | If you know where the HTML tags are, provide string index ranges here                                            |

Here it is, in one place, in case you want to copy-paste it somewhere:

```js
{
  removeWidowPreventionMeasures: false, // if enabled this function overrides everything else
  convertEntities: true, // encode?
  targetLanguage: "html", // encode in what? [html, css, js]
  UKPostcodes: false, // replace space in UK postcodes?
  hyphens: true, // replace space with non-breaking space in front of dash
  minWordCount: 4, // if there are less words than this in chunk, skip
  minCharCount: 20, // if there are less characters than this in chunk, skip
  ignore: [], // list zero or more templating languages: "jinja", "hugo", "hexo", OR "all"
  reportProgressFunc: null, // reporting progress function
  reportProgressFuncFrom: 0, // reporting percentages from this number
  reportProgressFuncTo: 100, // reporting percentages up to this number
  tagRanges: []
}
```

{% include "btt.njk" %}

### API - `removeWidows()` Output

Function `removeWidows` returns a plain object; you pick the values from it:

| Key in a returned object | Key value's type                      | Description                                       |
| ------------------------ | ------------------------------------- | ------------------------------------------------- |
| `res`                    | String                                | Processed string                                  |
| `ranges`                 | Null or Array of one or more [Ranges](/ranges/) (arrays) | Same Ranges used to produce the `res`       |
| `log`                    | Plain object                          | See its format below                              |
| `whatWasDone`            | Plain object                          | Was it widow removal or just decoding performed ? |

for example, here's how the output could look like:

```js
{
  res: "Lorem ipsum dolor sit&nbsp;amet",
  ranges: [
    [21, 27, "&nbsp;"]
  ],
  log: {
    timeTakenInMilliseconds: 42
  },
  whatWasDone: {
    removeWidows: true,
    convertEntities: false
  }
}
```

{% include "btt.njk" %}

## More about `opts.targetLanguage`

Not all text ends up in HTML. As you know, you can inject the content via CSS pseudo attributes and also text might be prepared to be pasted into JSON.

This program allows you to customise the target encoding for chosen language: `html`, `css` or `js`.

Here's an HTML with HTML-encoded non-breaking space:

```html
Some raw text in a very long&nbsp;line.
```

Here's CSS analogue:

```css
span:before {
  content: "Some raw text in a very long\00A0line.";
}
```

Here's JavaScript analogue:

```js
alert("Some raw text in a very long\u00A0line.");
```

For example, a minimal application would look like this:

```js
const { removeWidows } = require("string-remove-widows");
// second input argument is a plain object, the Optional Options Object:
const result = removeWidows("Some raw text in a very long line.", {
  targetLanguage: "css",
});
// now the widow words will be prevented considering that content will go to CSS content:
console.log(result);
// => "Some raw text in a very long\00A0line."
```

{% include "btt.njk" %}

## More about `opts.ignore`

{% raw %}

Very often text already contains templating language literals.

For example, this Nunjucks snippet:

```
Hi{% if data.firstName %} data.firstName{% endif %}!
```

We intend to either say `Hi John!` to customer John or just `Hi!` if we don't know the customer's name.

But if we run widow words removal on this piece of text, **we don't want** `&nbsp;` inserted into the middle of `endif`:

```
Hi{% if data.firstName %} data.firstName{% endif&nbsp;%}!
                                                ^^^^^^
```

That's where `opts.ignore` comes in. You can list heads/tails (chunks from which to start ignoring/where to stop) manually:

```js
const { removeWidows } = require("string-remove-widows");
const result = removeWidows("Here is a very long line of text", {
  targetLanguage: "html",
  ignore: [
    {
      heads: "{{",
      tails: "}}",
    },
    {
      heads: ["{% if", "{%- if"],{% raw %}
      tails: ["{% endif", "{%- endif"],
    },
  ],
});
```

or you can just pick a template:

```
all
jinja
nunjucks
liquid
hugo
hexo
```

for example:

```js
const { removeWidows } = require("string-remove-widows");
const result = removeWidows("Here is a very long line of text", {
  targetLanguage: "html",
  ignore: "jinja",
});
```

If you want widest support of literals, all languages at once, put "all".

{% endraw %}
{% include "btt.njk" %}

## opts.tagRanges

Sometimes input string can contain HTML tags. We didn't go that far as to code up full HTML tag recognition, more so that such thing would duplicate already existing libraries, namely, [`string-strip-html`](/os/string-strip-html/).

`opts.tagRanges` accepts known HTML tag ranges (or, in fact, any "black spots" to skip):

```js
const { stripHtml } = require("string-strip-html");
const { removeWidows } = require("string-remove-widows");

const input = `something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>`;
// first, gung-ho approach - no tag locations provided:
const res1 = removeWidows(input).res;
console.log(res1);
// => something in front here <a style="display: block;">x</a> <b style="display:&nbsp;block;">y</b>
//                                                                               ^^^^^^
//                                      notice how non-breaking space is wrongly put inside the tag
//
// but, if you provide the tag ranges, program works correctly:
const tagRanges = stripHtml(input, { returnRangesOnly: true });
console.log(JSON.stringify(knownHTMLTagRanges, null, 4));
// => [[24, 51], [52, 56], [57, 84], [85, 89]]
// now, plug the tag ranges into opts.tagRanges:
const res2 = removeWidows(input, { tagRanges }).res;
console.log(res2);
// => something in front here <a style="display: block;">x</a>&nbsp;<b style="display: block;">y</b>
```

{% include "btt.njk" %}

## Compared to competition on npm

|                                                                                         | This program, <br> [`string-remove-widows`](/os/string-remove-widows/)                                            | [`widow-js`](https://www.npmjs.com/package/widow-js)                                                               | [`@simmo/widower`](https://www.npmjs.com/package/@simmo/widower)                                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
|                                                                                         | [![npm link](https://img.shields.io/npm/v/string-remove-widows.svg?style=flat-square)](https://www.npmjs.com/package/string-remove-widows) | [![npm link](https://img.shields.io/npm/v/widow-js.svg?style=flat-square)](https://www.npmjs.com/package/widow-js) | [![npm link](https://img.shields.io/npm/v/@simmo/widower.svg?style=flat-square)](https://www.npmjs.com/package/@simmo/widower) |
| Can both add and remove `nbsp`s                                                         | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Option to choose between raw, HTML, CSS or JS-encoded `nbsp`s                           | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Can replace spaces in front of hyphens, n- and m-dashes                                 | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Can prepare UK postcodes                                                                | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Does not mangle different types of line endings (`LF`, `CRLF`, `CR`)                    | ✅                                                                                                                                         | ✅                                                                                                                 | ✅                                                                                                                             |
| Customisable minimal word count threshold                                               | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Customisable minimal character count threshold                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Progress reporting function for web worker web apps                                     | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Reports string index ranges of what was done                                            | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Non-breaking space location's whitespace does not necessarily have to be a single space | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Presets for Jinja, Nunjucks, Liquid, Hugo and Hexo templating languages                 | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| Decoupled API^                                                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| CommonJS build                                                                          | ✅                                                                                                                                         | ❌                                                                                                                 | ✅                                                                                                                             |
| ES Modules build                                                                        | ✅                                                                                                                                         | ❌                                                                                                                 | ❌                                                                                                                             |
| UMD build for browser                                                                   | ✅                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Can process live DOM of a web page                                                      | ❌                                                                                                                                         | ✅                                                                                                                 | ❌                                                                                                                             |
| Licence                                                                                 | MIT                                                                                                                                        | ISC                                                                                                                | MIT                                                                                                                            |

^ A _decoupled_ API means that at its core, the program is a function "_string-in, string-out_" and is not coupled with DOM, file I/O, network or other unrelated operations. Such API makes it easier to test and create many different applications **on top** of a decoupled API.

For example, our competitor [widow.js](https://www.npmjs.com/package/widow-js) has two coupled parts: 1. API which does string-in, string-out, and 2. DOM processing functions. It could have been two npm libraries. In the end, people who don't need DOM operations can't use it.

One decoupled, "_string-in, string-out_" library like `string-remove-widows` might power all these at once:

- Web page DOM-manipulation library
- a CLI application to process files or piped streams
- an Express REST endpoint on a server,
- a serverless lambda on AWS,
- an Electron desktop program

{% include "btt.njk" %}
