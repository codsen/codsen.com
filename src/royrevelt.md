---
layout: page
title: Roy Revelt
permalink: /author/royrevelt/
extraContainerClass: layout-page-about
---
{% from "macro_heading.njk" import heading %}

<div role="presentation" class="separator">
  {% include "svg-codsen-ok.njk" %}
  {% include "svg-codsen-star-large.njk" %}
</div>

<div class="page-about-container">
  <div class="page-about-container__avatar">
    <img src="/images/roy-revelt.jpg" width="88" height="88" alt="Roy Revelt"/>
  </div>
  <div class="page-about-container__contents">
    {{ heading("Roy Revelt", 1) }}
    <p>
      MA, MSc<br>director of Codsen Ltd
    </p>
    <hr>
    <div class="page-about-container__content">
      {% include "src/components/content/about-roy.md" %}
    </div>
  </div>
</div>

<div role="presentation" class="separator">
  {% include "svg-codsen-star-small.njk" %}
  {% include "svg-codsen-2.njk" %}
</div>

{% include "btt.njk" %}
