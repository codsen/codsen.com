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

For that, we'll need tools to [extract](#getkeyset) a keyset and [enforce](#enforcekeyset) it.

**Alert when JSON's have unique keys**

It's when we can't/won't normalise files, yet we need some insurance. It would be nice to get an [alert](#nonewkeys) if our objects contain unique keys that none of the other objects has.

**Find unused keys in a set of JSONs**

A set of JSON files might be normalised, but certain keys can have placeholder values on every single JSON. That means the particular key is [unused](#findunused) and probably can be deleted.

{% include "btt.njk" %}

## `getKeyset()`

**getKeyset(input, \[opts])**

This function produces a reference object according to which you can normalise JSON files.

It consumes an array of promises, where each promise should resolve into a plain object. Once first promises start to resolve, it coalesces them one-by-one into a "schema object".

Technically speaking, a "schema keyset" is a superset of all objects. Two rules:

1.  Each object of the same level between different JSON files should have same keys.
2.  If an array has objects, those objects should have the same keys. If the array is a value and it is missing in a certain JSON, it gets filled with only one object.

The merging is done on a premise to retain [as much information](https://github.com/codsen/object-merge-advanced) after merging as possible.

{% include "btt.njk" %}

### input

| Input argument | Type                                                 | Obligatory? | Description                                                                           |
| -------------- | ---------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| `input`        | Array of promises, each resolving into plain objects | yes         | Each plain object would usually be a promise of one JSON file's contents.             |
| `options`      | Object                                               | no          | An Optional Options Object, being synchronous (not a promise). See below for its API. |

PS. The input is normal, a synchronous array full of promises. Not a promise of an array which contains promises.

| Optional Options Object's key | Type | Default | Description                                                                                                                                                                                                                                                    |
| ----------------------------- | ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`                 | Any  | `false` | All Reference Object's key values are set to be placeholders. This way we a) minimise the footprint; and b) make it easy later to fill the missing values — value from Reference can be written straight as it is because it's already equal to a placeholder. |

{% include "btt.njk" %}

### output

A promise of a plain object, which can be used in `enforceKeyset()` (and `enforceKeysetSync()` if you really want to suddenly switch to async).

### example

```js
// turn array of plain objects into array of promises of thereof
const source = [
  {
    a: 'a',
    b: 'c',
    c: {
      d: 'd',
      e: 'e',
    },
  },
  {
    a: 'a',
  },
  {
    c: {
      f: 'f',
    },
  },
].map(el => Promise.resolve(el))
// use async/await to avoid using .then
async test1 () => {
  const res = await getKeyset(source)
  console.log(`res = ${JSON.stringify(res, null, 4)}`)
}
// call the function:
test1()

// result:
// {
//   a: false,
//   b: false,
//   c: {
//     d: false,
//     e: false,
//     f: false,
//   },
// }
```

{% include "btt.njk" %}

## `getKeysetSync()`

**getKeyset(input, \[opts])**

This function produces a reference object according to which you can normalise JSON files.

It consumes an array of plain objects (parsed JSON files) and extracts a "schema keyset", a plain object from them.

Technically speaking, a "schema keyset" is a superset of all objects. Two rules:

1.  Each object of the same level between different JSON files should have same keys.
2.  If an array has objects, those objects should have the same keys. If the array is a value and it is missing in a certain JSON, it gets filled with only one object.

The merging is done on a premise to retain [as much information](https://github.com/codsen/object-merge-advanced) after merging as possible.

{% include "btt.njk" %}

### input

| Input argument | Type                   | Obligatory? | Description                                                  |
| -------------- | ---------------------- | ----------- | ------------------------------------------------------------ |
| `input`        | Array of plain objects | yes         | Each plain object would usually be one JSON file's contents. |
| `options`      | Object                 | no          | An Optional Options Object. See below for its API.           |

| Optional Options Object's key | Type | Default | Description                                                                                                                                                                                                                                                    |
| ----------------------------- | ---- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`                 | Any  | `false` | All Reference Object's key values are set to be placeholders. This way we a) minimise the footprint; and b) make it easy later to fill the missing values — value from Reference can be written straight as it is because it's already equal to a placeholder. |

{% include "btt.njk" %}

### output

A plain object, which can be used in `enforceKeyset()`. See below.

### example

For example, keeping placeholder the default:

```js
const { getKeyset } = require("json-comb-core");
let schema = getKeyset([
  {
    // <- object #1
    a: "a",
    b: "c",
    c: {
      d: "d",
      e: "e",
    },
  },
  {
    // <- object #2
    a: "a",
  },
  {
    // <- object #3
    c: {
      f: "f",
    },
  },
]);
console.log("schema = " + JSON.stringify(schema, null, 4));
// => {
//      a: false,
//      b: false,
//      c: {
//        d: false,
//        e: false,
//        f: false
//      }
//    }
```

Customising the placeholder:

```js
const { getKeyset } = require("json-comb-core");
let schema = getKeyset(
  [
    {
      // <- object #1
      a: "a",
      b: "c",
      c: {
        d: "d",
        e: "e",
      },
    },
    {
      // <- object #2
      a: "a",
    },
    {
      // <- object #3
      c: {
        f: "f",
      },
    },
  ],
  { placeholder: "" }
);
console.log("schema = " + JSON.stringify(schema, null, 4));
// => {
//      a: '',
//      b: '',
//      c: {
//        d: '',
//        e: '',
//        f: ''
//      }
//    }
```

{% include "btt.njk" %}

## `enforceKeyset()`

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### input

| Input argument            | Type   | Obligatory? | Description                                    |
| ------------------------- | ------ | ----------- | ---------------------------------------------- |
| `input`                   | Object | yes         | What should we normalise?                      |
| `schema`                  | Object | yes         | According to what schema should we normalise?  |
| `Optional Options Object` | Object | no          | An Optional Options Object. See its API below. |

Optional Options Object's API is the same as asyc version's of this method, [`enforceKeysetSync()`](#enforcekeysetsync).

| Optional Options Object's key                  | Type                          | Default | Description                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`    | Some paths don't necessarily have to be normalised. Sometimes you want certain top-level keys to be falsey when they are unused. In such cases, put all such paths here. Notation is same as [object-path](https://www.npmjs.com/package/object-path).   |
| `placeholder`                                  | Boolean                       | `false` | What value are you using as a placeholder for missing values? Default is `false` because it's falsey.                                                                                                                                                    |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`  | Sometimes you want to turn off certain areas of the template, but defaults kick in and defuse your "false". In those cases, you an ultimate "false" - `null`. When this mode is on, `null` will kill any incoming value and result will resolve to `null`. |

{% include "btt.njk" %}

### output

A clone of an input object, with the same key set as the `schema` object.

### example

```js
// let's create three plain objects, each somewhat overlapping with others:
const obj1 = {
  b: [
    {
      c: "ccc",
      d: "ddd",
    },
  ],
  a: "aaa",
};
const obj2 = {
  a: "ccc",
  e: "eee",
};
const obj3 = {
  a: "zzz",
};
// calculate the schema:
const schema = await getKeyset([obj1, obj2, obj3]);
// log the schema:
console.log(`schema = ${JSON.stringify(schema, null, 4)}`);
// => {
//      a: false,
//      b: [
//        {
//          c: false,
//          d: false,
//        },
//      ],
//      e: false,
//    }

const obj1Normalised = await enforceKeyset(obj1, schema);
console.log(`obj1Normalised = ${JSON.stringify(obj1Normalised, null, 4)}`);
// => {
//      a: 'aaa',
//      b: [
//        {
//          c: 'ccc',
//          d: 'ddd',
//        },
//      ],
//      e: false, // <------ new key added
//    }

const obj2Normalised = await enforceKeyset(obj2, schema);
console.log(`obj2Normalised = ${JSON.stringify(obj2Normalised, null, 4)}`);
// => {
//      a: 'ccc',
//      b: [ // <------- new key added
//        {
//          c: false,
//          d: false,
//        },
//      ],
//      e: 'eee',
//    }

const obj3Normalised = await enforceKeyset(obj3, schema);
console.log(`obj3Normalised = ${JSON.stringify(obj3Normalised, null, 4)}`);
// => {
//      a: 'zzz',
//      b: [ // <------- new key added
//        {
//          c: false,
//          d: false,
//        },
//      ],
//      e: false, // <------- new key added
//    }
```

{% include "btt.njk" %}

## `enforceKeysetSync()`

Reads an input plain object and a keyset schema object and normalises the input plain object, adding any missing keys.

### input

| Input argument            | Type   | Obligatory? | Description                                    |
| ------------------------- | ------ | ----------- | ---------------------------------------------- |
| `input`                   | Object | yes         | What should we normalise?                      |
| `schema`                  | Object | yes         | According to what schema should we normalise?  |
| `Optional Options Object` | Object | no          | An Optional Options Object. See its API below. |

Optional Options Object's API is the same as asyc version's of this method, [`enforceKeyset()`](#enforcekeyset).

| Optional Options Object's key                  | Type                          | Default | Description                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`    | Some paths don't necessarily have to be normalised. Sometimes you want certain top-level keys to be falsey when they are unused. In such cases, put all such paths here. Notation is same as [object-path](https://www.npmjs.com/package/object-path).   |
| `placeholder`                                  | Boolean                       | `false` | What value are you using as a placeholder for missing values? Default is `false` because it's falsey.                                                                                                                                                    |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`  | Sometimes you want to turn off certain areas of the template, but defaults kick in and defuse your "false". In those cases, you an ultimate "false" - `null`. When this mode is on, `null` will kill any incoming value and result will resolve to null. |

{% include "btt.njk" %}

### output

A clone of an input object, with the same key set as the `schema` object.

### example

```js
const { getKeyset } = require("json-comb-core");
const { enforceKeyset } = require("json-comb-core");
let inputObj = {
  a: "ccc",
};
let anotherObj = {
  a: "aaa",
  b: "bbb",
};
let schema = getKeyset([inputObj, anotherObj]); // <= notice both are fed via an array

inputObj = enforceKeyset(inputObj, schema);
console.log("inputObj = " + JSON.stringify(inputObj, null, 4));
// => {
//      a: 'ccc',
//      b: false
//    }
```

{% include "btt.njk" %}

## `noNewKeys()`

Reads an array and a reference keyset object, returns an array of zero or more keys that are in the array, but not in keyset.

Practically this is handy to tame the JSON's that we don't/can't normalise. At least we can ensure there are no new keys. For example, all data mapping files could be validated through `noNewKeys()`.

{% include "btt.njk" %}

### input

| Input argument | Type   | Obligatory? | Description                                   |
| -------------- | ------ | ----------- | --------------------------------------------- |
| `input`        | Object | yes         | What should we check?                         |
| `schema`       | Object | yes         | According to what schema should we normalise? |

{% include "btt.njk" %}

### output

An array of zero or more paths.

### example

We are going to catch the rogue key `b`:

```js
const { noNewKeys } = require("json-comb-core");
let res = noNewKeys(
  {
    // <- input we're checking
    a: "a",
    b: "b",
    c: "c",
  },
  {
    // <- reference keyset
    a: "aaa",
    c: "ccc",
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['b']
```

More advanced example:

```js
const { noNewKeys } = require("json-comb-core");
let res = noNewKeys(
  {
    // <- input we're checking
    z: [
      {
        a: "a",
        b: "b",
        c: "c",
      },
      {
        a: false,
        b: false,
        c: "c",
      },
    ],
  },
  {
    // <- reference keyset
    z: [
      {
        a: "a",
        b: "b",
      },
      {
        a: false,
        b: false,
      },
    ],
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['z[0].c', 'z[1].c']
```

{% include "btt.njk" %}

## `findUnused()`

Reads a set of objects (array of plain objects, probably parsed JSON files) and tells, are there any keys throughout the whole set that has only the placeholder values. You can customise the placeholder value via an optional options object.

Practically it is useful to identify unused keys to reduce the JSON data file size. Also, it can help to identify misspelt keys.

{% include "btt.njk" %}

### input

| Input argument | Type                                | Obligatory? | Description                 |
| -------------- | ----------------------------------- | ----------- | --------------------------- |
| `input`        | Array of zero or more plain objects | yes         | Array of parsed JSON files. |
| `options`      | Object                              | no          | Options object. See below.  |

| `options` object's key | Type                                                                   | Obligatory? | Default       | Description                                                                                                                                                  |
| ---------------------- | ---------------------------------------------------------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `placeholder`          | any                                                                    | no          | `false`       | What value is being used to mark unused key?                                                                                                                 |
| `comments`             | string (to mark "turned on") or anything falsey (to mark "turned off") | no          | `__comment__` | If any key name in JSON contains this piece of string, it will not be reported as unused (even if it was unused). Set it to any falsey value to turn it off. |

{% include "btt.njk" %}

### output

An array of zero or more paths leading to keys which are either missing or have values equal to `opts.placeholder`.

### example

```js
const { findUnused } = require("json-comb-core");
let res = findUnused([
  {
    // <- object #1
    a: false,
    b: "bbb1",
    c: false,
  },
  {
    // <- object #2
    a: "aaa",
    b: "bbb2",
    c: false,
  },
  {}, // <- object #3
]);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['c']
```

This function will work on arrays of both normalised and not normalised object sets.

More complex example:

```js
const { findUnused } = require("json-comb-core");
let res = findUnused([
  {
    a: [
      {
        k: false,
        l: false,
        m: false,
      },
      {
        k: "k",
        l: false,
        m: "m",
      },
    ],
    b: "bbb1",
    c: false,
  },
  {
    a: [
      {
        k: "k",
        l: false,
        m: "m",
      },
      {
        k: "k",
        l: false,
        m: "m",
      },
    ],
    b: "bbb2",
    c: false,
  },
  { b: false },
  { c: false },
]);
console.log("res = " + JSON.stringify(res, null, 4));
// => ['c', 'a[0].l']
```

{% include "btt.njk" %}

## `sortAllObjects()`

This method sorts objects (no matter how deeply-nested), and it will sort objects within arrays within objects and so on. For example, you can input an array which has some plain objects within, and those objects will be sorted.

This method does not mutate the input and is fine if you pass _any_ JS type (`array`, `string`, `null` etc.).

{% include "btt.njk" %}

### input

| Input argument | Type     | Obligatory? | Description                                                                                                                                                                |
| -------------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`        | Whatever | no          | If it's a plain object or it contains some plain objects, a copy of it will be created with all its plain objects sorted. Otherwise, the untouched input will be returned. |

{% include "btt.njk" %}

### output

If the input is **a plain object or array** containing some plain objects within, an output is a copy of the input with all plain objects sorted.
If the input is **something else**, an output is the same thing as input.

{% include "btt.njk" %}

### example

```js
const { sortAllObjects } = require("json-comb-core");
let res = sortAllObjects({
  a: "a",
  c: "c",
  b: "b",
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'a',
//      b: 'b',
//      c: 'c'
//    }
```

{% include "btt.njk" %}

## Difference between Normalising JSON and real JSON Schemas

In simple terms, a _JSON Schema_ is a description of all keys and their value types. We're concerned, do all the values have the same types as values in a schema. We're not particularly concerned about the **existence** of the keys; we're more concerned does what we've got match the schema.

When you choose to separate email content from templates, content is put into JSON files. When you add a new field in one file, you want that field added on all other files. Same way, if a field has a placeholder (normally a Boolean value `false`) on every file, you want to be informed about that. Maybe that key/value pair is unused across all JSON files. You are not concerned very much what _type_ the particular value is in your JSON - normally they're `string`, `number` or `Boolean` anyway - you're more concerned about the **consistence** of the set of your JSON files.

So, normalisation is a process of making a bunch of JSON files to have the same keys. JSON Schema is a description of all keys and their value types within a JSON.

When performing a normalisation, all JSON files are read, and internally a schema is created, so algorithm knows what keys are missing on a particular file of a set of JSON's. However, that schema is concerned only about keys - its values are set to a placeholder.

{% include "btt.njk" %}
