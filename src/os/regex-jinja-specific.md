---
layout: package
title: regex-jinja-specific
packages:
  - detect-templating-language
  - stristri
---

## Purpose

Nunjucks and Jinja templating languages' syntax is mostly the same. There are certain code patterns which are Jinja-specific, mostly coming from Python functionality. This program, a regex, matches those patterns.

- Namespaces

  `{% set x = namespace(blablabla) %}`

- Backwards pattern

  `{{'oodles' if crambles else 'brambles'}}`

- Python digit formatting

  `'%.2f'|format(...`

Often Python-specific features can be patched to make code render in Nunjucks. 

This is not a definite detection tool but rather a minimal, fun attempt to programmatically distinguish between the two languages.

## API

::: api
{{ packageJsons["regex-jinja-specific"].lect.req }}()
:::

In other words, it's a function which returns a RegExp object.
