---
layout: package
title: string-extract-class-names
packages:
  - detergent
---

## API

:::api
extract(str)
:::

In other words, it's a function which takes one input, a string.

{% include "btt.njk" %}

## API - Input

| Input argument | Type   | Obligatory? | Description         |
| -------------- | ------ | ----------- | ------------------- |
| inputString    | String | yes         | A string to process |

{% include "btt.njk" %}

## API - Output

It returns a plain object.

| Key in a returned object | Key value's type                      | Description                                       |
| ------------------------ | ------------------------------------- | ------------------------------------------------- |
| `res`                    | String                                | Array of extracted classes/id's |
| `ranges`                 | Array of one or more arrays or `null` (compatible with [Ranges](/ranges/) libraries) | Locations of extracted strings |

for example, here's how the output could look like:

```js
{
  res: "Lorem ipsum dolor sit&nbsp;amet",
  ranges: [
    [21, 27, "&nbsp;"]
  ],
  log: {
    timeTakenInMiliseconds: 42
  },
  whatWasDone: {
    removeWidows: true,
    convertEntities: false
  }
}
```

{% include "btt.njk" %}

## The Use

We use `string-extract-class-names` to extract all the CSS class and id names from HTML/CSS in the library [email-comb](/os/email-comb/) which detects and deletes the unused CSS styles.

{% include "btt.njk" %}

## Bracket notation

Normally, classes or id's in css include dots/hashes, for example, `div.first-class.second-class`. Those dots and hashes end up covered by indexes under `ranges` key:

```js
import { extract } from "string-extract-class-names";
const res = extract("div.first-class.second-class");
console.log(res);
// => {
//      res: [".first-class", ".second-class"],
//      ranges: [
//        [3, 15],
//        [15, 28],
//      ],
//    }
```

Dots above are at indexes `3` and `15`.

However, this program also supports the bracket notation - instead of `td.croodles` one can say `td[class="croodles"]`. It used to be the way how email templates were setting CSS because of [Yahoo](https://github.com/hteumeuleu/email-bugs/issues/49). Not any more, but this program still supports bracket notation:

```js
import { extract } from "string-extract-class-names";
const str = `td[id=" abc-def "]`
const res = extract(str);
console.log(res);
// => {
//      res: ["#abc-def"],
//      ranges: [[8, 15]],
//    }

// however

console.log(str.slice(8, 15));
// => "abc-def"
// notice there's no hash if you slice the source
// because it didn't exist at the first place
```

In "normal" CSS where dots and hashes do exist, the `res` output will match what could be mapped against `String.prototype.slice()` (as seen in examples):

```js
assert.deepEqual(
  res,
  ranges.map(([from, to]) => str.slice(from, to))
);
```

{% include "btt.njk" %}
