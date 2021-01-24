---
layout: package
title: html-all-known-attributes
---

## Idea

This package aims to have the most excessive list of all legit attribute names that can be put into HTML. Currently we have a list of 702 attribute names.

This includes deprecated attributes, Microsoft-proprietary-ones that email templates use (like `mso-line-height-rule`) and other-ones you've probably never seen before.

{% include "btt.njk" %}

## API

:::api
allHtmlAttribs
:::

This package exports a plain object with a single key, `allHtmlAttribs`. Its value is a [Set](https://exploringjs.com/impatient-js/ch_sets.html) of 702 strings — all HTML attribute names known to the Humanity.

{% include "btt.njk" %}
