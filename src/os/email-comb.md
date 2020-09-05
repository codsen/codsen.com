---
layout: package
title: email-comb
packages:
  - html-crush
---

## Idea

**This library removes unused CSS from HTML without parsing it**

STRENGTHS:

- Aimed at Email development but works everywhere where CSS is contained within the same HTML file (no external stylesheets)
- Accepts HTML **mixed** with other templating/programming languages
- Works on broken or incomplete or invalid HTML/XHTML code
- Works on both classes and id's
- Optionally [uglifies](/os/string-uglify/) the class or id names
- The algorithm will cope with style tags inside the `body` tag or multiple style tags
- Can strip CSS and HTML comments; recognises Outlook conditional comments (both "_if-Outlook_" and "_if-not-Outlook_")
- Has email-specific features like [removing](/os/regex-empty-conditional-comments/) empty Outlook conditional comments
- Attempts to fix some code issues, for example, remove space in `< body` (which would otherwise break in Chrome)
- API contains no file I/O operations or anything front-end-related — it's "string-in, string-out"
- All dependencies are either our own or Lodash's or Mr Sindre Sorhus'
- CommonJS, ES Modules and UMD builds available, published to npm and available to consume via CDN's like [jsdelivr.com](https://cdn.jsdelivr.net/npm/email-comb/dist/email-comb.umd.js)
- Complete console logging set and retained in the source (which is automatically removed from builds)
- Modern setup: node-tap tests pointing at ES Modules build, Rollup bundling the builds, coverage high, prettier and ESLint in place
- It's not opinionated - it won't W3C-validate, enforce `DOCTYPE`'s or add any new code to your code. Some parsers, for example, just can't stand an HTML without a DOCTYPE.
- It's quite fast. We measure performance on a file with 2,000 redundant css styles and it takes less than a second.

WEAKNESSES:

