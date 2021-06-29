---
layout: package
title: string-strip-html
packages:
  - detergent
  - ranges-invert
  - stristri
---

## Features

- Attempts to format the output nicely.
- Full control using a callback if needed.
- Removes tag pairs along with the content inside (handy for `script`).
- Works on HTML mixed with other languages (because it does not parse).
- Works on broken, partial, incomplete, non-valid HTML.
- Can be used to generate Email Text versions. Puts URL links.
- Enabled-by-default but optional Recursive HTML Decoding — nothing will escape!
- It won't strip templating tags (like JSP).

PS. We have [`stristri`](/os/stristri/) which also strips HTML. It can strip not only HTML but also CSS, text and templating tags. But it has less granular control over whitespace.

{% include "btt.njk" %}

## API - Input

::: api
stripHtml(input, [opts])
:::

In other words, it's a function which takes a string and an optional options.

| Input argument | Type         | Obligatory? | Description                                        |
| -------------- | ------------ | ----------- | -------------------------------------------------- |
| `input`        | String       | yes         | Text you want to strip HTML tags from              |
| `opts`         | Plain object | no          | The Optional Options Object, see below for its API |

If input arguments are supplied have any other types, an error will be `throw`n.

{% include "btt.njk" %}

## API - Output

The `stripHtml()` function will return **a plain object**, for example:

```js
{
  log: {
    timeTakenInMilliseconds: 6
  },
  result: "abc click me def",
  ranges: [
    [3, 6, " "],
    [14, 18, " "],
  ],
  allTagLocations: [
    [3, 6],
    [14, 18],
  ],
  filteredTagLocations: [
    [3, 6],
    [14, 18],
  ],
}
```

Here is its API:

| Key's name | Key value's type                          | Description                                                                                                                       |
| ---------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `log`      | Plain object                              | For example, `{ timeTakenInMilliseconds: 6 }` |
| `result`   | String                                    | The string output where all ranges were applied to it.                                                                           |
| `ranges`   | [ranges](/ranges/): an array of one or more arrays containing from-to string index ranges OR `null` | For example, if characters from index `0` to `5` and `30` to `35` were deleted, that would be `[[0, 5], [30, 35]]`. Another example, if nothing was found, it would put here `null`.                |
| `allTagLocations`   | Array of zero or more arrays | For example, `[[0, 5], [30, 35]]`. If you `String.slice()` each pair, you'll get HTML tag values. |
| `filteredTagLocations`   | Array of zero or more arrays | Only the tags that ended up stripped will be reported here. Takes into account `opts.ignoreTags` and `opts.onlyStripTags`, unlike `allTagLocations` above. For example, `[[0, 5], [30, 35]]`. |

{% include "btt.njk" %}

## Optional Options Object

`opts` is a plain object. Here are all its keys:

