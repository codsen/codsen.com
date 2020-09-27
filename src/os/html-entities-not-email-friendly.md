---
layout: package
title: html-entities-not-email-friendly
packages:
  - detergent
  - emlint
  - all-named-html-entities
---

## Purpose

Unlike Web pages, Email templates are sent over SMTP and **need to be HTML-encoded**.

HTML encoding can be done three ways: decimal (`&#163;`), hexadecimal (`&#xA3;`) and named forms (`&pound;`).

The named entities can be memorised or recognised more easily than numeric-ones. When we check the template's text, `&pound;` is more informative than `&#163;`. If somebody mistakenly put `&#164;` you would not tell easily, but `&pund;` stands out instantly!

The only problem is, **not all named entities are supported well across all email clients**, in particular, in Windows desktop Outlooks.

This package tells **which entities exactly and not supported widely** and tells you what to convert them to.

This program exports few different lists:

- `notEmailFriendly` — a plain object, key value pairs are like `AMP: "amp"` — total keys: 1841
- `notEmailFriendlySetOnly` — a [Set](https://exploringjs.com/impatient-js/ch_sets.html) of only entity names (in correct letter case) — total size: 1841
- `notEmailFriendlyLowercaseSetOnly` — an alphabetically sorted [Set](https://exploringjs.com/impatient-js/ch_sets.html) of lowercase entity names — total size: 1534

{% include "btt.njk" %}

## API

This package exports a plain object with five keys:

- `notEmailFriendly`
- `notEmailFriendlySetOnly`
- `notEmailFriendlyLowercaseSetOnly`
- `notEmailFriendlyMinLength`
- `notEmailFriendlyMaxLength`

| Key's name                         | Key's value's type | Purpose                                                                                                             |
| ---------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `notEmailFriendly`                 | plain object       | Plain object of all named HTML entities. The key is an entity's name; value is a raw decoded entity. 1841 in total. |
| `notEmailFriendlySetOnly`          | set                | A set of all entity names, in correct case, unsorted. 1841 in total.                                                |
| `notEmailFriendlyLowercaseSetOnly` | set                | A set of all entity names, in lowercase, sorted. 1534 in total (because we have `AMP` and `amp` for example).       |
| `notEmailFriendlyMinLength`        | natural number     | the string length of the shortest of all entities, currently hardcoded to `2`                                       |
| `notEmailFriendlyMaxLength`        | natural number     | the string length of the longest of all entities, currently hardcoded to `31`                                       |

{% include "btt.njk" %}

## `notEmailFriendly`

```js
const { notEmailFriendly } = require("html-entities-not-email-friendly");
// it's a plain object of key-value pairs where key is entity name, value is
// decoded numeric entity analogue of it
console.log(Object.keys(notEmailFriendly).length);
// => 1841
```

The point of plain object `notEmailFriendly` is to decode the entities.

For example, among the keys you can see:

```json
And: "#x2A53",
```

This means, named HTML entity `&And;` is not email friendly and should be put as `&#x2A53;`.

As you noticed, ampersands and semicolons are missing in keys and values (but they're obligatory in HTML code so add them yourself).

{% include "btt.njk" %}

## `notEmailFriendlySetOnly`

[Sets](https://exploringjs.com/impatient-js/ch_sets.html) are awesome because they're fast.

When you import `notEmailFriendlySetOnly`, it's a Set of only the key names:

```js
const { notEmailFriendlySetOnly } = require("html-entities-not-email-friendly");
for (const entitysName of notEmailFriendlySetOnly) {
  console.log(entitysName);
}
// => "AMP",
//    "Abreve",
//    ...

// another example: check is given entity a valid HTML named entity string?
console.log(notEmailFriendlySetOnly.has("tralala"));
// => false - no "tralala" (if put fully, &tralala;) is not a recognised named HTML entity's name

console.log(notEmailFriendlySetOnly.has("Aogon"));
// => true - yes "Aogon" (if put fully, &Aogon;) is a recognised named HTML entity's name
```

You must use Set methods: `has`, `size` etc on `notEmailFriendlySetOnly`. It's not an array, it's a set.

{% include "btt.njk" %}

## `notEmailFriendlyLowercaseSetOnly`

`notEmailFriendlyLowercaseSetOnly` is also a Set but all values are lowercase and sorted.

The idea is that if you have a named HTML entity and suspect that its letter case might be messed up, you lowercase it and match against this Set. Now, if something is found, do actions matching against plain object keys in `notEmailFriendly` (aiming to decode to numeric entities), OR matching against a Set with exact case, `notEmailFriendlySetOnly` (if value is not found, letter case in your entity is messed up).

```js
const { notEmailFriendlySetOnly } = require("html-entities-not-email-friendly");
for (const entitysName of notEmailFriendlySetOnly) {
  console.log(entitysName);
}
// => "AMP",
//    "Abreve",
//    ...
```

{% include "btt.njk" %}

## `notEmailFriendlyMinLength` and `notEmailFriendlyMaxLength`

Their point is to give you guidance how long or short entities can be:

```js
const {
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} = require("html-entities-not-email-friendly");
console.log(
  `The shortest length in the set is: ${notEmailFriendlyMinLength} and longest is ${notEmailFriendlyMaxLength}.`
);
// => The shortest length in the set is: 2 and longest is 31.
```

Keep in mind, `length` here does not count ampersand and semicolon. For example, `Abreve` length is 6 characters but in the HTML, it is 8: `&Abreve;`,

{% include "btt.njk" %}

## In practice

This program allows [detergent](/os/detergent/) to automatically switch between named and numeric HTML entities, prioritising on named, if they're supported (acccording this program).

Detergent's competitor, [Email on Acid Character Converter](https://app.emailonacid.com/character-converter/) only uses numeric entities. Not to mention, EoA Character Converter ignores invisible characters, which is a _liability_.

{% include "btt.njk" %}
