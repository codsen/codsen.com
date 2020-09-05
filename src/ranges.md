---
layout: post
title: Ranges
---

{% from "macro_heading.njk" import heading %}

We invented the term but it's just a fancy way to describe arrays of "from" — "to" string index _ranges_:

```js
[
  [3, 7],
  [10, 15, "replacement"],
  [4, 7]
]
```

`[3, 7]` means **delete characters** from index `3` to `7`.

`[10, 15, "replacement"]` means **replace characters** from index `10` to `15` with `replacement`.

A case of **no ranges** is marked by `null` (but if you pass an empty array, it will work too).

<br/>
<br/>
<br/>

<div class="tac">That's all there is.</div>

<br/>
<br/>
<br/>

Same indexes as in `String.prototype.slice()`.

_Ranges_ give us flexibility to process strings. For example, [detergent](/os/detergent/) taps different packages, one to [strip HTML](/os/string-strip-html/), another to [remove widow words](/os/string-remove-widows/) and so on — they all report _ranges_. They all operate on the same source string, not on the source, mutated by the previous operation.

In the end, [detergent](/os/detergent/) [merges](#ranges-merge) those ranges and processes the string, [rendering](#ranges-apply) the result.

That's a different approach from the old way, mutating string over and over using regexes.

{% include "btt.njk" %}

{% include "src/components/separator.njk" %}

<div class="toc-container">
{{ heading("Range Libraries", 2) }}

 - [`ranges-apply`](#ranges-apply)
 - [`ranges-push`](#ranges-push)
 - [`ranges-merge`](#ranges-merge)
 - [`ranges-sort`](#ranges-sort)
 - [`ranges-crop`](#ranges-crop)
 - [`ranges-regex`](#ranges-regex)
 - [`ranges-ent-decode`](#ranges-ent-decode)
 - [`ranges-invert`](#ranges-invert)
 - [`ranges-is-index-within`](#ranges-is-index-within)
 - [`ranges-iterate`](#ranges-iterate)
 - [`ranges-process-outside`](#ranges-process-outside)

</div>

{% include "src/components/separator.njk" %}

## ranges-apply

{% include "src/components/content/tldr-ranges-apply.md" %}

<a href="/os/ranges-apply/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-push

{% include "src/components/content/tldr-ranges-push.md" %}

<a href="/os/ranges-push/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-merge

{% include "src/components/content/tldr-ranges-merge.md" %}

<a href="/os/ranges-merge/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-sort

{% include "src/components/content/tldr-ranges-sort.md" %}

<a href="/os/ranges-sort/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-crop

{% include "src/components/content/tldr-ranges-crop.md" %}

<a href="/os/ranges-crop/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-regex

{% include "src/components/content/tldr-ranges-regex.md" %}

<a href="/os/ranges-regex/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-ent-decode

{% include "src/components/content/tldr-ranges-ent-decode.md" %}

<a href="/os/ranges-ent-decode/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-invert

{% include "src/components/content/tldr-ranges-invert.md" %}

<a href="/os/ranges-invert/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-is-index-within

{% include "src/components/content/tldr-ranges-is-index-within.md" %}

<a href="/os/ranges-is-index-within/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-iterate

{% include "src/components/content/tldr-ranges-iterate.md" %}

<a href="/os/ranges-iterate/" class="button">See the package</a>
{% include "btt.njk" %}

## ranges-process-outside

{% include "src/components/content/tldr-ranges-process-outside.md" %}

<a href="/os/ranges-process-outside/" class="button">See the package</a>
{% include "btt.njk" %}

{% include "src/components/separator.njk" %}

## Alternatives

### `magic-string`

The [`magic-string`](https://github.com/rich-harris/magic-string) by Rich Harris, the _Rollup_ creator.

It is an all-in-one program to perform operations on strings in a controllable manner. It's oriented at operations on code and its produced sourcemaps are aimed at browsers.

_Range_ libraries are best used for when you want to:

  - transfer string amendment instructions between programs
  - gather string amendment instructions and discard some, conditionally, or tweak them
  - when string processing is complex

`magic-string` is best used in programs similar to Rollup: you process code and generate sourcemaps for browsers.

**In comparison:**

`magic-string` method `.overwrite` - equivalent to [`ranges-push`](#ranges-push) and [`ranges-apply`](#ranges-apply).