| An Optional Options Object's key | Type of its value                                    | Default                      | Description                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignoreTags`                     | Array of zero or more strings                        | `[]`                         | These tags will not be removed                                                                                                                                         |
| `onlyStripTags`                  | Array of zero or more strings                        | `[]`                         | If one or more tag names are given here, only these tags will be stripped, nothing else                                                                                |
| `stripTogetherWithTheirContents` | Array of zero or more strings, or _something falsy_ | `['script', 'style', 'xml']` | These tags will be removed from the opening tag up to closing tag, including content in-between opening and closing tags. Set it to something _falsy_ to turn it off. You can set it to `["*"]` to include all tags. |
| `skipHtmlDecoding`               | Boolean                                              | `false`                      | By default, all escaped HTML entities for example `&pound;` input will be recursively decoded before HTML-stripping. You can turn it off here if you don't need it.    |
| `trimOnlySpaces`                 | Boolean                                              | `false`                      | Used mainly in automated setups. It ensures non-spaces are not trimmed from the outer edges of a string.                                                               |
| `dumpLinkHrefsNearby`            | Plain object or something _falsy_                   | `false`                      | Used to customise the output of link URL's: to enable the feature, also customise the URL location and wrapping.                                                       |
| `cb`                             | Something _falsy_ or a function                     | `null`                       | Gives you full control of the output and lets you tweak it. See the [dedicated chapter below](#optscb).                            |

The Optional Options Object is not validated; please take care of what values and of what type you pass.

Here is the Optional Options Object in one place (in case you ever want to copy it whole):

```js
{
  ignoreTags: [],
  onlyStripTags: [],
  stripTogetherWithTheirContents: ["script", "style", "xml"],
  skipHtmlDecoding: false,
  trimOnlySpaces: false,
  dumpLinkHrefsNearby: {
    enabled: false,
    putOnNewLine: false,
    wrapHeads: "",
    wrapTails: ""
  },
  cb: null,
}
```

{% include "btt.njk" %}

### Using Ranges from the output

The _ranges_ from the output are compatible with [range-ecosystem libraries](/ranges/) like [`ranges-apply`](/os/ranges-apply/):

```js
{{ packageExamples['string-strip-html']['minimal-ranges.js'].content | decodeCurlies | safe }}
```

Behind the scenes, this program actually operates on [Ranges](/ranges/). It returns string in the output for convenience, to save your time, so you don't have to use [`ranges-apply`](/os/ranges-apply/).

{% include "btt.njk" %}

### `opts.trimOnlySpaces`

> `Hi&nbsp;` &rarr; `Hi&nbsp;` instead of `Hi&nbsp;` &rarr; `Hi`

In automated setups, a single string value can be split over multiple JSON paths. In those cases, joining spaces or non-breaking spaces are intended and often placed around the values. Normally, we would treat surrounding whitespace as a rogue, but not in these cases.

This setting allows us to distinguish between the two cases.

For example, imagine we "stitch" the sentence: `Hi John! Welcome to our club.` out of three pieces: `Hi` + `John` + `! + Welcome to our club.`. In this case, spaces between the chunks would be added by your templating engine. Now, imagine, the text is of a quite large `font-size`, and there's a risk of words wrapping at wrong places. A client asks you to ensure that `Hi` and `John` are **never split between the lines**.

What do you do?

You remove the space between `Hi` and `John` from the template and move it to data-level. You hard-code the non-breaking space after `Hi` — `Hi&nbsp;`.

As you know, this library trims the input before returning it, and recursive HTML decoding is always on. On default settings, this library would remove your non-breaking space from `Hi&nbsp;`. That's where you need to set `opts.trimOnlySpaces` to `true`.

In this particular case, you can either turn off HTML decoding OR, even better, use this `opts.trimOnlySpaces` setting.

In either case, whitespace between the detected tags will still be aggressively trimmed - `text <div>\n \t \r\n <br>\t \t \t</div> here` &rarr; `text here`.

When this setting is on, only spaces will be trimmed from outside; an algorithm will stop at a first non-space character, in this case, non-breaking space:

```
"      &nbsp;     Hi! Please <div>shop now</div>!      &nbsp;      "
```

is turned into:

```
"&nbsp;     Hi! Please shop now!      &nbsp;"
```

Notice how space chunks between `nbsp`'s and text are retained when `opts.trimOnlySpaces` is set to `true`. But the default is `false`; this feature is off by default.

{% include "btt.njk" %}

### `opts.dumpLinkHrefsNearby`

`opts.dumpLinkHrefsNearby` value is a plain object:

| opts.dumpLinkHrefsNearby key | default value | purpose                                                                                                                                                                                                    |
| ---------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enabled                      | `false`       | by default, this function is disabled - URL's are not inserted nearby. Set it to Boolean `true` to enable it.                                                                                              |
| putOnNewLine                 | `false`       | By default, URL is inserted after any whatever was left after stripping the particular linked piece of code. If you want, you can force all inserted URL's to be on a new line, separated by a blank line. |
| wrapHeads                    | `""`          | This string (default is an empty string) will be inserted in front of every URL. Set it to any string you want, for example `[`.                                                                           |
| wrapTails                    | `""`          | This string (default is an empty string) will be inserted straight after every URL. Set it to any string you want, for example `]`.                                                                        |


This feature is aimed at producing Text versions for promotional or transactional email campaigns.

If input string is has a linked text, URL will be put after it:

```html
We watch both <a href="https://www.rt.com" target="_blank">RT</a> and
<a href="https://www.bbc.co.uk" target="_blank">BBC</a>.
```

it's turned into:

```html
We watch both RT https://www.rt.com and BBC https://www.bbc.co.uk.
```

But equally, any link on any tag, even one without text, will be retained:

```html
Codsen
<div>
  <a href="https://codsen.com" target="_blank"
    ><img
      src="logo.png"
      width="100"
      height="100"
      border="0"
      style="display:block;"
      alt="Codsen logo"
  /></a>
</div>
```

it's turned into:

```
Codsen https://codsen.com
```

Setting `opts.dumpLinkHrefsNearby` is off by default; you need to turn it on, passing options object with a key `opts.dumpLinkHrefsNearby` set to `true`.

{% include "btt.njk" %}

### `opts.onlyStripTags`

Sometimes you want to strip only certain HTML tag or tags. It would be impractical to ignore all other known HTML tags and leave those you want. Option `opts.onlyStripTags` allows inverting the setting: whatever tags you list will be the only tags removed.

`opts.onlyStripTags` is an array. When a program starts, it will filter out any empty strings and strings that can be `String.trim()`'ed to a zero-length string. It's necessary because a presence on just one string in `opts.onlyStripTags` will switch this application to `delete-only-these` mode and it would be bad if empty, falsy or whitespace string value would accidentally cause it.

This option can work in combination with `opts.ignoreTags`. Any tags listed in `opts.ignoreTags` will be removed from the tags, listed in `opts.onlyStripTags`. If there was one or more tag listed in `opts.onlyStripTags`, the `delete-only-these` mode will be on and will be respected, even if there will be no tags to remove because all were excluded in `opts.onlyStripTags`.

{% include "btt.njk" %}

### `opts.stripTogetherWithTheirContents`

This program not only strips HTML and returns a string. It also returns string index locations of removals. This way, you can use this program to extract ranges of indexes which would later be used to skip operations on a string.

For example, npm package [`title`](https://www.npmjs.com/package/title) capitalises the titles as per _The Chicago Manual of Style_. But if input source can contain HTML code, we need to skip processing the HTML tags.

The idea is, it sets `opts.stripTogetherWithTheirContents` to `["*"]` — asterisk or wildcard meaning to "strip" all paired tags (including `<code>`/`</code>` in titles, for example). Then we take the locations of all tags and supplement it with locations of what's been whitelisted (using [`ranges-regex`](/os/ranges-regex/)). Finally, we [invert](/os/ranges-invert/) the ranges and supplement them with replacement value, third array element, coming from `title`. Here's [the source code](/os/string-strip-html/examples/#set-the-title-case-using-title-package).

{% include "btt.njk" %}

### `opts.cb`

Sometimes you want more control over the program: maybe you want to strip only certain tags and write your custom conditions, maybe you want to do something extra on tags which are being ignored, for example, fix whitespace within them?

You can do it using `opts.cb`, passing a _callback function_. The idea is, once the program detects a _truthy_ callback, it will stop performing the actions automatically. Instead, it will give you all the data: `tag` object with tag details, proposed deletion ranges, proposed string to insert and so on — then you must push the range yourself into `rangesArr`. If you don't push anything, that tag won't be deleted.

```js
const cb = ({
  tag,
  deleteFrom,
  deleteTo,
  insert,
  rangesArr,
  proposedReturn,
}) => {
  if (tag) {
    // do something depending on what's in the current tag
    console.log(JSON.stringify(tag, null, 4));
  } else {
    // default action which does nothing different from normal, non-callback operation
    rangesArr.push(deleteFrom, deleteTo, insert);
    // you might want to do something different, depending on "tag" contents.
  }
};
const { result } = stripHtml("abc<hr>def", { cb });
console.log(result);
```

The `tag` key contains all the internal data for the particular tag which is being removed. Feel free to `console.log(JSON.stringify(tag, null, 4))` it and tap its contents.

{% include "btt.njk" %}

### cb() example

The point of this callback interface is to pass the action of pushing of ranges to a user, as opposed to a program. The program will suggest you what it would push to final ranges array `rangesArr`, but it's up to you to perform the pushing.

Below, the callback "does nothing", it pushes what is proposed by default, `proposedReturn`, then we prove it still works by not pushing anything, which makes the program do nothing:

```js
{{ packageExamples['string-strip-html']['cb-which-does-nothing.js'].content | decodeCurlies | safe }}
```

You could add more logic, conditionally push only certain ranges, tweak the ranges that get pushed and so on.

`tag` contains all the info program has gathered for currently stripped tag, it looks like this:

```js
{
  "attributes": [],
  "slashPresent": false,
  "leftOuterWhitespace": 3,
  "onlyPlausible": false,
  "nameStarts": 4,
  "nameContainsLetters": true,
  "nameEnds": 6,
  "name": "hr",
  "lastOpeningBracketAt": 3,
  "lastClosingBracketAt": 6
}
```

For example, strict bracket-to-bracket range would be `[tag.lastOpeningBracketAt, tag.lastClosingBracketAt + 1]`.

{% include "btt.njk" %}

## Algorithm

Speaking scientifically, it works from lexer-level, it's a _scanerless_ parser.

In simple language, this program does not use parsing and AST trees. It processes the input string as text. Whatever the algorithm doesn't understand — errors, broken code, non-HTML, etc. — it skips.

{% include "btt.njk" %}
