---
layout: package
title: email-all-chars-within-ascii
---

## Idea

Traverse the string and check if all characters are suitable for 7bit encoding, in other words, are within the basic ASCII range, first 126 characters, and does not include any invisible control characters.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

- HT, horizontal tab, decimal number 9
- LF, new line, decimal number 10
- CR, carriage return, decimal number 13

Often decimal point 127, DEL, is overlooked, yet it is not right in your templates, especially email.

In that sense, [non-ascii regex](https://github.com/sindresorhus/non-ascii/) and the likes are dangerous to validate your email template code because they are too lax.

Also, we want an error `throw`n if any lines exceed the permitted length, 1000 characters. Our algorithm will `throw` earlier, at more than `997` consecutive non-CR/non-LR characters because line lengths count `CRLR` in the end (which is two extra characters, and we don't want to reach 1000).

{% include "btt.njk" %}

## The API

**within(str\[, opts])**

In other words, it's a function, second input argument is optional (marked by brackets).

Input:

- the first argument - string only or program will `throw`.
- the second argument - optional options object. Anything else than `undefined`, `null` or a plain object will `throw`.

Input string will be traversed, and if/when the first unacceptable character is encountered, an error will be thrown.

Options object is sanitised by [check-types-mini](/os/check-types-mini/) which will `throw` if you set options' keys to wrong types or add unrecognised keys. You'll thank me later.

Here are all defaults in one place:

```js
{
  messageOnly: false,
  checkLineLength: true,
}
```

{% include "btt.njk" %}

## API - Options:

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                    |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `messageOnly`          | Boolean | no          | `false` | Should we not append `email-all-chars-within-ascii:` in front of each error message? Set to `true` to turn it off, like in [CLI app](/os/email-all-chars-within-ascii-cli/). |
| `checkLineLength`      | Boolean | no          | `true`  | Throws if line length between any `CR` or `LR` characters is more than `997`. It's because [spec](https://tools.ietf.org/html/rfc821) says "The maximum total length of a text line including `<CRLF>` is 1000 characters".    |

{% include "btt.njk" %}

## Usage

```js
const within = require("email-all-chars-within-ascii");
let res1 = within("<html><head>zzzz</head><body>blablabla</body></html>");
// => does not throw, that's good.

let res2 = within("Ą");
// => throws an error because "Ą" is not within allowed ASCII range.
```

{% include "btt.njk" %}

## Practical use

We're going to use this library to validate our email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](/os/detergent/) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, what encoding it is using to deploy emails: 7bit, 8bit, quoted-printable or base64, also, does the back-end validate and encode the unacceptable characters for you. However, we're going to prepare for the worst and deliver all my templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. It's 126, not 127 because 127 is "invisible" DEL character which is not acceptable in templates.

Check out [CLI](/os/email-all-chars-within-ascii-cli/) version which you can install globally and use in your terminal.

{% include "btt.njk" %}
