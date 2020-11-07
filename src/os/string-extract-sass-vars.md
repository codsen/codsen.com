---
layout: package
title: string-extract-sass-vars
packages:
  - detergent
---

## API

:::api
extractVars(str, [opts])
:::

In other words, it is a function which takes two input arguments, a string and an optional options object (above, those square brackets mean "optional").

### API - Input

| Input argument          | Type         | Obligatory? | Description       |
| ----------------------- | ------------ | ----------- | ----------------- |
| str                     | String       | yes         | String to process |
| optional options object | Plain object | no          | See below         |

For example, a typical input for this program:

```scss
$red: #ff6565;
$blue: #08f0fd;
```

{% include "btt.njk" %}

### Options Object, `opts`

| Options Object's key | The type of its value | Default | Obligatory? | Description                                                                                                   |
| -------------------- | --------------------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `throwIfEmpty`       | Boolean               | `false` | no          | For extra insurance, you can set this program to throw if it didn't extract any keys. Not enabled by default. |
| `cb`                 | Function              | `null`  | no          | Put a function here to process each value.                                                                    |

Here are all defaults in one place:

```js
{
  throwIfEmpty: false,
  cb: null,
}
```

{% include "btt.njk" %}

### API - Output

Returns **a plain object** of zero or more SASS file's key-value pairs.

For example, a typical output of this program:

```js
{
  red: "#ff6565",
  blue: "#08f0fd"
}
```

## `opts.throwIfEmpty`

In production, you have many things to worry about. Imagine something went wrong with your SCSS variables file - or it was mangled - or something else went wrong - this program would find no variables and would yield an empty plain object. But you would not notice.

If you know that there will always be at least one key in the extracted source — set `opts.throwIfEmpty` — it will throw an error instead of silently yielding an empty plain object.

By default, this option is disabled.

{% include "btt.njk" %}

## `opts.cb`

Think of it as a middleware — if you pass a function, then before placing the extracted value into a result object, this program will feed that value into your function and use function's result instead.

This gives opportunities to process the values, for example, [turning](/os/color-shorthand-hex-to-six-digit/) 3-digit hex colour numbers into email-friendly 6-digit:

## What this program doesn't do

This program is a quick parser for variables files or simple key-value pair SASS style content. It's not a fully-fledged SASS code parser.

Please, no fancy bits:

- No nesting
- No partials
- No modules
- Mixins
- No extend/inheritance
- No operators

{% include "btt.njk" %}

## Why do you need this

Sometimes we want to use CSS variables in the inline HTML styles. For example, `<span style="color: {{ textGrey }};"></span>`.

It depends on what templating engine you use, but in case of [Nunjucks](https://mozilla.github.io/nunjucks/), we need to load the variable `textGrey` into Nunjucks global [Environment](https://mozilla.github.io/nunjucks/api.html#environment).

In Gulp (or Eleventy or other script which runs everything) you use Node `fs.readFileSync` to read the PostCSS/SASS variables file, containing line `$textGrey: #ccc;`. Then you feed that outout into this program which parses and extracts a plain object: `{ textGrey: "#ccc" }`. Then you load it into Nunjucks global Environment.

After that, `<span style="color: {{ textGrey }};"></span>` is rendered into `<span style="color: #ccc;"></span>`.

Conceptually, global variables in HTML and CSS allow us to DRY the code — there's single source of truth for constants. In React component-based web development Storybook-documented colour constants is a similar thing.

And global variables are not just for HTML inline CSS use:

1. You can put Nunjucks globals into SASS variables file - your CSS won't use them but all global constants will be in one place: both CSS and Nunjucks.
2. Template's logic can use SASS variables file values in calculations (imagine, column count).

{% include "btt.njk" %}
