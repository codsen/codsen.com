---
title: "`string-strip-html` v.5 and Lessons Learned"
date: '2020-08-18'
image: "001"
packages:
  - string-strip-html
tags:
  - api
---

For an exported function, _string-in, string-out_ API is awesome because it's simple. The problem happens later when you want to add more to the output, for example, a log with time spent. Or an alternative output, like locations of string indexes. Or the `version` from package.json.

---

If we could send a message to the past ourselves, we would send **"always return a plain object from a function, never return a string"**.

_Chummy_ API would be to keep _string-in, string-out_ function, but switch between different outputs using options object flags. Like we did with `opts.returnRangesOnly` on previous versions of [`string-strip-html`](/os/string-strip-html/).

Today we’ve released v.5 of [`string-strip-html`](/os/string-strip-html/) to end the _chumminess_.

A _plain object_ is returned now:

```json
stripHtml("abc<a>click me</a>def");
// => {
//      log: {
//        timeTakenInMilliseconds: 6
//      },
//      result: "abc click me def",
//      ranges: [
//        [3, 6, " "],
//        [14, 18, " "],
//      ],
//      allTagLocations: [
//        [3, 6],
//        [14, 18],
//      ],
//      filteredTagLocations: [
//        [3, 6],
//        [14, 18],
//      ],
//    }
```

### Why change what's returned, upon user's request, when we can _return everything_?

We removed `opts.returnRangesOnly` — no need to choose — you always get everything now.

Function's output is _a plain object_ now, containing:

1. a cleaned _string_ (considering `opts.ignoreTags` and `opts.onlyStripTags`)
2. gathered _ranges_, used to produce cleaned string (considering `opts.ignoreTags` and `opts.onlyStripTags`)
3. tag _locations_ of all spotted HTML tags IGNORING the whitelist/blacklist `opts.ignoreTags` and `opts.onlyStripTags`
4. locations of filtered HTML tags (considering `opts.ignoreTags` and `opts.onlyStripTags`)
5. plus, some statistics

## New additions

`allTagLocations` reports simple _from-to_ string index locations of all detected tags — it can be used for syntax highlighting, for example. It's different from `ranges` output which contains whitespace corrections which are meant to be [applied](/os/ranges-apply/) onto a string.

`log` is handy for the perf investigations or in GUI web apps.

## `string-strip-html` migration instructions from `v.4.x` to `v.5`

TLDR: Grab the key you need from an output object.

before, `v.4`:

```js
const result = stripHtml("abc<a>click me</a>def");
console.log(result);
// => abc click me def
```

now, `v.5` — [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) what you need:

```js
const { result } = stripHtml("abc<a>click me</a>def");
console.log(result);
// => abc click me def
```

If you need [ranges](/ranges/), now they're always returned:

before, `v.4`:

```js
const result = stripHtml("abc<a>click me</a>def", {
  returnRangesOnly: true
});
console.log(result);
// => [[3, 6, " "], [14, 18 ," "]]
```

now, `v.5`:

```js
const { ranges } = stripHtml("abc<a>click me</a>def");
console.log(ranges);
// => [[3, 6, " "], [14, 18 ," "]]
```

## `opts.filteredTagLocations`

While `allTagLocations` contains locations of all HTML tags, the `filteredTagLocations` takes into consideration `opts.ignoreTags` and `opts.onlyStripTags`. This way, you can, for example, ask program to strip only `tr` tags, but then you actually grab the indexes of their locations:

```js
const stripHtml = require("string-strip-html");
const input = `<table width="100">
  <tr>
    <td>
      <table width="100">
        <tr>
          <td>
            This is content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;

const { filteredTagLocations } = stripHtml(input, {
  onlyStripTags: ["tr"],
});
console.log("Here are TR tags: ${JSON.stringify(filteredTagLocations, null, 4)}")
// => [
  [22, 26],
  [70, 74],
  [143, 148],
  [176, 181],
]

const gatheredExtractedTagStrings = [];
filteredTagLocations.forEach(([from, to]) => {
  gatheredExtractedTagStrings.push(input.slice(from, to));
});
console.log(JSON.stringify(gatheredExtractedTagStrings, null, 4));
// => [`<tr>`, `<tr>`, `</tr>`, `</tr>`]
```

For even more control over the result, use [`opts.cb`](/os/string-strip-html/#optscb).
