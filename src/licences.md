---
layout: page
title: Licences
extraContainerClass: layout-page-centered
---

# Licences

{% include "src/components/separator.njk" %}

## External link icon

<div class="licence-container">
  <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/External.svg" alt="External link"/>
</div>

We're using a modified version of Wikipedia's [external link icon](https://commons.wikimedia.org/wiki/File:External.svg) which is Public Domain.

{% include "btt.njk" %}
{% include "src/components/separator.njk" %}

## Loader Party Parrots

<div class="licence-container">
  <img src="/images/fastparrot.gif" alt="Fast parrot"/>
</div>

[cultofthepartyparrot.com](https://cultofthepartyparrot.com/)<br>Creative Commons Attribution-ShareAlike 4.0 International [License](https://github.com/jmhobbs/cultofthepartyparrot.com/blob/master/LICENSE)

{% include "btt.njk" %}
{% include "src/components/separator.njk" %}

## Eleventy starter templates

<div class="starter-container">
  <p>
    We borrowed some template structures from:
  </p>
  <div class="starter-container-2col">
    <div>
      {% markdown '/src/components/content/licences-phils.md' %}
    </div>
    <div>
      {% markdown '/src/components/content/licences-xity.md' %}
    </div>
  </div>
</div>

{% include "btt.njk" %}
{% include "src/components/separator.njk" %}

## Other dependencies

<div class="deps-container">

{% set allDeps = package.dependencies | objectKeys | concat(package.devDependencies | objectKeys) %}

{% for depName in allDeps | sort %}
  {% set url = 'https://www.npmjs.com/package/' + depName %}
  {% set isOurs = compiledAssertionCounts.all[depName] %}
  {% if isOurs %}
    {% set url = '/os/' + depName + '/' %}
  {% endif %}

  [{{ depName }}]({{ url }}){% if isOurs %} — HA! Ours!{% endif %}
{% endfor %}

</div>

{% include "src/components/separator.njk" %}
{% include "btt.njk" %}
