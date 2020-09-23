---
layout: package
title: string-remove-duplicate-heads-tails
packages:
  - detergent
---

## The Purpose

{% raw %}

Let's say, you know that variables are wrapped with _heads_, for example, `{{` and _tails_, `}}`.

For example:

```js
"Hi {{ first_name }}!"
```

This library detects and deletes redundant heads and tails wrapped around the **whole** input string:

```js
"{{ Hi {{ first_name }}! }}" => "Hi {{ first_name }}!"
```

But it's also smart and detects **legit** heads and tails at the edges of string:

:exclamation: `{{ first_name }} {{ last_name }}` is not turned into `first_name }} {{ last_name`.

That's what this library is mainly about — being able to detect, are outer heads and tails currently wrapping **a single chunk** of text, or are those heads and tails from **separate chunks**.

Also, this lib removes the leading/trailing empty clumps of empty heads/tails, with or without empty space:

```js
// without whitespace:
`{{}}{{}} {{}}{{}} {{}}{{}} a {{}}{{}}` => `a`
// with whitespace:
`{{   \n   }}   \t   a   \n\n {{ \n\n \n\n   }}   \t\t` => `a`
```

You can configure `heads` and `tails` to be whatever you like, single string or array of them. Also, the length of the different heads in your given set can be different.

{% endraw %}
{% include "btt.njk" %}

## API

```js
removeDuplicateHeadsTails(str, [opts]);
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

If input string is not given, it will `throw`.

{% include "btt.njk" %}

### An Optional Options Object

| Optional Options Object's key | Type of its value                                                  | Default  | Description                                                             |
| ----------------------------- | ------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| `heads`                       | Non-empty **string** or **array** of one or more non-empty strings | `['{{']` | Put here the way you mark the beginnings of your variables in a string. |
| `tails`                       | Non-empty **string** or **array** of one or more non-empty strings | `['}}']` | Put here the way you mark the endings of your variables in a string.    |

These double curlies are default for [Nunjucks](https://mozilla.github.io/nunjucks/)/Jinja and many other templating languages. Nunjucks is my favourite.

{% include "btt.njk" %}

### API - Output

Returns a string
