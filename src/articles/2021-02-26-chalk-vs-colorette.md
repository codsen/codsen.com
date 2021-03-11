---
title: "`chalk` vs. `colorette`"
date: '2021-02-28'
image: "008"
packages:
  - colorette
  - chalk
  - ansi-red
tags:
  - js
---

Tooling choices are a subjective matter. Lately, I've been observing [`colorette`](https://www.npmjs.com/package/colorette) taking over [`chalk`](https://www.npmjs.com/package/chalk), and I have few thoughts on this subject.

---

My current consensus is, at first, to avoid any terminal colourizing helpers, then, only then, consider using one. For the record, at the time of writing, I have published [a dozen of CLI's](/os/#cli-apps), and while half of them use a colourization helper, the other half does not. Out of those that do, one uses `colorette`, and 5 are using `chalk`.

In my opinion, what matters when choosing one is fundamentals — particularly, do unused "colours" (or any other cruft) end up in your bundle. When you import blue, bold and underline from `colorette`:

```js
import { blue, bold, underline } from "colorette"
```

only those end up in your bundle.

But whole `chalk` will end up in your bundle:

```js
import chalk from 'chalk';
```

On the other hand, a) I don't transpile or bundle CLI's at all; and b) `chalk` seems more developer-friendly. Chained methods get code suggestion hints, compare:

```js
chalk.blue.underline.bold('hi');
// vs
underline(bold(blue("hi")))
```

For the record, there's also [`ansi-red`](https://www.npmjs.com/package/ansi-red) and bunch, but it seems a bad idea to split colourization wrappers into standalone libraries. What if you change your mind, to use not `red` but `green`? Would you replace one dependency with another? In that light, `ansi-*` group, in my opinion, will never outcompete `chalk` or `colorette`.

### Colorizing helpers are optional

It's crucial to dispel any [FUD](https://en.wikipedia.org/wiki/Fear,_uncertainty,_and_doubt) around the terminal colourization subject.

All it takes to colourize the text in the terminal is to wrap it with two special chunks of text.

No magic here.

The frontal part contains a colour code (`31` for red, `32` for green and so on), ending part is always `39`. Personally, I snippetized all six or seven of them and memorized the numbers. For example, I have set up a snippet `q - q - <the first letter of the colour>` on [Dash](https://www.kapeli.com/dash) (yes I'm still using the [notorious one](https://9to5mac.com/2016/10/10/apple-dash-removal-from-app-store/)), which produces something like:

```js
`\u001b[${32}m${`text`}\u001b[${39}m`
```

where "text" is placeholder. I deliberately wrapped colour numbers as ES6 template literals because they get highlighted; it's easier to visually-grep.

This is it. 

No magic.

The only challenge is when you want to **stack the styling**: for example, bold and red and background fill. But it's rare, and in those cases, I reach for `chalk` or, more recently `colorette`.

### CLI's and "normal" programs

It's important to note that besides CLI's, there are "normal" programs. For CLI's, terminal colourizing helpers are optional but won't raise eyebrows. For "normal" programs, they probably will, especially if all terminal output is for debugging purposes only.

### JS is not the only programming language to write CLI's

We, as humanity, invested so much in JavaScript, but it's not efficient at all. When [`esbuild`](https://github.com/evanw/esbuild) takes 0.37s to do the job that `rollup+terser` takes 36s., that's not just a contrived example. That's a reality, and I suffer from it every day. Looking at **my own builds**, for example, [`codsen-tokenizer`](/os/codsen-tokenizer/), TypeScript on Rollup: 8.3s for UMD build, 6s for un-minified UMD build, 4.4s for CommonJS, 3.8s for ESM build, 4.5 for .mjs, even bloody [typings](https://www.npmjs.com/package/rollup-plugin-dts) take 2.2s. `codsen-tokenizer` takes 29.2s to build! That's not normal, is it? And that's on the fastest MacBook Pro laptop ever, at least pre-M1. How did Linus build operating systems in the nineties at all then? Oh, that was C and Assembly. Okay. He was using _proper_ programming languages.

Sooner or later, one will start outgrowing the JavaScript baby shirt. By the way, see [Atwood's Law](https://blog.codinghorror.com/the-principle-of-least-power/).

I believe all CLI's should be **compiled programs**, written in Go or Rust or any other compiled programming language.
