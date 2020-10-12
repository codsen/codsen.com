---
layout: package
title: color-shorthand-hex-to-six-digit
---

## Purpose

It's a best practice to avoid [shorthand](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form) color codes in email, for example, `<td bgcolor='#ccc'>`. This program converts three-digit hex color codes inside any data structures (strings, objects or arrays), for example `<td bgcolor='#cccccc'>`

{% include "btt.njk" %}

## API

::: api
{{ packageJsons["color-shorthand-hex-to-six-digit"].lect.req }}(something)
:::

- Input: anything
- Output: same thing as input, only with hex codes converted

If input is string, a converted string will be returned.
If input is array or a plain object, hex codes will be converted from within too.
If input is unsuitable: _falsy_ things, functions etc. — input will be returned as is.

This program never throws an error, it's meant to be used as a by-pass function.

{% include "btt.njk" %}

## Usage in Gulp environment

You don't need a Gulp plugin; you can simply use this library whenever you get in control of the final stream, or especially, SCSS variables.

For example, tap the `color-shorthand-hex-to-six-digit` right after importing the SCSS variables. We hope you are not misbehaving and all your colour variables are in one place only, as variables.

```js
// import SCSS variables from file (modules/src/scss/_variables.scss)

// native Node function to help with paths:
const path = require("path");
// convert variables SCSS file to .JSON:
const scssToJson = require("scss-to-json");
// lodash:
const _ = require("lodash");
// ...

function getScssVars() {
  var sassFilePath = path.resolve(
    __dirname,
    "modules/src/scss/_variables.scss"
  );
  var tempSassVars = scssToJson(sassFilePath);
  sassVars = _.mapKeys(tempSassVars, function (value, key) {
    return key.slice(1);
  });
  // convert all bad hex codes:
  sassVars = convShorthand(sassVars);
  // console.log('sassVars = ' + JSON.stringify(sassVars, null, 4))
}
```

We coded the `color-shorthand-hex-to-six-digit` to be recursive, that is, you can pass any nested objects/arrays/strings, no matter how deep-nested or tangled - all 3-character hex codes will be converted within the input.

If there is nothing to fix, `color-shorthand-hex-to-six-digit` behaves well, returning whatever was given, so feel free to assign your sources to the output of `color-shorthand-hex-to-six-digit`.

{% include "btt.njk" %}
