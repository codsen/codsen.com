---
layout: package
title: json-comb-core
---

## Idea

Imagine, you have a set of JSON files. `json-comb-core` helps to maintain and manage it:

**Normalise those JSON files:**

- Each object should have the same key set - missing keys should be added to each object.
- If an object has nested array, and there are plain objects within, each of those objects should have the same key set as its siblings within the same array.
- For the sake of completeness, let's sort each resulting object's keys too.

For that, we'll need tools to [extract](#getkeyset) a keyset and to [enforce](#enforcekeyset) it.

**Alert when JSON's have unique keys**

It's when we can't/won't normalise files, yet we need some insurance. It would be nice to get an [alert](#nonewkeys) if our objects contain unique keys that none of the other objects has.

**Find unused keys in a set of JSONs**

A set of JSON files might be normalised, but certain keys can have placeholder values on every single JSON. That means the particular key is [unused](#findunused) and probably can be deleted.

{% include "btt.njk" %}

## `getKeyset()`

**getKeyset(input, [opts])**

This function produces a reference object according to which you can normalise JSON files.

It consumes an array of promises, where each promise should resolve into a plain object. Once first promises start to resolve, it coalesces them one-by-one into a "schema object".

Technically speaking, a "schema keyset" is a superset of all objects. Two rules:

1.  Each object of the same level between different JSON files should have same keys.
2.  If an array has objects, those objects should have the same keys. If the array is a value and it is missing in a certain JSON, it gets filled with only one object.

The merging is done on a premise to retain [as much information](https://github.com/codsen/object-merge-advanced) after merging as possible.

{% include "btt.njk" %}

### API - input

| Input argument | Type                                                 | Obligatory? | Description                                                                           |
| -------------- | ---------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `input`        | Array of promises, each resolving into plain objects | yes         | Each plain object would usually be a promise of one JSON file's contents.             |
| `options`      | Object                                               | no          | An Optional Options Object, being synchronous (not a promise). See below for its API. |

PS. The input is normal, a synchronous array full of promises. Not a promise of an array which contains promises.

| Optional Options Object's key | Type | Default | Description                                                                                                                                                                                                                                                    |
| ----------------------------- | ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`                 | Any  | `false` | All Reference Object's key values are set to be placeholders. This way we a) minimise the footprint; and b) make it easy later to fill the missing values — value from Reference can be written straight as it is because it's already equal to a placeholder. |

{% include "btt.njk" %}

### API - output

A promise of a plain object, which can be used in `enforceKeyset()` (and `enforceKeysetSync()` if you really want to suddenly switch to async).

{% include "btt.njk" %}

## `getKeysetSync()`

**getKeysetSync(input, [opts])**

Synchronous version of [`getKeyset()`](#getkeyset).

{% include "btt.njk" %}

### API - input

| Input argument | Type                   | Obligatory? | Description                                                  |
| -------------- | ---------------------- | ----------- | ------------------------------------------------------------ |
| `input`        | Array of plain objects | yes         | Each plain object would usually be one JSON file's contents. |
| `options`      | Object                 | no          | An Optional Options Object. See below for its API.           |

| Optional Options Object's key | Type | Default | Description                                                                                                                                                                                                                                                    |
| ----------------------------- | ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`                 | Any  | `false` | All Reference Object's key values are set to be placeholders. This way we a) minimise the footprint; and b) make it easy later to fill the missing values — value from Reference can be written straight as it is because it's already equal to a placeholder. |

{% include "btt.njk" %}

### API - output

A plain object, which can be used in [`enforceKeyset()`](#enforcekeyset) or sync [`enforceKeysetSync()`](#enforcekeysetsync).

## `enforceKeyset()`

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### API - input

| Input argument            | Type   | Obligatory? | Description                                    |
| ------------------------- | ------ | ----------- | ---------------------------------------------- |
| `input`                   | Object | yes         | What should we normalise?                      |
| `schema`                  | Object | yes         | According to what schema should we normalise?  |
| `Optional Options Object` | Object | no          | An Optional Options Object. See its API below. |

Optional Options Object's API is the same as asyc version's of this method, [`enforceKeysetSync()`](#enforcekeysetsync).

| Optional Options Object's key                  | Type                          | Default | Description                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`    | Some paths don't necessarily have to be normalised. Sometimes you want certain top-level keys to be falsy when they are unused. In such cases, put all such paths here. Notation is same as [object-path](https://www.npmjs.com/package/object-path).   |
| `placeholder`                                  | Boolean                       | `false` | What value are you using as a placeholder for missing values? Default is `false` because it's falsy.                                                                                                                                                    |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`  | Sometimes you want to turn off certain areas of the template, but defaults kick in and defuse your "false". In those cases, you an ultimate "false" - `null`. When this mode is on, `null` will kill any incoming value and result will resolve to `null`. |

{% include "btt.njk" %}

### API - output

A clone of an input object, with the same key set as the `schema` object.

{% include "btt.njk" %}

## `enforceKeysetSync()`

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### API - input

| Input argument            | Type   | Obligatory? | Description                                    |
| ------------------------- | ------ | ----------- | ---------------------------------------------- |
| `input`                   | Object | yes         | What should we normalise?                      |
| `schema`                  | Object | yes         | According to what schema should we normalise?  |
| `Optional Options Object` | Object | no          | An Optional Options Object. See its API below. |

Optional Options Object's API is the same as asyc version's of this method, [`enforceKeyset()`](#enforcekeyset).

| Optional Options Object's key                  | Type                          | Default | Description                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`    | Some paths don't necessarily have to be normalised. Sometimes you want certain top-level keys to be falsy when they are unused. In such cases, put all such paths here. Notation is same as [object-path](https://www.npmjs.com/package/object-path).   |
| `placeholder`                                  | Boolean                       | `false` | What value are you using as a placeholder for missing values? Default is `false` because it's falsy.                                                                                                                                                    |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`  | Sometimes you want to turn off certain areas of the template, but defaults kick in and defuse your "false". In those cases, you an ultimate "false" - `null`. When this mode is on, `null` will kill any incoming value and result will resolve to null. |

{% include "btt.njk" %}

### API - output

A clone of an input object, with the same key set as the `schema` object.

## `noNewKeysSync()`

Reads an array and a reference keyset object, returns an array of zero or more keys that are in the array, but not in keyset.

Practically this is handy to tame the JSON's that we don't/can't normalise. At least we can ensure there are no new keys. For example, all data mapping files could be validated through `noNewKeysSync()`.

{% include "btt.njk" %}

### API - input

| Input argument | Type   | Obligatory? | Description                                   |
| -------------- | ------ | ----------- | --------------------------------------------- |
| `input`        | Object | yes         | What should we check?                         |
| `schema`       | Object | yes         | According to what schema should we normalise? |

{% include "btt.njk" %}

### API - output

An array of zero or more paths.

{% include "btt.njk" %}

## `findUnusedSync()`

Reads a set of objects (array of plain objects, probably parsed JSON files) and tells, are there any keys throughout the whole set that has only the placeholder values. You can customise the placeholder value via an optional options object.

Practically it is useful to identify unused keys to reduce the JSON data file size. Also, it can help to identify misspelt keys.

{% include "btt.njk" %}

### API - input

| Input argument | Type                                | Obligatory? | Description                 |
| -------------- | ----------------------------------- | ----------- | --------------------------- |
| `input`        | Array of zero or more plain objects | yes         | Array of parsed JSON files. |
| `options`      | Object                              | no          | Options object. See below.  |

| `options` object's key | Type                                                                   | Obligatory? | Default       | Description                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `placeholder`          | any                                                                    | no          | `false`       | What value is being used to mark unused key?                                                                                                                 |
| `comments`             | string (to mark "turned on") or anything falsy (to mark "turned off") | no          | `__comment__` | If any key name in JSON contains this piece of string, it will not be reported as unused (even if it was unused). Set it to any falsy value to turn it off. |

{% include "btt.njk" %}

### API - output

An array of zero or more paths leading to keys which are either missing or have values equal to `opts.placeholder`.

{% include "btt.njk" %}

## `sortAllObjectsSync()`

This method sorts objects (no matter how deeply-nested), and it will sort objects within arrays within objects and so on. For example, you can input an array which has some plain objects within, and those objects will be sorted.

This method does not mutate the input and is fine if you pass _any_ JS type (`array`, `string`, `null` etc.).

{% include "btt.njk" %}

### API - input

| Input argument | Type     | Obligatory? | Description                                                                                                                                                                |
| -------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | Whatever | no          | If it's a plain object or it contains some plain objects, a copy of it will be created with all its plain objects sorted. Otherwise, the untouched input will be returned. |

{% include "btt.njk" %}

### API - output

If the input is **a plain object or array** containing some plain objects within, an output is a copy of the input with all plain objects sorted.
If the input is **something else**, an output is the same thing as input.

{% include "btt.njk" %}

## Difference between Normalising JSON and real JSON Schemas

In simple terms, a _JSON Schema_ is a description of all keys and their value types. We're concerned, do all the values have the same types as values in a schema. We're not particularly concerned about the **existence** of the keys; we're more concerned does what we've got match the schema.

When you choose to separate email content from templates, content is put into JSON files. When you add a new field in one file, you want that field added on all other files. Same way, if a field has a placeholder (normally a Boolean value `false`) on every file, you want to be informed about that. Maybe that key/value pair is unused across all JSON files. You are not concerned very much what _type_ the particular value is in your JSON - normally they're `string`, `number` or `Boolean` anyway - you're more concerned about the **consistence** of the set of your JSON files.

So, normalisation is a process of making a bunch of JSON files to have the same keys. JSON Schema is a description of all keys and their value types within a JSON.

When performing a normalisation, all JSON files are read, and internally a schema is created, so algorithm knows what keys are missing on a particular file of a set of JSON's. However, that schema is concerned only about keys - its values are set to a placeholder.

{% include "btt.njk" %}
