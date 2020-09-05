---
layout: package
title: string-unfancy
packages:
  - detergent
  - html-img-alt
---

## Idea

This library converts fancy strings like curly apostrophes into not fancy ones, like a single quote. One could say it's the opposite of [Detergent](/os/detergent/).

`string-unfancy` main purpose is to simplify the images `alt` attribute content in email templates.

The list of covered characters includes all kinds of single quotes, double quotes, dashes and the non-breaking space.

Also, this library will recursively decode any HTML entities before performing the replacement.

PS. If you want a higher-level tool, [html-img-alt](/os/html-img-alt/) uses `string-unfancy` and performs many more fixes (adding empty `alt` attributes if they are missing, cleaning of the whitespace between the attributes, trimming of the `alt` contents and even replacing single quotes to double quotes).

{% include "btt.njk" %}

## Usage

```js
const unfancy = require("string-unfancy");
const res = unfancy("someone’s");
console.log("res = " + JSON.stringify(res1, null, 4));
// => "someone's"

// works with encoded HTML:
const res2 = unfancy("someone&rsquo;s");
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => "someone's"
```

{% include "btt.njk" %}

## API

API is simple: `string` in, `string` out.

Caveat: if the input is not a `string` it will `throw`.

## Example - treating the image alt attributes - Gulp and stream-tapping

If you are using Gulp to build email templates, you can `tap` the stream, apply a function to it, then within that function, [replace](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) all instances of `alt="..."` with their unfancied versions.

First, you need to `require` [gulp-tap](https://www.npmjs.com/package/gulp-tap) and [string-unfancy](/os/string-unfancy/):

```js
const tap = require("gulp-tap");
const unfancy = require("string-unfancy");
```

Then, tap your main build task's stream, probably towards the end of the pipeline:

```js
...
.pipe(tap((file) => {
  file.contents = Buffer.from(unfancy(file.contents.toString()))
}))
.pipe(gulp.dest('dist')) // that's the final write happening, yours might be different
...
```

Then, declare a function somewhere within your `gulpfile.js`:

```js
function unfancy(input) {
  input = input.replace(/alt="[^"]*"/g, (el) => {
    return unfancy(el);
  });
  return input;
}
```

As you see above, we're running an [inline function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/replace) upon all regex-matched characters.

And that's it! All image `alt` attributes will lose their HTML encoding and will have their fancy special characters converted to simple ASCII letter equivalents.

{% include "btt.njk" %}

## Can we use `lodash.deburr` instead?

No. It [won't even convert](https://runkit.com/embed/2oy0v80zzfsw) a single m-dash! It's a different tool for a different purpose.
