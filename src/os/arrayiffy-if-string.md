---
layout: package
title: arrayiffy-if-string
---

## Idea

- If it's a non-empty string, put it into an array and return it.
- If it's empty string, return an empty array.
- If it's anything else, just return it.

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("aaa");
console.log("res = " + JSON.stringify(res, null, 4));
// => ['aaa']
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy("");
console.log("res = " + JSON.stringify(res, null, 4));
// => []
```

```js
const arrayiffy = require("arrayiffy-if-string");
var res = arrayiffy(true);
console.log("res = " + JSON.stringify(res, null, 4));
// => true
```

It's main purpose is to prepare the input argument options' objects. Check out [`check-types-mini`](/os/check-types-mini).

{% include "btt.njk" %}
