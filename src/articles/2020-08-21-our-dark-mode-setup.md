---
title: Our Dark Mode Setup
date: '2020-08-21'
image: "003"
packages:
  - lect
  - string-extract-sass-vars
tags:
  - eleventy
  - meta
  - css
---

Conceptually, dark/light mode on a website is driven by the buttons on the UI: whichever mode user picks, a `data-theme` attribute with that value gets set on `<html>` tag. We also persist that to browser's local storage.

_Automatic_ mode setting "listens" to system's setting via `@media (prefers-color-scheme: dark)`. _Manual dark/light_ modes' CSS "listens" to `<html>` tag attribute's value by `:root[data-theme='dark']`.

That's pretty much it.

Here is the mixin we use.

---

<div class="box-tip">

In these days, PostCSS plugins can substitute SASS. Dropping SASS simplifies the tooling: there's one part _less_ in the setup (pun intended). We use `postcss-comment`, `postcss-import`, `postcss-mixins`, `postcss-simple-vars` to process all mixins and variables.

</div>

PostCSS mixin:

```css
@mixin darkTheme {
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme='light']) & {
      @content;
    }
  }
  :root[data-theme='dark'] & {
    @content;
  }
}
```

Use it like that:

```css
/* color constants (could be native CSS variables too) */
$emphasisGrey: #949494;
$textDark: #807e79;

...

h3 {
  color: $emphasisGrey;
  @include darkTheme {
    color: $textDark;
  }
}
```

All three modes: auto, light and dark, are tackled with this simple `mixin' — only one nested clause `@include darkTheme {...}` is all it takes to define an alternative, dark styling.

A useful reference is [this article](https://equinusocio.dev/blog/making-dark-theme-switcher-with-postcss/) — although here we don't use native CSS variables, the gist is the same and instructions explain the theme-switching pretty thoroughly.

## For and against CSS custom variables

The CSS custom properties/variables have their use; they can be an exquisite solution when the design is simple, and sets of colours can be swapped.

Here are the arguments **against** native CSS variables (`--main-bg-color`), in favor of SASS-style variables (`$main-bg-color`):

- We wrote [a parser](/os/string-extract-sass-vars/) to ingest CSS/SASS variables into Nunjucks global scope, to allow us to use CSS vars inline, in HTML. Switching to CSS custom properties `--main-bg-color: brown;` will require another program/parser...
- SASS-style dollar notation is six characters less to type, `$zzz` instead of `var(--zzz)`.
- Not very relevant, but CSS variables are not supported 100% — IE will need extra measures, for example. On the other hand, PostCSS variables will be rendered into classic CSS and supported 100%.
- In _Web development_ land, it's a decision to make but in _Email development_ land, one [can't use](https://www.caniemail.com/features/css-variables/) CSS variables at all while PostCSS/SASS is readily at hand and available.

<div class="box-tip">

Back in the day, data was often put onto `<body>` and using `class` attributes rather than more semantic `data-*` attribute. That's a bad habit, don't fear to put `data-` attributes onto `<html>` tags.

</html>
