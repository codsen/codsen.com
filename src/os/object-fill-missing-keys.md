---
layout: package
title: object-fill-missing-keys
---

## Purpose

This library fills missing keys in a plain object according to a supplied reference object. It is driving the [json-comb-core](/os/json-comb-core/) method `enforceKeyset()`.

{% include "btt.njk" %}

## API

:::api
fillMissingKeys(
  incompleteObj, 
  schemaObj, 
  [opts]
)
:::

In other words, it's a function which takes three input arguments, third one being optional (marked by square brackets).

Input arguments are not mutated, inputs are cloned before being used. That's important.

{% include "btt.njk" %}

### API - Input

| Input argument  | Type         | Obligatory? | Description                                                                                   |
| --------------- | ------------ | ----------- | --------------------------------------------------------------------------------------------- |
| `incompleteObj` | Plain object | yes         | Plain object. Can have nested values.                                                         |
| `schemaObj`     | Plain object | yes         | Schema object which contains a desired set of values. Can be nested or hold arrays of things. |
| `opts`          | Plain object | no          | Optional Options Object, see below for its API                                                |

{% include "btt.njk" %}

### An Optional Options Object

| options object's key                           | Type of its value             | Default         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------- | ----------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placeholder`                                  | Anything                      | Boolean `false` | Used only in combination with `doNotFillThesePathsIfTheyContainPlaceholders` as a means to compare do all children keys contain placeholder values. It won't patch up your reference schema objects (for performance reasons). Always make sure your reference schema object has all values [set](/os/object-set-all-values-to/) to be a desired `placeholder` (default placeholder is usually Boolean `false`). |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`            | Handy to activate this for ad-hoc keys in data structures to limit the data bloat.                                                                                                                                                                                                                                                                                                                                                                                |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`          | When filling the keys, when this setting is on if there is existing key with `null` value it won't get the value assigned to anything, even if the reference object would otherwise set it to a nested something. Under bonnet it's setting same-named options key for [object-merge-advanced](/os/object-merge-advanced/).                                                                                      |

{% include "btt.njk" %}

### `opts.doNotFillThesePathsIfTheyContainPlaceholders`

This setting is handy to limit the lengths of your JSON files. Sometimes, you have some ad-hoc keys that are either very large nested trees of values AND/OR they are rarely used. In those cases, you want to manually trigger the normalisation of that key.

It's done this way.

