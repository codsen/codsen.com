---
title: Why `object-path` package is great
date: '2020-09-16'
image: "006"
packages:
  - object-path
tags:
  - api
  - js
---

[`object-path`](https://www.npmjs.com/package/object-path) is a getter/setter for nested arrays and plain objects. Here we use it directly and also align our API's to it. Here's why.

---

**First reason**, it allows to get or set values by path, no matter how deep and no matter if any levels of the destination path are missing.

Before [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), if we tried to access non-existing keys in an object, deeper than one absent level, an error would be thrown:

```js
const { strict } = require("assert");
const assert = strict;
const objectPath = require("object-path");

// in vanilla JS, we can address first level missing keys:
const testObj = {a: "b"};
const extracted1 = testObj.x;
assert.equal(extracted1, undefined);

// but not the second:
assert.throws(() => {
    const extracted2 = testObj.x.y;
}, TypeError);

// with object-path, it's fine:
const extracted3 = objectPath.get(testObj, "x.y");
assert.equal(extracted3, undefined);

// optional chaining is substitute for .get:
const extracted4 = testObj.x?.y;
assert.equal(extracted4, undefined);
```

While [Optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) can substitute the `object-path` method `.get`, other methods, such as `.delete` or `.has` don't have a native JS equivalent.

That's the **second reason** — `object-path` does what native JS solutions can't do.

But that was plain objects. The fun part is _arrays_.

When we deal with _arrays_, `object-path` keeps the **same notation** as it did for plain objects:

```js
const { strict } = require("assert");
const assert = strict;
const objectPath = require("object-path");

const testObj = {a: ["foo", "bar"]};

// get "bar" in vanilla JS:
const extracted1 = testObj.a[1];
assert.equal(extracted1, "bar");

// get "bar" using object-path:
const extracted2 = objectPath.get(testObj, "a.1"); // <--- notice it's a.1
assert.equal(extracted2, "bar");
```

This way of addressing array keys using dot, like `a.1`, instead of brackets `a[1]` is a different paradigm!

For example,

```js
const { strict } = require("assert");
const assert = strict;
const objectPath = require("object-path");

// in theory, object keys can be number strings too:
const testObj = {"0": ["foo"]};

// let's query the "foo" using vanilla JS:
assert.equal(testObj["0"][0], "foo");

// let's query the "foo" using object-path:
assert.equal(objectPath.get(testObj, "0.0"), "foo");
```

The advantage of dot notation (`a.1`) is that we can use `Array.prototype.join()` to programmatically assemble the path: `["a", "1"].join(".")`.

Getting `a[1]` in vanilla JS bracket notation is not that easy.

The **third reason** — both object and array paths being joined with dot simplify the path assembly operations.

As a result, quite few of our packages use `object-path` "dot" notation:

{{ packageJsons | allPackagesThatUseDepX("object-path") }}
