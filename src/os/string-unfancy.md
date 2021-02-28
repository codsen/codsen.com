---
layout: package
title: string-unfancy
packages:
  - detergent
  - html-img-alt
---

## Idea

Convert [typographically-correct](https://practicaltypography.com/what-is-good-typography.html) characters (like [curly quotes](https://practicaltypography.com/straight-and-curly-quotes.html) or [m-dashes](https://practicaltypography.com/hyphens-and-dashes.html)) to their basic counterparts (like apostrophes or hyphens).

It's the opposite of [`detergent`](/os/detergent/) and [`string-apostrophes`](/os/string-apostrophes/).

It's used in ASCII-restricted places where encoding is too unwieldy, for example, image `alt` attribute values in email templates. Or stripping down the formatted markdown value, removing backticks and so on.

{% include "btt.njk" %}

## API

::: api
unfancy(str)
:::

Caveat: if the input is not a `string` it will `throw`.

Function returns a string.

## Example - Gulp streams

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
