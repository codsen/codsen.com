---
layout: post
title: Trivia
extraContainerClass: page-trivia
---

{% set oneStickerOnlyPlease = true %}

**Codsen** is an amalgamation of "**Code**" and "**Send**" — meaning skill in _both_ web and email development.

<div role="presentation" class="separator">
  {% include "svg-codsen-1.njk" %}
</div>

This website is static and follows [Indieweb](https://indieweb.org/) principles:

* We own our data, and it's **open-sourced** — for example, we won't post Medium — and our "Now" [column](/) and RSS are our Twitter.
* We use our **tooling**, here, in client work — everywhere. That's _selfdogfooding_. By the way, [`string-strip-html`](/os/string-strip-html/) is powering multiple Nunjucks filters here!
* We believe in choosing a **right tool for a job** — no matter is it a client project or a pet project. Sometimes it's React but sometimes it's vanilla JS.
* We believe static websites can still be **data-driven** — this website consumes a dozen external data sources — without Gatsby or Contentful — only HTML and CSS and a bit of vanilla JS! Try our search function, for example.
* We believe in **plurality** — we moved away from GitHub, GitLab is our place now.

<div role="presentation" class="separator">
{% include "svg-codsen-2.njk" %}
  {% include "svg-codsen-ok.njk" %}
</div>

Our [npm packages](/os/) have {{ packageExamples | examplesExtractTotal }} examples posted here — all automatically tested and validated.