Find out the path of the key you want to limit normalising on. Path notation is following the one used in [object-path](https://www.npmjs.com/package/object-path): if it's object, put the key name, if it's array, put that element's ID. For example: `orders.latest.0.first_name` would be:

```
{
  orders: {
    latest: [ // <---- notice it's a nested array within a plain object
      {
        first_name: "Bob", // <------ this key is `orders.latest.0.first_name`
        last_name: "Smith"
      },
      {
        first_name: "John",
        last_name: "Doe"
      }
    ]
  }
}
```

Put the path you want to skip normalising into `opts.doNotFillThesePathsIfTheyContainPlaceholders` array. For example:

```js
const res = fillMissingKeys(
  {
    // <---- input
    a: {
      b: false, // <---- we don't want to automatically normalise this key
      x: "x",
    },
    z: "z",
  },
  {
    // <---- reference schema object
    a: {
      b: {
        c: false,
        d: false,
      },
      x: false,
    },
    z: false,
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: false, // <---------------- observe, the keys were not added because it had a placeholder
//     x: 'x',
//   },
//   z: 'z',
// }
```

To trigger normalisation on an ignored path, you have to set the value on that path to be _falsy_, but not a placeholder. If you are using default placeholder, `false`, just set the value in the path as `true`. If you're using a custom placeholder, different as `false`, set it to `false`. The normalisation will see not a placeholder and will start by comparing/filling in missing branches in your object.

For example, we want to fill the value for `a.b.c`, but we are not sure what's the data structure. We _want_ a placeholder to be set during normalisation under path `a.b`. We set `a.b` to `true`:

```js
const res = fillMissingKeys(
  {
    a: {
      b: true, // <-- not placeholder but lower in data hierarchy (boolean)
      x: "x",
    },
    z: "z",
  },
  {
    a: {
      b: {
        c: false,
        d: false,
      },
      x: false,
    },
    z: false,
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: {
//       c: false, // <---- values added!
//       d: false, // <---- values added!
//     },
//     x: 'x',
//   },
//   z: 'z',
// }
```

If any of the branches in given `doNotFillThesePathsIfTheyContainPlaceholders` paths contain only placeholders **and are normalised**, they will be **truncated** (set to a placeholder you provide in the opts, or if you don't supply one, set to a default `false`):

```js
const res = fillMissingKeys(
  {
    // <--- input object
    a: {
      b: {
        // <--- this object in "b"'s value will be removed and set to placeholder "false"
        c: false,
        d: false,
      },
      x: {
        // <--- this too
        y: false,
      },
    },
    z: "z",
  },
  {
    // <--- schema object
    a: {
      b: {
        c: false,
        d: false,
      },
      x: false,
    },
    z: false,
  },
  {
    // <--- settings
    doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"],
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: false,
//     x: false,
//   },
//   z: 'z',
// }
```

{% include "btt.njk" %}

### `opts.useNullAsExplicitFalse`

By default, if a value is `null`, this means it's an explicit `false`, which is used to completely diffuse any incoming "truthy" values. It's an ultimate "falsy" value.

For example:

```js
const res2 = fillMissingKeys(
  {
    // <--- object we're working on
    a: null,
  },
  {
    // <--- reference schema
    a: ["z"],
  },
  {
    // <--- options
    useNullAsExplicitFalse: true,
  }
);
console.log(
  `${`\u001b[${33}m${`res2`}\u001b[${39}m`} = ${JSON.stringify(res2, null, 4)}`
);
// => {
//      a: null,
//    }
```

But if you turn it off, usual [rules of merging](/os/object-merge-advanced/) apply and null, being towards the bottom of the value priority scale, gets trumped by nearly every other type of value (not to mention a non-empty array `['z']` in an example below):

```js
const res1 = fillMissingKeys(
  {
    // <--- object we're working on
    a: null,
  },
  {
    // <--- reference schema
    a: ["z"],
  },
  {
    // <--- options
    useNullAsExplicitFalse: false,
  }
);
console.log(
  `${`\u001b[${33}m${`res1`}\u001b[${39}m`} = ${JSON.stringify(res1, null, 4)}`
);
// => {
//      a: ['z'],
//    }
```

{% include "btt.njk" %}

## How this works

This library performs the key creation part in the JSON files' _normalisation_ operation. JSON file normalisation is making a set of JSON files to have the same key set.

**Here's how it slots in the normalisation process:**

First, you take two or more plain objects, normally originating from JSON files' contents.

Then, you [calculate the _schema reference_](/os/json-comb-core#getkeysetsync/) out of them. It's a superset object of all possible keys used across the objects (your JSON files).

Finally, you go through your plain objects second time, one-by-one and [fill missing keys](/os/json-comb-core/) using **this library**. It takes the plain object and your generated _schema reference_ (and optionally a custom placeholder if you don't like Boolean `false`) and creates missing keys/arrays in that plain object.

Alternatively, you can use this library just to add missing keys. Mind you, for performance reasons; schema is expected to have all key _values_ equal to placeholders. This way, when creation happens, it can be merged over, and those placeholder values come into right places as placeholders. This means, if you provide a schema with some keys having values as non-placeholder, you'll get those values written onto your objects.

Previously we kept "insurance" function which took a schema reference object and overwrote all its values to the `opts.placeholder`, but then we understood that "normal" reference schemas will always come with right key values anyway, and such operation would waste resources.

{% include "btt.njk" %}
