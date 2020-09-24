---
layout: package
title: ast-get-object
---

## Purpose

It is a helper function to extract plain objects by certain key-value pairs (if two input arguments given) OR to replace those findings (if three input arguments given).

{% include "btt.njk" %}

## API

**{{ packageJsons["ast-get-object"].lect.req }}(input, keyValPairObj, \[replacementContentsArr])**

In other words, it's a function which takes two or three input arguments.

{% include "btt.njk" %}

### API - Input

| Input argument           | Type         | Obligatory? | Description                                                                                                                                        |
| ------------------------ | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                  | Whatever     | yes         | AST tree, or object or array or whatever. Can be deeply-nested.                                                                                    |
| `keyValPairObj`          | Plain object | yes         | Key/value pairs to look for.                                                                                                                       |
| `replacementContentsArr` | Arrray       | no          | The array of new values to set the findings objects. Those values can even be massive nested trees of plain objects and arrays. It doesn't matter. |

{% include "btt.njk" %}

### API - Output

Output depends on is it GET mode — 2 arguments, or SET mode — 3 arguments.

- If it's **GET mode**, result will be an array of parent objects that hold key/value pairs you asked.

- If it's **SET mode**, result will be of the same type as your input, but with all plain objects that had your key/value pairs replaced with contents of third, replacement array. Mind you, if you will supply too few elements in the replacements array, this library won't do anything to those findings.

{% include "btt.njk" %}

## For example, reading or querying parsed trees (GET)

Let's GET all plain objects that contain key `tag` and value `meta`. In a true parsed-HTML fashion, everything is in an array, and there are other plain objects around:

```js
const result = getObj(
  [
    // <- search in this, the first argument, in this case, a nested array
    {
      tag: "meta",
      content: "UTF-8",
      something: "else",
    },
    {
      tag: "title",
      attrs: "Text of the title",
    },
  ],
  {
    // <- search for this object, the second argument
    tag: "meta",
  }
);
```

`result` — each parent object that holds your requested key/value pair(s) is put into an array:

```js
[
  {
    tag: "meta",
    content: "UTF-8",
    something: "else",
  },
];
```

All findings are always wrapped in an array, even if there's just one finding as above.

{% include "btt.njk" %}

## Writing-over example (SET)

**Task**: take this nested array of plain objects:

```js
[
  {
    tag: ["two", "values"],
    content: "UTF-8",
    something: "else",
  },
  {
    tag: "title",
    attrs: "Text of the title",
  },
];
```

Find all plain objects that contain key `tag` and value `['two', 'values']` (so value is an array!).

Replace all those plain objects with:

```js
{
  tag: ['three', 'values', 'here'],
  content: 'UTF-8',
  something: 'else'
}
```

**Solution:**

```js
getObj(
  [
    {
      tag: ["two", "values"],
      content: "UTF-8",
      something: "else",
    },
    {
      tag: "title",
      attrs: "Text of the title",
    },
  ],
  {
    tag: ["two", "values"],
  },
  [
    {
      tag: ["three", "values", "here"],
      content: "UTF-8",
      something: "else",
    },
  ]
);
```

PS. Notice that replacement is put into an array. Also, keep in mind that array is like a cartridge — it will expect a separate value for each finding, so we're OK in this case — there was one finding, and one replacement in our array "cartridge".

Result of the above will be:

```js
[
  {
    tag: ["three", "values", "here"],
    content: "UTF-8",
    something: "else",
  },
  {
    tag: "title",
    attrs: "Text of the title",
  },
];
```

{% include "btt.njk" %}
