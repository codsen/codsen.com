---
layout: package
title: html-all-known-attributes
---

## Idea

This package aims to have the most excessive list of all legit attribute names that can be put into HTML. Currently we have a list of 702 attribute names.

This includes deprecated attributes, Microsoft-proprietary-ones that email templates use (like `mso-line-height-rule`) and other-ones you've probably never seen before.

{% include "btt.njk" %}

## API

This package exports a plain object with a single key, `allHtmlAttribs`. Its value is a [Set](https://exploringjs.com/impatient-js/ch_sets.html) of 702 strings — all HTML attribute names known to the Humanity.

{% include "btt.njk" %}

## Why Set not Array and not JSON?

Because of performance reasons.

Previously, we `import()`ed JSON and exported it as an object value.

Now, we export hardcoded Set, in an object value.

Size evaluation speed is 3187251.38% faster according our built-in perf tests (see `perf/` folder in the root of each package in this monorepo):

![matching algorithm](https://glcdn.githack.com/codsen/codsen/raw/master/packages/html-all-known-attributes/media/perf_set_vs_array_from_json.png)

{% include "btt.njk" %}
