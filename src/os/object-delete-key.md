---
layout: package
title: object-delete-key
---

## Deleting

Three modes:

- Delete all `key`/`value` pairs found in any nested plain objects where `key` equals `value`.
- Delete all `key`/`value` pairs found in any nested plain objects where `key` is equal to a certain thing. `value` doesn't matter.
- Delete all `key`/`value` pairs found in any nested plain objects where `value` is equal to a certain thing. `key` doesn't matter.

This library accepts anything as input, including [parsed](/os/codsen-parser/) HTML, which is _deeply_ nested arrays of plain objects, arrays and strings. You can feed anything as input into this library - if it's traversable, it will be traversed and searched for your `key` and/or `value` in any plain objects.

If you want to delete any nested objects that contain certain `key`/`value` pair(s), check out [ast-delete-object](/os/ast-delete-object/).

{% include "btt.njk" %}

## API

**{{ packageJsons["object-delete-key"].lect.req }}(input, options)**

In other words, it's a function which takes two input arguments, both obligatory.

The input arguments are not mutated; this package clones them first before using.

{% include "btt.njk" %}

### API - Input

| Input argument | Type     | Obligatory? | Description                                                     |
| -------------- | -------- | ----------- | --------------------------------------------------------------- |
| `input`        | Whatever | yes         | AST tree, or object or array or whatever. Can be deeply-nested. |
| `options`      | Object   | yes         | Options object. See its key arrangement below.                  |

| `options` object's key | Type     | Obligatory? | Default | Description                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | -------- | ----------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                  | String   | no^         | n/a     | Key to find and delete.                                                                                                                                                                                                                                                                                                                |
| `val`                  | Whatever | no^         | n/a     | Key's value to find and delete. Can be a massively nested AST tree or whatever.                                                                                                                                                                                                                                                        |
| `cleanup`              | Boolean  | no          | true    | Should this package delete any empty carcases of arrays/objects left after deletion?                                                                                                                                                                                                                                                   |
| `only`                 | String   | no          | `any`   | Default setting will delete from both arrays and objects. If you want to delete from plain objects only, set this to one of "object-type" values below. If you want to delete keys from arrays only, set this to one of "array-type" values below. In this case "key" means array element's value and "value" is not meant to be used. |

^ - at least one, `key` or `val` must be present.

{% include "btt.njk" %}

#### Accepted `opts.only` values

| Interpreted as "array-type" | Interpreted as "object-type" | Interpreted as "any" type |
| --------------------------- | ---------------------------- | ------------------------- |
| `array`                     | `object`                     | `any`                     |
| `arrays`                    | `objects`                    | `all`                     |
| `arr`                       | `obj`                        | `everything`              |
| `aray`                      | `ob`                         | `both`                    |
| `arr`                       | `o`                          | `either`                  |
| `a`                         |                              | `each`                    |
| <br/>                       |                              | `whatever`                |
| <br/>                       |                              | `e`                       |

If `opts.only` is set to any string longer than zero characters and is **not** case-insensitively equal to one of the above, the `object-delete-key` will **throw an error**.

We want to relieve users from having to check the documentation for `opts.only` values.

{% include "btt.njk" %}

### API - Output

This library returns the `input` with all requested keys/value pairs removed.

{% include "btt.njk" %}
