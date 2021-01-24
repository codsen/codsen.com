---
layout: package
title: json-variables
---

## Purpose

It lets you DRY the plain objects (JSON files contents) — any special marker in any value can reference other values by path. As a result, there's only one reference of each value, even though, values are used in many places. That's [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) concept.

{% include "btt.njk" %}

## Features

- [`object-path`](https://www.npmjs.com/package/object-path) notation (arrays use dots too: `data.array.1` instead of `data.array[1]`)
- `*_data` keys to dump the data nearby (customiseable naming pattern)
- Detects existing [heads and tails](/os/string-find-heads-tails/) — it won't wrap twice
- Battle-tested, used in production to manage email templates

{% include "btt.njk" %}

## API

::: api
jVar(inputObj, [opts])
:::

In other words, the main export is a function which takes two input arguments, `inputObj` and optional plain object `opts` (square brackets above mean "optional").

{% include "btt.njk" %}

### API - Input

| Input argument | Type                            | Obligatory? | Description                         |
| -------------- | ------------------------------- | ----------- | ----------------------------------- |
| `inputObj`       | Parsed JSON contents: typically a plain object | yes         | The source to work upon. |
| `opts`         | Plain object                    | no          | A plain object containing settings. |

{% include "btt.njk" %}

### API - Options

| `options` object's key                 | Type                       | Obligatory? | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | -------------------------- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heads`                                | String                     | no          | `%%_`   | How do you want to mark the beginning of a variable?                                                                                                                                                                                                                                                                                                                                                                         |
| `tails`                                | String                     | no          | `_%%`   | How do you want to mark the ending of a variable?                                                                                                                                                                                                                                                                                                                                                                            |
| `headsNoWrap`                          | String                     | no          | `%%-`   | How do you want to mark the beginning of a variable, which you definitely don't want to be wrapped?                                                                                                                                                                                                                                                                                                                          |
| `tailsNoWrap`                          | String                     | no          | `-%%`   | How do you want to mark the ending of a variable, which you definitely don't want to be wrapped?                                                                                                                                                                                                                                                                                                                             |
| `lookForDataContainers`                | Boolean                    | no          | `true`  | You can put a separate dedicated key, named similarly, where the values for variables are placed.                                                                                                                                                                                                                                                                                                                            |
| `dataContainerIdentifierTails`         | String                     | no          | `_data` | If you do put your variables in dedicated keys besides, those keys will have to be different somehow. We suggest appending a string to the key's name — tell here what string.                                                                                                                                                                                                                                               |
| `wrapHeadsWith`                        | String                     | no          | n/a     | We can optionally wrap each resolved string with a string. One to the left is called "heads", please tell what string to use.                                                                                                                                                                                                                                                                                                |
| `wrapTailsWith`                        | String                     | no          | n/a     | We can optionally wrap each resolved string with a string. One to the right is called "tails", please tell what string to use.                                                                                                                                                                                                                                                                                               |
| `dontWrapVars`                         | Array of strings OR String | no          | n/a     | If any of the variables (surrounded by `heads` and `tails`) can be matched by string(s) given here, it won't be wrapped with `wrapHeadsWith` and `wrapTailsWith`. You can put **wildcards** (\*) to note zero or more characters.                                                                                                                                                                                            |
| `preventDoubleWrapping`                | Boolean                    | no          | `true`  | If you use `wrapHeadsWith` and `wrapTailsWith`, we can make sure the existing string does not contain these already. It's to prevent double/triple/multiple wrapping.                                                                                                                                                                                                                                                        |
| `wrapGlobalFlipSwitch`                 | Boolean                    | no          | `true`  | Global flip switch to turn off the variable wrapping function completely, everywhere.                                                                                                                                                                                                                                                                                                                                        |
| `noSingleMarkers`                      | Boolean                    | no          | `false` | If any value in the source object has only and exactly heads or tails: a) do throw mismatched marker error (`true`) or b) don't (`false`)                                                                                                                                                                                                                                                                                    |
| `resolveToBoolIfAnyValuesContainBool`  | Boolean                    | no          | `true`  | The very first moment Boolean is merged into a string value, it turns the whole value to its value. Permanently. Nothing else matters. When `false` and there's a mix of Strings and Booleans, Boolean is resolved into empty string. When the value is just a reference marker, upon resolving it will be intact Boolean. This setting is relevant when there's mixing of strings and Booleans - what to do in those cases. |
| `resolveToFalseIfAnyValuesContainBool` | Boolean                    | no          | `true`  | When there's a mix of string and Boolean, resolve to `false`, no matter if the first encountered value is `true`. When there's no mix with strings, the value is retained as it was.                                                                                                                                                                                                                                         |
| `throwWhenNonStringInsertedInString`   | Boolean                    | no          | `false` | By default, if you want you can put objects as values into a string, you'll get `text text ... [object Object] text text ...`. If you want the renderer to `throw` an error instead when this happens, set this setting's key to `true`.                                                                                                                                                                                     |
| `allowUnresolved`                      | Boolean or String          | no          | `false` | Normally, if a variable can't be resolved, program throws an error. If you prefer missing values to resolve to a string, set it here. Putting `true` resolves to an empty string.                                                                                                                                                                                                                                            |

