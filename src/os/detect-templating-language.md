---
layout: package
title: detect-templating-language
packages:
  - regex-is-jsp
  - regex-is-jinja-nunjucks
  - stristri
---

## Supported templating languages:

- Nunjucks/Jinja/Liquid family
- JSP (Java Server Pages)
## API

::: api
detectLang(str)
:::

In other words, it's a function which takes a string and returns a plain object.

## API - Output

A plain object is returned, for example,

```js
{ 
  name: "Nunjucks" 
}
```

If templating language is not detected, `null` is set:

```js
{ 
  name: null
}
```