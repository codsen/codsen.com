---
layout: package
title: string-uglify
packages:
  - html-crush
  - email-comb
  - detergent
---

## Idea

This library takes array of strings and uglifies them:

```js
[".module", ".class1", ".class2"];
```

into something like:

```js
[".g", ".j5", ".s9"];
```

## Deterministic algorithm

_Deterministic_ means that the same input always results in the same output.

Our algorithm is _nearly deterministic_. "Nearly", because many class names compete to be shortened to a single character and depending on the list, a single-character slot may be available or not. When default, two-character-long class names clash, the third character is appended (and so on, with less and less probability of happening).

Technically speaking, we want to uglify an array of class names in such way, that replacing half of the classes in the array and uglifying them again, "veteran" values would stay the same.

Practically, _deterministic algorithm_ means you can heavily edit your HTML and it's unlikely that there will be reported git changes outside your edited code areas.

For example, let's minify CSS classes made of NATO phonetic alphabet, `.oscar` being one of them. Then, let's create another array: leave only `.oscar` and fill the list with other words. In both uglified result arrays, `.oscar` is consistently minified to the same `.k`.

That's _determinism_.

```js
const input1 = [
  ".alpha",
  ".bravo",
  ".charlie",
  ".delta",
  ".echo",
  ".foxtrot",
  ".golf",
  ".hotel",
  ".india",
  ".juliett",
  ".kilo",
  ".lima",
  ".mike",
  ".november",
  ".oscar", // <---- here
  ".papa",
  ".quebec",
  ".romeo",
  ".sierra",
  ".tango",
  ".uniform",
  ".victor",
  ".whiskey",
  ".xray",
  ".yankee",
  ".zulu",
];
const output1 = uglifyArr(input1);
console.log(`\n\n\n the first array:`);
console.log(input1.map((val, i) => `${val} - ${output1[i]}`).join("\n"));
// => the first array:
//
// .alpha - .s
// .bravo - .m
// .charlie - .u
// .delta - .w
// .echo - .t
// .foxtrot - .e
// .golf - .c
// .hotel - .o
// .india - .r
// .juliett - .j
// .kilo - .jj
// .lima - .x
// .mike - .a
// .november - .y
// .oscar - .k // <---- here
// .papa - .w6
// .quebec - .z
// .romeo - .uq
// .sierra - .q
// .tango - .l
// .uniform - .i
// .victor - .h
// .whiskey - .m0
// .xray - .e4
// .yankee - .h9
// .zulu - .qg

const input2 = [
  ".abandon",
  ".ability",
  ".able",
  ".about",
  ".above",
  ".abroad",
  ".absence",
  ".absent",
  ".absolute",
  ".abstract",
  ".abuse",
  ".abusive",

  ".oscar", // <---- here

  ".academic",
  ".accept",
  ".acceptable",
  ".acceptance",
  ".access",
  ".accident",
  ".accompany",
  ".according",
  ".account",
  ".accountant",
  ".accurate",
];

const output2 = uglifyArr(input2);
console.log(`\n\n\n the second array:`);
console.log(input2.map((val, i) => `${val} - ${output2[i]}`).join("\n"));
// => the second array:
//
// .abandon - .p
// .ability - .q
// .able - .i
// .about - .n
// .above - .z
// .abroad - .np
// .absence - .nl
// .absent - .h
// .absolute - .zj
// .abstract - .o
// .abuse - .c
// .abusive - .r
// .oscar - .k // <---- here
// .academic - .v
// .accept - .u
// .acceptable - .i4
// .acceptance - .l
// .access - .w
// .accident - .pj
// .accompany - .n3
// .according - .wm
// .account - .pd
// .accountant - .a
// .accurate - .cw
```

{% include "btt.njk" %}

## Other features

- Its API is friendly - no errors are thrown, wrong inputs won't give you results. An empty array is fine.
- Put dots and hashes (`.a` and `#a`) or don't. If you are minifying only classes or only id's you might omit dot or hash.
- Input reference strings array does not have to contain unique entries. It's just inefficient to have duplicates so you should aim to avoid that.

{% include "btt.njk" %}

## API

When you `require`/`import`, you get three things:

```js
const { uglifyArr, uglifyById, version } = require("string-uglify");
```

### uglifyArr() - returns copy of a given array with each string uglified

**Input** — anything.
If it's not an array, the same thing will be instantly returned.
If it's array, an array is returned.
If it's an array of one or more strings, it will return an array of that many uglified strings.

**Output** - same type as **input**.
If it's a non-empty array of strings, those strings will be uglified.

If you feed strings **with** dots/hashes, `[".class1", "#id2", ".class2", "#id9"]` output will have same dots/hashes, for example, `[".m", "#b", ".r", "#aa"]`.

If you feed input **without** dots/hashes, `["name1", "name2", "name3"]`, output will be without dots/hashes. For example, `["m", "b", "r", "aa"]`.

See the usage example above.

{% include "btt.njk" %}

### uglifyById() - clones and uglifies array and returns uglified element by requested id

Input — two arguments: array and natural number index.

Output - uglified string (string from position "id").

uglifyById() is less efficient when called many times because each time it processes the whole array using `uglifyArr()` and then gives you the id you requested. You should aim to avoid using `uglifyById()` and instead uglify the whole array, assign the result to a variable and query the element you need from it.

See the usage example above.

{% include "btt.njk" %}

### version

It outputs the _semver_ string straight from `package.json`'s "version" key's value.

For example:

```js
const { version } = require("string-uglify");
console.log(`string-uglify from npm has version: ${version}`);
// string-uglify from npm has version: 1.1.0
```

{% include "btt.njk" %}

## uglification vs minification

Some people use the term "minification" and "uglification" interchangeably, but that's two different things.

**Uglification**: `.class1 { display: block; }` &rarr; `.fj { display: block; }` (rename class or id names to be shorter)

**Minification**: `.class1 { display: block; }` &rarr; `.class1{display:block}` (in CSS case, remove all the white space and sometimes last semicolon)

This library won't minify.

If you _need_ an integrated HTML/CSS minification tool, consider [html-crush](/os/html-crush/).

{% include "btt.njk" %}