- This is typical for non-parsing programs — broken code normally breaks parsers and when using parser-based programs, that's how you find out something's wrong with your code. EmailComb, being a non-parsing program, will never break! That means, you have to find other means (like _linters_) to detect, is your code broken. This might be a strength or a weakness, depends how you look at it.
- **Does not support external stylesheets** or JS injecting more classes (because it's an email development-oriented tool)

COMPETITORS:

We believe that being an **email-oriented** tool, for email templates, EmailComb is superior to all **web-development-oriented** unused CSS removal tools out there:

- [purgecss](https://github.com/FullHuman/purgecss)
- [purifycss](https://github.com/purifycss/purifycss)
- [uncss](https://github.com/uncss/uncss)

But try yourselves.

{% include "btt.njk" %}

## API

This package exports a plain object: `{ comb, defaults, version }`:

- Key `comb` has a value which is the main function, you will call that function like this: `comb()`
- Key `defaults` has a value, a plain object, which is defaults of the main function
- Key `version` is a string, for example, "2.0.12" and mirrors same key `package.json`

```js
comb(str, [options]);
```

{% include "btt.njk" %}

### API - Input

The main function `comb` which you require/import

```js
import { comb } from "email-comb";
```

takes two input arguments:

| Input argument | Type         | Obligatory? | Description                               |
| -------------- | ------------ | ----------- | ----------------------------------------- |
| str            | String       | yes         | Your HTML file contents, as string        |
| options        | Plain object | no          | Any options, as a plain object, see below |

For example,

```js
// Require it first. You get a function which you can feed with strings:
const { comb } = require("email-comb");
// Let's define a string to work upon:
const html = '<html>zzz</html><body class="class-1">zzz</body>';
// Assign a new string to the output of this library:
const { result } = comb(html, {
  whitelist: [".class-1", "#id-1", ".module-*"],
});
// Log its result:
console.log("result = " + JSON.stringify(result, null, 4));
```

{% include "btt.njk" %}

### API - Optional Options Object

Optionally, you can pass the Optional Options Object as a second argument:

| Options object's key                             | Type                                      | Default             | Example                                                        | Description                                                                                                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------- | ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whitelist`                                      | Array                                     | `[]`                | `[".class-1", "#id-1", ".module-*"]`                           | List all classes or id's you want this library to ignore. You can use all [matcher](https://www.npmjs.com/package/matcher) patterns.                                                                             |
| `backend`                                        | Array                                     | `[]`                | <code>[{ heads: "&#x7B;&#x7B;", tails: "&#x7D;&#x7D;" }, { heads: "&#x7B;%", tails: "%&#x7D;" }]</code> | If your code has back-end code within clss or id values, for example, <code>class="&#x7B;&#x7B; red &#x7D;&#x7D; main-box"</code> you can stop <code>&#x7B;&#x7B;</code>, `red` and <code>&#x7D;&#x7D;</code> to be treated as class names                                                |
| `uglify`                                         | Boolean                                   | `false`             | n/a                                                            | Will rename all class and id names to be few characters-long. This might reduce your file size by another kilobyte.                                                                                              |
| `removeHTMLComments`                             | Boolean                                   | `true`              | n/a                                                            | When enabled, all HTML comments (`<!--` to `-->`) will be removed                                                                                                                                                |
| `removeCSSComments`                              | Boolean                                   | `true`              | n/a                                                            | When enabled, all CSS comments (`/*` to `*/`) will be removed                                                                                                                                                    |
| `doNotRemoveHTMLCommentsWhoseOpeningTagContains` | Array of zero or more insensitive strings | `["[if", "[endif"]` | n/a                                                            | Email code often contains Outlook or IE conditional comments which you probably don't want to remove. Whatever strings you list here, if comment's opening tag will contain these, that tag will not be removed. |
| `reportProgressFunc`                             | Function or something falsey              | `null`              | n/a                                                            | If supplied, it will ping the function you assign passing current percentage done (natural number) as an input argument                                                                                          |
| `reportProgressFuncFrom`                         | Natural number                            | `0`                 | n/a                                                            | By default, percentages are reported from 0 to 100. This value overrides this starting percentage value.                                                                                                         |
| `reportProgressFuncTo`                           | Natural number                            | `100`               | n/a                                                            | By default, percentages are reported from 0 to 100. This value overrides this ending percentage value.                                                                                                           |

Here are all options in one place in case you need to copy the whole thing:

```js
{
  whitelist: [],
  backend: [],
  uglify: false,
  removeHTMLComments: true,
  removeCSSComments: true,
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
}
```

{% include "btt.njk" %}

### API - Output

For example, **output** could look like this:

```js
{
  log: {
    timeTakenInMiliseconds: 55,
    traversedTotalCharacters: 504,
    traversedTimesInputLength: 4.24,
    originalLength: 118,
    cleanedLength: 87,
    bytesSaved: 32,
    percentageReducedOfOriginal: 27,
    nonIndentationsWhitespaceLength: 9,
    nonIndentationsTakeUpPercentageOfOriginal: 8,
    commentsLength: 10,
    commentsTakeUpPercentageOfOriginal: 1,
  },
  result: "<html>...",
  countAfterCleaning: 3,
  countBeforeCleaning: 15,
  allInHead: allClassesAndIdsWithinHead,
  allInBody: allClassesAndIdsWithinBody,
  deletedFromHead: [".unused1", ".unused2"],
  deletedFromBody: [".unused1", ".unused1", "#unused1"],
}
```

So a **plain object** is returned. It will have the following keys:

| Key                   | Its value's type | Description                                                              |
| --------------------- | ---------------- | ------------------------------------------------------------------------ |
| `log`                 | Plain object     | Various information about performed operations                           |
| `result`              | String           | A string containing cleaned HTML                                         |
| `countBeforeCleaning` | Number           | How many unique classes and id's were in total before cleaning           |
| `countAfterCleaning`  | Number           | How many unique classes and id's were in total after cleaning            |
| `allInHead`           | Array            | Deduped and sorted array of all classes and `id`'s between `<head>` tags |
| `allInBody`           | Array            | Deduped and sorted array of all classes and `id`'s between `<body>` tags |
| `deletedFromHead`     | Array            | Array of classes/id's that were deleted inside `<head>` _at least once_^ |
| `deletedFromBody`     | Array            | Array of classes/id's that were deleted inside `<body>` _at least once_^ |

^ To be very precise, if class or id name was deleted at once, it gets in this list. Mind you, some used classes or id's can be sandwiched with unused (`.used.unused`) and end up removed in some instances and get reported here, but it does not mean they were removed completely as species.

{% include "btt.njk" %}

## `opts.whitelist`

Since the main purpose of this library is to clean **email** HTML, it needs to cater for email code specifics. One of them is that CSS styles will contain fix or hack styles, meant for email software. For example, here are few of them:

```html
#outlook a { padding:0; } .ExternalClass, .ReadMsgBody { width:100%; }
.ExternalClass, .ExternalClass div, .ExternalClass font, .ExternalClass p,
.ExternalClass span, .ExternalClass td { line-height:100%; }
```

<div class="box-tip"><strong>2020 update:</strong> <code>.ExternalClass</code> are not needed any more in email templates, see <a href="https://github.com/hteumeuleu/email-bugs/issues/4" target="_blank">https://github.com/hteumeuleu/email-bugs/issues/4</a></div>

You will not be using these classes within the `<body>` of your HTML code, so they would get removed as "unused" because they are present in `<head>` only. To avoid that, pass the classes, and `id`'s in the _whitelist_ key's value, as an array. For example:

```js
var html = "<!DOCTYPE html>...";
comb(html, {
  whitelist: ["#outlook", ".ExternalClass", ".ReadMsgBody"],
});
```

You can also use a _wildcard_, for example in order to whitelist classes `module-1`, `module-2` ... `module-99`, `module-100`, you can simply whitelist them as `module-*`:

```js
var html = "<!DOCTYPE html>...";
comb(html, {
  whitelist: [".module-*"],
});
// => all class names that begin with ".module-" will not be touched by this library.
```

{% include "btt.njk" %}

## `opts.backend`

This library, differently from competition, is aiming to support code which contains back-end code: other programming languages (Java JSP's), other templating languages (like Nunjucks) and/or proprietary ESP templating languages.

All different languages can be present in the input source, and parser won't care, EXCEPT when they are in class or id names. For example, <code><td class="mt10 &#x7B;&#x7B; module.on &#x7D;&#x7D; module-box blackbg"</code>. Notice how <code>&#x7B;&#x7B; module.on &#x7D;&#x7D;</code> sits in the middle and it's variable value from a different programming language. Eventually, it will be rendered into strings `on` or `off` but at this stage, this is raw, unrendered template and we want to remove all unused CSS from it.

It's possible to clean this too.

If you let this library know how are your back-end language's variables marked, for example, that "heads" are <code>&#x7B;&#x7B;</code> and "tails" are <code>&#x7D;&#x7D;</code> (as in <code>Hi &#x7B;&#x7B;data.firstname&#x7D;&#x7D;</code>), the algorithm will ignore all variables within `class` or `id` names.

If you don't put templating variables into classes or id's, don't use the feature because it still costs computing resources to perform those checks.

Here's an example:

{% raw %}
```js
// Require it first. You get a function which you can feed with strings.
// Notice you can name it any way you want (because in the source it's using "export default").
const { comb } = require("email-comb");

// Let's define a string equal to some processed HTML:
const res = comb(
  `<!doctype html>
<html>
<head>
<style>
.aaa {
color:  black;
}
</style></head>
<body class="{% var1 %}">
<div class="{{ var2 }}">
</div>
</body>
</html>
`,
  {
    // <------------ Optional Options Object - second input argument of our function, remove()
    backend: [
      {
        heads: "{{", // define heads and tails in pairs
        tails: "}}",
      },
      {
        heads: "{%", // second pair
        tails: "%}",
      },
    ],
  }
).result; // <------ output of this library is a plain object. String result is in a key "result". We grab it here.

// Log the result:
console.log("res =\n" + res);
// res =
// <!doctype html>
// <html>
// <head>
// </head>
// <body class="{% var1 %}">
// <div class="{{ var2 }}">
// </div>
// </body>
// </html>
//
```

In templating languages, it's also possible to have IF-ELSE clauses. For example, in Nunjucks, you can have:

```html
<td class="db{% if module_on || oodles %}on{% else %}off{% endif %} pt10"></td>
```

`db` and `pt10` are normal CSS class names, but everything else between `{%` and `%}` is Nunjucks code.

Now, in those cases, notice that Nunjucks code is only wrapping the variables. Even if you set `heads` to `{%` and tails to `%}`, classes `on` and `off` will not get ignored and theoretically can get removed!!!

The solution is to ensure that all back-end class names are contained within back-end tags. With Nunjucks, it is easily done by performing calculations outside `class=` declarations, then assigning the calculation's result to a variable and using the variable instead.

For example, let's rewrite the same snippet used above:

```html
{% set switch = 'off' %} {% if module_on || oodles %} {% set switch = 'on' %} {%
else %}
<td class="db {{ switch }} pt10"></td>
```

Now, set `heads` to <code>&#x7B;&#x7B;</code> and tails to <code>&#x7D;&#x7D;</code> and `switch` will be ignored completely.

{% endraw %}

{% include "btt.njk" %}

## Tapping the stream in Gulp

In Gulp, everything flows as vinyl Buffer streams. You could [tap](https://github.com/geejs/gulp-tap) the stream, convert it to `string`, perform the operations (like remove unused CSS), then convert it back to Buffer and place the stream back. We wanted to come up with a visual analogy example using waste pipes but thought we'd rather won't.

Code-wise, here's the idea:

```js
const tap = require("gulp-tap");
const { comb } = require("email-comb");
const util = require("gulp-util");
const whitelist = [
  ".External*",
  ".ReadMsgBody",
  ".yshortcuts",
  ".Mso*",
  "#outlook",
  ".module*",
];

gulp.task("build", () => {
  return gulp.src("emails/*.html").pipe(
    tap((file) => {
      const cleanedHtmlResult = comb(file.contents.toString(), {
        whitelist,
      });
      util.log(
        util.colors.green(
          `\nremoved ${
            cleanedHtmlResult.deletedFromHead.length
          } from head: ${cleanedHtmlResult.deletedFromHead.join(" ")}`
        )
      );
      util.log(
        util.colors.green(
          `\nremoved ${
            cleanedHtmlResult.deletedFromBody.length
          } from body: ${cleanedHtmlResult.deletedFromBody.join(" ")}`
        )
      );
      file.contents = Buffer.from(cleanedHtmlResult.result);
    })
  );
});
```

{% include "btt.njk" %}

## Extreme example of unused CSS

This piece of HTML doesn't even have `<head>` and `<style>` CSS is at the very bottom, within `<body>`. Our application still cleans it allright:

```html
<html>
  <body id="unused-1">
    <table class="unused-2 unused-3">
      <tr>
        <td class="unused-4 unused-5">text</td>
      </tr>
    </table>

    <style>
      .unused-6 {
        display: block;
      }
      #unused-7 {
        height: auto;
      }
    </style>
  </body>
</html>
```

Cleaned result:

```html
<html>
  <body>
    <table>
      <tr>
        <td>text</td>
      </tr>
    </table>
  </body>
</html>
```

{% include "btt.njk" %}

## Removing unused CSS from web pages

This library is meant to be used on any HTML where there are **no external CSS stylesheets**. It's quite rare to find a **web page** which would not have any external stylesheets.

{% include "btt.njk" %}

## Processing campaigns' HTML

Email templates, the HTML files, are coded in two stages: 1) design file to static HTML; 2) static HTML to "campaign" - HTML with all templating.

For example, <code>Price is &#x7B;% if data.purchasePrice > 100 %&#x7D;...&#x7B;% endif %&#x7D;</code> is HTML mixed with Nunjucks/Jinja - that _greater-than_ bracket is not an HTML bracket.

`email-comb` will work fine on both static HTML or wired up campaign HTML. As a non-parsing tool, it skips the code it "doesn't understand".

{% include "btt.njk" %}
