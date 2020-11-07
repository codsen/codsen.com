---
layout: package
title: bitbucket-slug
---

## Idea

BitBucket readme file headings are automatically linked with anchors.

This library generates those anchor links, just in case you want to generate a "**Table of Contents**" or programmatically generate links to any given BitBucket headings.

We backwards-engineered the BitBucket slug-generation algorithm, and it appears to be:

- Strip all punctuation (`.,;&`)
- Strip all emoji or non-letter characters (like `🦄` or  `♥`)
- Strip hashes which mean Markdown headings and single space that follows them (`##`)
- Replace each chunk of spaces with single hyphen
- Deburr (`déjà vu` -> `deja vu`; `ąžuolas` -> `azuolas`)
- Strip non-latin letters (Cyrillic, Hiragana, Katakana etc.)

In BitBucket README's, there's a rule that no two slugs can be the same. If BitBucket slug-generation function generates the same URL, it starts to append `_1`, `_2` on the first repeated slug onwards.

There are only two dependencies: [ent](https://www.npmjs.com/package/ent) to decode entities and [lodash.deburr](https://www.npmjs.com/package/lodash.deburr) to convert letters to basic Latin.

{% include "btt.njk" %}

## API

:::api
bSlug(str)
:::

**Input:** string.
**Output:** string.

If the input is `undefined` or `null` or not a string - empty string will be returned.

{% include "btt.njk" %}

## Competition

Whoever wonders, no, [slugify](https://github.com/sindresorhus/slugify) on npm won't match the BitBucket heading slug generation API. There are peculiarities which differ.

This library, on another hand, is aiming to match BitBucket spec as close as possible. Our unit tests are pinning the output of this library against the BitBucket-rendered HTML.

{% include "btt.njk" %}
