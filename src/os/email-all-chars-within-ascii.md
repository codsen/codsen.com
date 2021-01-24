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

Also, we want an error reported if any lines exceed the recommended line length in email, 500 characters-per-line.

{% include "btt.njk" %}

## The API

:::api
within(str, [opts])
:::

In other words, it's a function, second input argument is optional (marked by brackets).

Input:

- the first argument - string only or program will `throw`.
- the second argument - a plain object. Anything else, if truthy, will `throw`.

{% include "btt.njk" %}

## API - Options:

| `options` object's key | Type    | Obligatory? | Default | Description                                                                                                                                                                                                                    |
| ---------------------- | ------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `lineLength`          | number | no          | `500` | Allowed max line length allowed. Set to `0` to disable. |

Here are all defaults in one place:

```js
{
  lineLength: 500,
}
```

{% include "btt.njk" %}