All **defaults** in one place:

```js
{
  heads: '%%_',
  tails: '_%%',
  headsNoWrap: '%%-',
  tailsNoWrap: '-%%',
  lookForDataContainers: true,
  dataContainerIdentifierTails: '_data',
  wrapHeadsWith: '',
  wrapTailsWith: '',
  dontWrapVars: [],
  preventDoubleWrapping: true,
  wrapGlobalFlipSwitch: true,
  noSingleMarkers: false,
  resolveToBoolIfAnyValuesContainBool: true,
  resolveToFalseIfAnyValuesContainBool: true,
  throwWhenNonStringInsertedInString: false
  allowUnresolved: false
}
```

{% include "btt.njk" %}

### API - Output

It returns the same thing you passed, only with variables resolved. As you know, JSON allows all valid types to be inside a file, for example an array. If you pass JSON where outermost container is array, that's what this program will return.

{% include "btt.njk" %}

## Use examples

If you don't care how to mark the variables, use our notation, `%%_`, to mark a beginning of a variable (further called _heads_) and `_%%` to mark ending (further called _tails_).

Check this:

```js
const jv = require("json-variables");
var res = jVar({
  a: "some text %%_var1_%% more text %%_var2_%%",
  b: "something",
  var1: "value1",
  var2: "value2",
});
console.log("res = " + JSON.stringify(res, null, 4));
// ==> {
//       a: 'some text value1 more text value2',
//       b: 'something',
//       var1: 'value1',
//       var2: 'value2'
//     }
```

You can declare your way to mark variables, your own _heads_ and _tails_. For example, `{` and `}`:

