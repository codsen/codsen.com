---
layout: package
title: all-named-html-entities
packages:
  - html-entities-not-email-friendly
  - detergent
---

## Idea

This package exports a plain object with 11 keys:

| Key's name                     | Key's value's type | Purpose                                                                                                             |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `allNamedEntities`             | plain object       | all named HTML entities, key is entity's name, value is raw decoded entity. 2125 in total.                          |
| `entStartsWith`                | plain object       | all named HTML entities, grouped by first character, then by second                                                 |
| `entEndsWith`                  | plain object       | all named HTML entities, grouped by last character, then by second-to-last                                          |
| `entStartsWithCaseInsensitive` | plain object       | all named HTML entities, grouped by first character, then by second, both case-insensitive                          |
| `entEndsWithCaseInsensitive`   | plain object       | all named HTML entities, grouped by last character, then by second-to-last, both case insensitive                   |
| `brokenNamedEntities`          | plain object       | key-value pairs of common mistyped named HTML entities and their corrections                                        |
| `uncertain`                    | plain object       | all named HTML entities which could be interpreted as words if entity was malformed (missing ampersand for example) |
| `allNamedEntitiesSetOnly`      | Set                | Set of all named entities, think of array of strings, only unique and faster. Case sensitive list.                  |
| `allNamedEntitiesSetOnlyCaseInsensitive` | Set      | Set of all named entities, think of array of strings, only unique and faster. Case in-sensitive list.                  |
| `decode`                       | function           | decodes named HTML entities (`&...;` format)                                                                        |
| `minLength`                    | integer            | length of the shortest of all named HTML entities (currently `2`)                                                   |
| `maxLength`                    | integer            | length of the longest of all named HTML entities (currently `31`)                                                   |
| `version`                      | string             | as per package.json, for example, `1.4.0` |


{% include "btt.njk" %}

## API - `entStartsWith`

`entStartsWith` looks like this:

```
{
"A": {
    "E": [
        "AElig"
    ],
    "M": [
        "AMP"
    ],
    "a": [
        "Aacute"
    ],
    ...
```

The point of `entStartsWith` is that we don't have to iterate through up to 2,127 entities to match. Instead, we match by first and second letter and match against that list, which varies but is on average tens of strings long.

Let's tap it.

For example, imagine, we have to check, is there a named HTML entity to the right of string index `2` in string `123Aacute456`:

```js
const { entStartsWith } = require("all-named-html-entities");

// is there a named HTML entity to the right of index 2?
const input = "123Aacute456";

// first we slice the string from third index onwards, we get "Aacute456"
const workingSlice = input.slice(3);

// this is very verbose and exaggerated code but it's for illustrative purposes

// in real life it would be shorter than all this

// define default answer, false:
let result = false;

if (
  workingSlice &&
  entStartsWith.hasOwnProperty(workingSlice[0]) &&
  entStartsWith[workingSlice[0]].hasOwnProperty(workingSlice[1]) &&
  entStartsWith[workingSlice[0]][workingSlice[1]].some((entity) =>
    workingSlice.startsWith(entity)
  )
) {
  result = true;
}
console.log(`result: ${result}`);
```

```js
const { all } = require("all-named-html-entities");
console.log(Array.isArray(all));
```

{% include "btt.njk" %}

## API - `decode`

```js
const { decode } = require("all-named-html-entities");
console.log(decode("&aleph;"));
// => ℵ
```

If the given input is not a string, or is an empty string or does not start with ampersand or does not end with semicolon, error is thrown.

Else, check is performed and if it's not found among known entities, a `null` is returned.

{% include "btt.njk" %}
