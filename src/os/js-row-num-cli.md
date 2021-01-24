---
layout: package
title: js-row-num-cli
---

## Use it

![in terminal](/images/package-js-row-num-cli-update-console-log-row-number.gif)

Once installed, call it typing `jsrownum` or `jrn` in your terminal, like this:

```bash
jsrownum
# or
jrn
```

or specify a glob pointing to some `js` files:

```bash
jsrownum "folder/*.js"
# or
jrn "folder/*.js"
```

If `jsrownum` is too long, you can also type `jrn`; we wired up that as an alternative.

{% include "btt.njk" %}

## Quick Take

It updates each `console.log` in your `.js` files...

from:

```js
// something on row 1
// something on row 2
console.log('000 var = ' + var); // row 3
//           ^^^
```

to:

```js
// ...
console.log('003 var = ' + var);
//           ^^^
```

Because it's on row 3. If you're not using `console.log`, and are using for example `log()`, put that under "-t" flag:

```bash
jrn -t "log"
```

or if specifying paths,

```bash
jrn "folder/*.js" -t "log"
```

⚡️⚡️⚡️⚡️🔥🔥🔥🍻🍻🍻🍻🤩🤩💪🏼💪🏼💪🏼💪🏼💪🏼👊🏼👊🏼👊🏼👊🏼💥💥💥💥⚡️⚡️🌟🌟🌟🌟⚡️🍺🍺💪🏼💪🏼

{% include "btt.njk" %}

## What it does

First, it depends, did you specify a path or not.

- If you did, for example, `jsrownum "folder/*.js"` it will process that file (or expand glob into a list of files).
- If you didn't, just typed `jsrownum`, it will use the current folder where it was called from and look for files in this order:

1.  ./src/main.js
2.  ./main.js
3.  ./cli.js
4.  ./index.js
5.  ./src/index.js

**Once it picks the file**, it will look for `console.log` statements, and replace the first chunk of an uninterrupted sequence of numbers with a number of a row it sits.

For exampe, on row number 55 there's a `console.log("045 var = " + var)`.
It will replace `045` with `055`.

🌟⚡️🍺🍺💪🏼💪🏼🍺

The default padding is three characters, but you can override it, see the optional flags table below.

`console.log`s help to troubleshoot the code. These days Rollup builds are standard — having a source in ES Modules (and pointing unit tests to it) and using that source to build three types of applications: 1. ESM (same as source); 2. UMD (minified, for browsers and unpkg.com); 3. Common JS — transpiled to ES5, suitable for older platforms.

Now, you can use Rollup to remove comments and `console.log`s automatically when producing _production_ builds. During _development_ builds, you can use CLI flags to skip `console.log` removal. This way, you get all the goodness of `console.log`s in the terminal, and there's no risk that they will spill into production.

{% include "btt.njk" %}

### API

Once installed globally, type in your terminal: `jsrownum` OR type `jrn`.

If you **won't pass** any glob file/folder pattern or patterns, for example, just type `jrn`, it will look for the following files in this priority order:

1.  ./src/main.js
2.  ./main.js
3.  ./cli.js
4.  ./index.js
5.  ./src/index.js

If you **will pass** some globs, for example:

```bash
jrn "src/*.js"
jsrownum --pad="4" "dist/**/*.js test/ index.js"
jrn "test1.js test2.js" -p 2
```

...it will expand the globs and catch all `.js` files in the folders you specified and process them.

Optionally, you can pass the options, which match the [API](/os/js-row-num/):

| CLI flag            | For example,                       | What it does                                                                                                                                                                   |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `-p` or `--pad`     | `jsrownum -p 3` or `jrn --pad="4"` | Lets you set the row number padding. For example, `console.log` statement on row 3 with padding set to 4 would get `0003` added. Row 99 with padding of 1 would be still `99`. |
| `-t` or `--trigger` | `jrn -t "log"`                     | Lets you change from "console.log" to any function's name, for example update "001" in `log(\`001 z = \${z}\`);`                                                               |

{% include "btt.njk" %}

## Using multiple flags

Command line applications have few rules. First, if you want to pass multiple values to a certain flag, put `-*` or `--*****` for each value:

GOOD:

```bash
jrn -f "log" -f "yo"
```

BAD:

```bash
jrn -f "log" "yo"
```

{% include "btt.njk" %}

## Escaping

If you want to put double quotes, escape it like using left slash:

```bash
jrn -f "zzz\"yyy"
```

{% include "btt.njk" %}

## A nifty setup idea

We set up an alias for `jsrownum`, to piggyback on some common command we run often. For example, `git add .` - this way all row numbers are processed automatically without any hassle.

{% include "btt.njk" %}