```js
const jv = require("json-variables");
var res = jVar(
  {
    a: "some text {var1} more text {var2}",
    b: "something",
    var1: "value1",
    var2: "value2",
  },
  {
    heads: "{",
    tails: "}",
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text value2',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

You can also wrap all resolved variables with strings, a new pair of _heads_ and _tails_, using `opts.wrapHeadsWith` and `opts.wrapTailsWith`. For example, bake some Java, wrap your variables with `${` and `}`:

```js
const jv = require("json-variables");
var res = jVar(
  {
    a: "some text %%_var1_%% more text %%_var2_%%",
    b: "something",
    var1: "value1",
    var2: "value2",
  },
  {
    wrapHeadsWith: "${",
    wrapTailsWith: "}",
    dontWrapVars: ["*zzz", "*3", "*6"],
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text ${value1} more text ${value2}',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

If variables reference keys which have values that reference other keys, that's fine. Just ensure there's _no closed loop_. Otherwise, renderer will `throw` and error.

```js
const jv = require("json-variables");
var res = jVar({
  a: "%%_b_%%",
  b: "%%_c_%%",
  c: "%%_d_%%",
  d: "%%_e_%%",
  e: "%%_b_%%",
});
console.log("res = " + JSON.stringify(res, null, 4));
// THROWS because "e" loops to "b" forming an infinite loop.
```

This one's OK:

```js
const jv = require("json-variables");
var res = jVar({
  a: "%%_b_%%",
  b: "%%_c_%%",
  c: "%%_d_%%",
  d: "%%_e_%%",
  e: "zzz",
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'zzz',
//      b: 'zzz',
//      c: 'zzz',
//      d: 'zzz',
//      e: 'zzz'
//    }
```

Variables can also reference deeper levels within objects and arrays — just put dot like `variable.key.subkey`:

```js
const jv = require("json-variables");
var res = jVar(
  {
    a: "some text %%_var1.key1_%% more text %%_var2.key2_%%",
    b: "something",
    var1: { key1: "value1" },
    var2: { key2: "value2" },
  },
  {
    wrapHeadsWith: "%%=",
    wrapTailsWith: "=%%",
    dontWrapVars: ["*zzz", "*3", "*6"],
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text %%=value1=%% more text %%=value2=%%',
//      b: 'something',
//      var1: {key1: 'value1'},
//      var2: {key2: 'value2'}
//    }
```

{% include "btt.njk" %}

### Data containers

Data-wise, if you looked at a higher level, it might appear clunky to put values as _separate values_, like in examples above. Saving you time scrolling up, check this out:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  b: 'something',
  var1: 'value1',
  var2: 'value2'
}
```

Does this look like clean data arrangement? Hell no. It's convoluted and nasty. The keys `var1` and `var2` are not of the same status as an `a` and `b`, therefore can't be mashed together at the same level, can it?

What if we placed all key's `a` variables within a separate key, `a_data` — it starts with the same letter, so it will end up being nearby the `a` after sorting. Observe:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  a_data: {
    var1: 'value1',
    var2: 'value2'
  },
  b: 'something'
}
```

That's better, isn't it? We think so too.

To set this up, you can rely on our default way of naming data keys (appending `_data`) or you can customise how to call data keys using `opts.dataContainerIdentifierTails`. On the other hand, you can also turn off this function completely via `opts.lookForDataContainers` and force all values to be the keys at the same level as the current variable's key.

```js
const jv = require("json-variables");
var res = jVar({
  a: "some text %%_var1_%% more text %%_var3_%%.",
  a_data: {
    var1: "value1",
    var3: "333333",
  },
  b: "something",
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text 333333.',
//      b: 'something',
//      a_data: {
//        var1: 'value1',
//        var3: '333333'
//      }
//    }
```

Data container keys can also contain objects or arrays. Just query the whole path:

```js
const jv = require("json-variables");
var res = jVar({
  a: "some text %%_var1.key1.key2.key3_%% more text %%_var3_%%.",
  a_data: {
    var1: { key1: { key2: { key3: "value1" } } },
    var3: "333333",
  },
  b: "something",
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text 333333.',
//      b: 'something',
//      a_data: {
//        var1: {key1: {key2: {key3: 'value1'}}},
//        var3: '333333'
//      }
//    }
```

{% include "btt.njk" %}

### Ignores with wildcards

You can ignore the wrapping on any keys by supplying their name patterns in the options array, `dontWrapVars` value. It can be array or string and also it can contain wildcards:

```js
const jv = require("json-variables");
var res = jVar(
  {
    a: "%%_b_%%",
    b: "%%_c_%%",
    c: "val",
  },
  {
    wrapHeadsWith: "{",
    wrapTailsWith: "}",
    dontWrapVars: ["b*", "c*"],
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'val', <<< didn't get wrapped
//      b: 'val', <<< also didn't get wrapped
//      c: 'val'
//    }
```

{% include "btt.njk" %}

### Wrapping

**Challenge:**

> How do you wrap one instance of a variable, but not another, when both are in the same string?

**Solution**: Alternative `heads` and `tails`, which are always non-wrapping: `opts.headsNoWrap` and `opts.tailsNoWrap`. Default values are: `%%-` and `-%%`. You can customise them to anything you want.

For example:

```json
{
  "key": "%%-firstName-%% will not get wrapped but this one will: %%_firstName_%%",
  "firstName": "John"
}
```

When processed with options `{ wrapHeadsWith: '{{ ', wrapTailsWith: ' }}' }`, it will be:

```json
{
  "key": "John will not get wrapped but this one will: {{ John }}",
  "firstName": "John"
}
```

{% include "btt.njk" %}

#### In practice:

{% raw %}

Wrapping of the variables is an essential feature when working with data structures that need to be adapted for both back-end and front-end. For the development, preview build you might want `John` as a first name, but for back-end build, you might want `{{ user.firstName }}`.

The following example shows how to "bake" HTML sprinkled with [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) notation (or any members of Jinja-like templating languages that use double curly braces):

HTML template:

```html
<div>{{ hero_title_wrapper }}</div>
```

JSON for DEV build (a preview build to check how everything looks):

```json
{
  "hero_title_wrapper": "%%_hero_title_%%",
  "hero_title": "Hi %%_first_name_%%, check out our seasonal offers!",
  "hero_title_alt": "Hi, check out our seasonal offers!",
  "first_name": "John"
}
```

In the above, `hero_title_wrapper` basically redirects to `hero_title`, which pulls `John` as a first name. The alternative title's text is used when `first_name` is missing.

JSON for PROD version is minimal, only overwriting what's different/new (to keep it DRY):

```json
{
  "first_name": "user.firstName"
}
```

We'll process the [merged](/os/object-merge-advanced/) object of DEV and PROD JSON contents using `{ wrapHeadsWith: '{{ ', wrapTailsWith: ' }}' }`, which instructs to wrap any resolved variables with `{{` and `}}`.

In the end, our baked HTML template, ready to be put on the back-end will look like:

```html
<div>{{ user.firstName }}, check out our seasonal offers!</div>
```

So far so good, but what happens if we want to add a check, does `first_name` exist? Again in a Nunjucks templating language, it would be something like:

content JSON for PROD build:

```json
{
  "hero_title_wrapper": "{% if %%_first_name_%% %}%%_hero_title_%%{% else %}%%_hero_title_alt_%%{% endif %}",
  "first_name": "user.firstName"
}
```

with intention to bake the following HTML:

HTML template:

```html
<div>
  {% if user.firstName %}Hi {{ user.firstName }}, check out our seasonal
  offers!{% else %}Hi, check out our seasonal offers!{% endif %}
</div>
```

Now notice that in the example above, the first `first_name` does not need to be wrapped with `{{` and `}}` because it's already in a Nunjucks statement, but the second one _does need to be wrapped_.

You solve this by using non-wrapping `heads` and `tails`. Keeping default values `opts.wrapHeadsWith` and `opts.wrapTailsWith` it would look like:

content JSON for PROD build:

```json
{
  "hero_title_wrapper": "{% if %%-first_name-%% %}%%_hero_title_%%{% else %}%%_hero_title_alt_%%{% endif %}",
  "first_name": "user.firstName"
}
```

Notice `%%-first_name-%%` above. The non-wrapping heads and tails instruct the program to **skip wrapping, no matter what**.

{% endraw %}
{% include "btt.njk" %}

### Mixing Booleans and strings

Very often, in email templating, the inactive modules are marked with Boolean `false`. When modules have content, they are marked with strings. There are cases when you want to resolve the whole variable to Boolean if upon resolving you end up with a mix of strings and Booleans.

When `opts.resolveToBoolIfAnyValuesContainBool` is set to `true` (default), it will always resolve to the value of the first encountered Boolean value. When set to `false`, it will resolve Booleans to empty strings.

When `opts.resolveToFalseIfAnyValuesContainBool` and `opts.resolveToBoolIfAnyValuesContainBool` are set to `true` (both defaults), every mix of string(s) and Boolean(s) will resolve to Boolean `false`. If `opts.resolveToBoolIfAnyValuesContainBool` is set to false, but `opts.resolveToFalseIfAnyValuesContainBool` to true, the mixes of strings and Booleans will resolve to the value of the first encountered Boolean variable's value.

Observe:

```js
var res = jVar({
  a: "zzz %%_b_%% zzz",
  b: true,
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: false, // <<< It's because opts.resolveToFalseIfAnyValuesContainBool is default, true
//      b: true
//    }
```

```js
var res = jVar(
  {
    a: "zzz %%_b_%% zzz",
    b: true,
  },
  {
    resolveToFalseIfAnyValuesContainBool: false,
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: true, <<< It's because we have a mix of string and Boolean, and first encountered Boolean value is `true`
//      b: true
//    }
```

{% include "btt.njk" %}
