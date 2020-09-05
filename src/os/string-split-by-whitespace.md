---
layout: package
title: string-split-by-whitespace
packages:
  - detergent
---

### Idea

Split by whitespace is easy - [use](https://stackoverflow.com/a/32727737/3943954) `String.split(/\s+/)`:

```js
console.log(JSON.stringify("abc  def ghi".split(/\s+/), null, 4));
// => [
//      "abc",
//      "def",
//      "ghi"
//    ]
```

But sometimes you need to ignore certain index ranges:

```js
const splitByW = require("string-split-by-whitespace");
const result = splitByW(`\n     \n    a\t \nb    \n      \t`);
console.log(JSON.stringify(result, null, 4));
// => ["a", "b"]
```

Above, we split the string by whitespace consisting of spaces, tabs and linebreaks.

{% include "btt.njk" %}

### API - Input

| Input argument | Type         | Obligatory? | Description                                       |
| -------------- | ------------ | ----------- | ------------------------------------------------- |
| `str`          | String       | yes         | Source string upon which to perform the operation |
| `opts`         | Plain object | no          | Optional Options Object, see below for its API    |

{% include "btt.njk" %}

### An Optional Options Object

| Optional Options Object's key | Type of its value                  | Default | Description                                                                                                                                                                 |
| ----------------------------- | ---------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignoreRanges`                | Array of zero or more range arrays | `[]`    | Feed zero or more string slice ranges, arrays of two natural number indexes, like `[[1, 5], [6, 10]]`. Algorithm will not include these string index ranges in the results. |

The `opts.ignoreRanges` can be an empty array, but if it contains anything else then arrays inside, error will be thrown.

{% include "btt.njk" %}

### API - Output

Program returns array of zero or more strings. Empty string yields empty array.

### `opts.ignoreRanges`

{% raw %}

Some basics first. When we say "heads" or "tails", we mean some templating literals that wrap a value. "heads" is frontal part, for example `{{` below, "tails" is ending part, for example `}}` below:

```
Hi {{ firstName }}!
```

Now imagine that we extracted _heads_ and _tails_ and we know their ranges: `[[3, 5], [16, 18]]`. (If you select `{{` and `}}` from in front of "Hi" to where each head and tail starts and ends, you'll see that these numbers match).

Now, imagine, we want to split `Hi {{ firstName }}!` into array `["Hi", "firstname", "!"]`.

For that we need to skip two ranges, those of a head and tail.

That's where `opts.ignoreRanges` become handy.

In example below, we used library [string-find-heads-tails](/os/string-find-heads-tails/) to extract the ranges of variables' _heads_ and _tails_ in a string, then split by whitespace:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const headsAndTails = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.headsEndAt]);
  acc.push([curr.tailsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res1 = split(input, {
  ignoreRanges: headsAndTails,
});
console.log(`res1 = ${JSON.stringify(res1, null, 4)}`);
// => ['some', 'interesting', 'text', 'and', 'some', 'more', 'text.']
```

You can ignore whole variables, from _heads_ to _tails_, including variable's names:

```js
const input = "some interesting {{text}} {% and %} {{ some more }} text.";
const wholeVariables = strFindHeadsTails(
  input,
  ["{{", "{%"],
  ["}}", "%}"]
).reduce((acc, curr) => {
  acc.push([curr.headsStartAt, curr.tailsEndAt]);
  return acc;
}, []);
const res2 = split(input, {
  ignoreRanges: wholeVariables,
});
// => ['some', 'interesting', 'text.']
```

We need to perform the array.reduce to adapt to the [string-find-heads-tails](/os/string-find-heads-tails/) output, which is in format (index numbers are only examples):

```js
[
  {
    headsStartAt: ...,
    headsEndAt: ...,
    tailsStartAt: ...,
    tailsEndAt: ...,
  },
  ...
]
```

and with the help of `array.reduce` we turn it into our format:

(first example with `res1`)

```js
[
  [headsStartAt, headsEndAt],
  [tailsStartAt, tailsEndAt],
  ...
]
```

(second example with `res2`)

```js
[
  [headsStartAt, tailsEndAt],
  ...
]
```

{% endraw %}
{% include "btt.njk" %}
