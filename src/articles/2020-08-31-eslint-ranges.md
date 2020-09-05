---
title: ESLint Uses Similar Thing to Ranges
date: '2020-08-31'
image: "005"
packages:
  - eslint
  - ranges-apply
  - ranges-push
tags:
  - ranges
  - linting
---

We noticed [ESLint](https://github.com/eslint/eslint) also uses (some sort of) [_Ranges_](/ranges/).

---

If you check the ESLint API, the [`verify()`](https://eslint.org/docs/developer-guide/nodejs-api#linterverify) will return a `range` key:

```js
{
  fatal: false,
  ruleId: "semi",
  severity: 2,
  line: 1,
  column: 23,
  message: "Expected a semicolon.",
  fix: {
    range: [1, 15], // <---- this
    text: ";"
  }
}
```

The string indexes are the same — they are also placed in an array — the only difference is ESLint explicitly tells what to insert using a separate key.

If [ESLint](https://eslint.org/) marked a finding like this:

```js
{
  range: [1, 15],
  text: ";"
}
```

[Ranges](/ranges/) would mark it shorter:

```js
[
  [1, 15, ";"]
]
```

Very similar!
