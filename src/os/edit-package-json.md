---
layout: package
title: edit-package-json
packages:
  - object-path
---

## Purpose

Edit JSON contents as strings to guarantee the formatting will be intact.

API uses [object-path](https://www.npmjs.com/package/object-path) notation to set values on any (for now, only already-existing) paths in JSON.

It's powering the [`update-versions`](/os/update-versions/) CLI.

{% include "btt.njk" %}

## API

There are two methods: `set()` and `del()`:

### .set()

**set(source, path, val)**

| Input argument | Type     | Obligatory? | Description                                                                                                            |
| -------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `str`          | String   | yes         | JSON file contents                                                                                                     |
| `path`         | String   | yes         | Desired **EXISTING** path in the object, must follow [object-path](https://www.npmjs.com/package/object-path) notation |
| `valToInsert`  | Whatever | yes         | What to insert at the given path                                                                                       |

::: beware
You can't create new paths, only amend existing-ones.
:::

**Output**

An amended string is returned.

To repeat, `set()` can't create new paths yet, it's still in a _baby_ state. `set()` can only edit existing paths in JSON.

{% include "btt.njk" %}

### .del()

**del(source, path)**

| Input argument | Type   | Obligatory? | Description                                                                                                         |
| -------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------- |
| `str`          | String | yes         | JSON file contents                                                                                                  |
| `path`         | String | yes         | Desired path in the object to delete, must follow [object-path](https://www.npmjs.com/package/object-path) notation |

**Output**

An amended string is returned.

{% include "btt.njk" %}

## Testing

Besides regular unit tests, we went great lengths to ensure this program works as intended. We took all {{ compiledAssertionCounts.totalPackageCount }} `package.json`'s in this monorepo, then took every single leaf path in every package.json and amended and deleted it two ways:

- editing it directly, using this program, string-in, string-out
- editing using [`object-path`](https://www.npmjs.com/package/object-path), plain-object-in, plain-object-out, then stringify

Every single path edit matched! By the way, we ended up with {{ compiledAssertionCounts.all['edit-package-json'] | thousandSeparator }} asserts.

See the source of the [test file](https://git.sr.ht/~royston/codsen/tree/master/packages/edit-package-json/test/synthetic-test.js).

{% include "btt.njk" %}
