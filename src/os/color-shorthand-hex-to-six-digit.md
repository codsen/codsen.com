---
layout: package
title: color-shorthand-hex-to-six-digit
---

## Purpose

Email newsletters use a lot of styling using HTML attributes, for example, `<td bgcolor='#cccccc'>`. As you know, there is alternative way to write color codes in HEX — [shorthand](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form), for example, `<td bgcolor='#ccc'>`.

Certain contemporary email consumption software doesn't accept shorthand hex colour codes, what means you have to ensure all your email templates use **only full-length colour codes**. Some tooling libraries that work with SASS shorten the colour hex codes, and that's a best practice for web development, but not for email. We need a tool/library which could convert any shorthand hex codes from any input (array, plain object or string) into full notation.

This library takes any input: **array** (of strings, plain objects, other arrays or nested combination thereof), **plain object** (containing anything in values, including nested plain objects, arrays or strings) or **string**. Once received, it traverses the input and converts all found shorthand hex colour codes (#abc) into full-length (#aabbcc).

Additionally, all letters in all hex codes are converted to lowercase.

{% include "btt.njk" %}

## Examples

```js
const conv = require("color-shorthand-hex-to-six-digit");

// converts shorthand hex color codes within strings:
conv("aaaa #f0c zzzz\n\t\t\t#fc0");
// => 'aaaa #ff00cc zzzz\n\t\t\t#ffcc00'

// converts shorthand hex colour codes within plain objects:
conv({
  a: "#ffcc00",
  b: "#f0c",
  c: "text",
});
// => {
//   a: '#ffcc00',
//   b: '#ff00cc',
//   c: 'text'
// }

// converts shorthand hex colour codes within arrays:
conv(["#fc0", "#f0c", "text", ""]);
// => [
//   '#ffcc00', '#ff00cc', 'text', ''
// ]

// converts shorthand hex colour codes within nested spaghetti's:
conv([[[[[[{ x: ["#fc0"] }]]]]], { z: "#f0c" }, ["text"], { y: "" }]);
// => [
//   [[[[[{x: ['#ffcc00']}]]]]], {z: '#ff00cc'}, ['text'], {y: ''}
// ]

// in all other cases it silently returns the input:
conv(null);
// => null
```

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

## API

The one and only input argument can be anything: string, plain object, nested array of whatever; you name it.
If input is not workable, for example, it's a function; it's simply returned intact.
This way, this library acts like a safety valve that acts when wrong hex codes pass through it, converting them.

PS. Input argument (in case of plain objects and arrays) is not mutated in any way. This package will clone the input and work on its copy. This is important. No ~~teenage turtle~~ mutations here.

{% include "btt.njk" %}

## Reliability

I'm using only the best ingredients, namely [hex-color-regex](https://www.npmjs.com/package/hex-color-regex) by [@tunnckocore](https://www.npmjs.com/~tunnckocore) and standalone Lodash functions (`_.clonedeep`, `_.isplainobject` and `_.isstring`). This library is being currently used in commercial projects.

{% include "btt.njk" %}
