---
layout: package
title: edit-package-json
---

## Idea

Plain objects in JavaScript somewhat retain their key order after parsing but it's easy to mess up the key order.

There are programs out there (like [format-package](https://www.npmjs.com/package/format-package)) which sort `package.json`.

This program is an attempt to edit JSON without parsing it, to edit it as a string.

API uses [object-path](https://www.npmjs.com/package/object-path) notation to set values on any (for now, only already-existing) paths in JSON.

```js
const { set, del } = require("edit-package-json");
// we defined JSON contents manually, but in real programs you'd read the file,
// as string, without parsing and pass it to set()
const source = `{
  "a": "b",
  "c": {
    "d": "e"
  }
}`;

// amended result:
const result = set(source, "c.d", "f");
// notation is the same as "object-path" from npm
// ^ in real programs you'd write this string back to JSON file

console.log(JSON.stringify(result, null, 4));
// => {
//   "a": "b",
//   "c": {
//     "d": "f"
//   }
// }
```

We wrote quite a few non-parsing string-processing programs ([1](/os/string-strip-html/), [2](/os/email-comb/), [3](/os/html-crush/), [4](/os/html-img-alt/), [5](/os/emlint/) for starters) so you could see it coming. We needed bullet-proof way to edit `package.json` in [`update-versions`](/os/update-versions/).

{% include "btt.njk" %}

## API

There are two methods: `set()` and `del()`:

### .set()

When you consume `set` (`const { set, del } = require("edit-package-json");`), it is a _function_.

`set()` can set values by path, on a JSON string.

**THIS IS AN EARLY STAGE OF THIS PROGRAM AND IT CAN'T CREATE NEW KEYS, IT WILL ONLY CHANGE/DELETE VALUE IF KEY ALREADY EXISTS.**

For now, this is the primary difference (from a more mature and more popular) `object-path`.

**Input**

**set(source, path, val)**

| Input argument | Type     | Obligatory? | Description                                                                                                            |
| -------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `str`          | String   | yes         | JSON file contents                                                                                                     |
| `path`         | String   | yes         | Desired **EXISTING** path in the object, must follow [object-path](https://www.npmjs.com/package/object-path) notation |
| `valToInsert`  | Whatever | yes         | What to insert at the given path                                                                                       |

**Output**

Amended string is returned.

To repeat again, `set()` can't create new paths yet, it's still in baby state. `set()` can only edit existing paths in JSON.

{% include "btt.njk" %}

### .del()

Put the a JSON string and a path into `del`, [object-path](https://www.npmjs.com/package/object-path)-style.

For example,

```js
const { set, del } = require("edit-package-json");
// we defined JSON contents manually, but in real programs you'd read the file,
// as string, without parsing and pass it to set()
const source = `{
  "a": "b",
  "c": "d"
}`;

// amended result:
const result = del(source, "c");

console.log(JSON.stringify(result, null, 4));
// => {
//    "a": "b"
//    }
```

**Input**

**del(source, path)**

| Input argument | Type   | Obligatory? | Description                                                                                                         |
| -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `str`          | String | yes         | JSON file contents                                                                                                  |
| `path`         | String | yes         | Desired path in the object to delete, must follow [object-path](https://www.npmjs.com/package/object-path) notation |

**Output**

Amended string is returned.

{% include "btt.njk" %}
