---
layout: package
title: gulp-email-remove-unused-css
packages:
  - email-comb
  - html-crush
  - detergent
  - emlint
---

## Example

```js
var gulp = require("gulp");
var remove = require("gulp-email-remove-unused-css");

gulp.task("default", function () {
  return gulp
    .src("src/*.html")
    .pipe(
      remove({
        whitelist: [
          ".ExternalClass",
          ".ReadMsgBody",
          ".yshortcuts",
          ".Mso*",
          ".maxwidth-apple-mail-fix",
          "#outlook",
          ".module-*",
        ],
      })
    )
    .pipe(gulp.dest("./dist"));
});
```

{% include "btt.njk" %}

### Options

Since the main purpose of this library is to clean **email** HTML, it needs to cater for email code specifics. One of them is that CSS styles will contain fix or hack styles, meant for email software. For example, here are few of them:

```html
#outlook a { padding:0; } .ExternalClass, .ReadMsgBody { width:100%; }
.ExternalClass, .ExternalClass div, .ExternalClass font, .ExternalClass p,
.ExternalClass span, .ExternalClass td { line-height:100%; }
```

Obviously, you will not be using the above classes and id's in the `<body>` of your HTML code, what means they would get removed — they are present in `<head>` only. To avoid that, pass the classes and id's in the _whitelist_ key's value, as an array, for example:

```js
.pipe(remove({
  whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook']
}))
```

You can also use a _glob_, for example in order to whitelist classes `module-1`, `module-2` ... `module-99`, `module-100`, you can simply whitelist them as `module-*`:

```js
.pipe(remove({
  whitelist: ['.ExternalClass', '.ReadMsgBody', '.yshortcuts', '.Mso*', '.maxwidth-apple-mail-fix', '#outlook', '.module-*']
}))
// => all class names that begin with ".module-" will not be touched by this library.
```

{% include "btt.njk" %}

## Next level

If you start to overgrow the plugin's baby shirt and want to work with HTML directly, as string, stop using this library and use the [`email-comb`](/os/email-comb/), the API of this Gulp plugin directly.

The idea is the following: in Gulp, everything flows as a vinyl Buffer streams. You [tap](https://github.com/geejs/gulp-tap) the stream, convert it to `string`, perform the operations, then convert it back to Buffer and place it back. We wanted to come up with a visual analogy example using waste pipes but thought we'd rather won't.

Code-wise, here's the idea:

```js
const tap = require('gulp-tap')
const { comb } = require('email-comb')
const util = require('gulp-util')
const whitelist = ['.External*', '.ReadMsgBody', '.yshortcuts', '.Mso*', '#outlook', '.module*']

gulp.task('build', () => {
  return gulp.src('emails/*.html')
    .pipe(tap((file) => {
      const cleanedHtmlResult = comb(file.contents.toString(), { whitelist })
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromHead.length} from head: ${cleanedHtmlResult.deletedFromHead.join(' ')}`))
      util.log(util.colors.green(`\nremoved ${cleanedHtmlResult.deletedFromBody.length} from body: ${cleanedHtmlResult.deletedFromBody.join(' ')}`))
      file.contents = Buffer.from(cleanedHtmlResult.result)
}))
```

There are many benefits for tapping npm packages directly, without gulp plugins:

- You can add more functions, wrap them over `comb()` and Buffer-String-Buffer conversion will happen only once. If each of those functions was a Gulp plugin and did their Buffer-String-Buffer conversions that would be less efficient. Yes, all packages should be in streams but it adds complexity.
- Gulp plugins can only be same or worse maintained than their API packages which drive them. Often it's the latter case.
- Gulp plugins might be misconfigured and fail — even though the API package will work fine. Bigger surface to test, maintain and report bugs is worse than just one npm package.

{% include "btt.njk" %}

## Regarding removing unused CSS from web pages & competition

This library is meant to be used on any HTML where there are **no external stylesheets** and there are no JavaScript which could add or remove classes or id's dynamically. It's quite rare to find a **web page** that would be like that, but it's the case for all **email newsletters** and this library is aimed at cleaning email HTML code. If your website's HTML is like that, this library will work perfectly fine on it as well. Email HTML and website HTML are both the same markup language.

If you need more advanced CSS removal tools, check out [uncss](https://github.com/giakki/uncss) and [gulp-uncss](https://github.com/ben-eb/gulp-uncss) which runs a headless browser and are capable to parse external stylesheets. However, it's by magnitude slower and it's definitely an overkill for email HTML code.

There's also more direct competitor, [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) which uses [Cheerio](https://www.npmjs.com/package/cheerio), but:

1. `postcss-remove-unused` is tied with PostCSS and can't be used outside of it. Its _testing_ is also tied to PostCSS and dependent on it. On other hand, _this library_ is only a Gulp wrapper for [email-comb](/os/email-comb/) which is tool-independent (reads `string`, outputs `string`). Core functionality should be decoupled from the wrappers, PostHTML, PostCSS, Gulp, Grunt, font-end interfaces or anything else. In the past we decoupled [Detergent's core](/os/detergent/) from its [front-end](https://detergent.io).

2. [postcss-remove-unused](https://www.npmjs.com/package/postcss-remove-unused) doesn't remove `id`'s, while this library _does_. It's important because some of _email code hacks_ are based on id's, for example, `#outlook a {padding: 0; }` which causes "View in browser" toolbar menu link to appear on Outlook 2010. Style cleaning library must recognise id's in order to white-list them.

{% include "btt.njk" %}
