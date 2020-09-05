---
layout: package
title: generate-atomic-css-cli
---

## Use it

Once installed, call it typing `gac` in your terminal, like this:

```bash
gac "index.html"
# or with wildcards:
gac "modules/css/*/*.scss"
```

## How it works

You place special placeholders for config ("config heads" and "config tails"), then also placeholders for content ("content heads" and "content tails").

Config will be read from between config heads and tails, expanded into multiple lines as you requested and result will be placed instead of existing content between content heads and content tails.

In config, `$$$` means dynamic value, default 0-500 but you can customise the range appending pipes at the end of the line:

```
a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

this will get wiped

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
```

yields:

```
a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
```

As you see, pipes are inclusive values, one value means "upto", two values mean "from" and "upto".

You can use this CLI to generate/update any file: HTML, CSS or SCSS or whatever. Just put the placeholders and job will be done.

Usually config is within CSS comments block.

⚡️⚡️⚡️⚡️🔥🔥🔥🍻🍻🍻🍻🤩🤩💪🏼💪🏼💪🏼💪🏼💪🏼👊🏼👊🏼👊🏼👊🏼💥💥💥💥⚡️⚡️🌟🌟🌟🌟⚡️🍺🍺💪🏼💪🏼

{% include "btt.njk" %}
