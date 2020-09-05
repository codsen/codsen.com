---
layout: package
title: email-homey
---

## Use it

Once installed, call it in the root of your templates projects:

```bash
homey "dist"
```

## What it does

`email-homey` helps to generate a homepage with a list of all your email templates.

It will expect that all your email templates will be located within a certain folder.

Specifically, `email-homey` will scan a all subfolder names of the path you give it (like `dist` in the example above) and will go inside that folder, look for `seed.html`, copy it into `index.html` (overwriting if such file already exists) and inside that file, replace word `'magicFoldersList'` with a list of folder names (maintaining correct indentation).

This is all you need to be able to pull off a homepage driven by a [Vue.js](https://vuejs.org/). An HTML file with Vue.js script can't query your hard drive and find the subfolder names. For that we need Node. Once Vue.js _has_ the list of folder names (in an array), it can generate a table of templates.

{% include "btt.njk" %}

