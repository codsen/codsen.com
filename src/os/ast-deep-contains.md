---
layout: package
title: ast-deep-contains
packages:
  - emlint
  - codsen-tokenizer
  - codsen-parser
---

## Purpose

This is a fancy assertion to match arrays of objects, where order doesn't matter and the reference objects might have extra keys. This program really tries to find matches.

We had a situation in [`emlint`](/os/emlint/) — error objects come in asynchronous fashion so their order is pretty _random_. Yet, we want to assert, does the error array contain error object X.

Another consideration is that result error object might have extra keys we don't care to match — for example, row and column numbers.

```js
[
  {
    ruleId: "tag-is-present",
    line: 1, // not present in matched object
    column: 4, // not present in matched object
    severity: 2, // not present in matched object
    idxFrom: 0,
    idxTo: 4,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[0, 4]],
    },
  }
]
```

vs

```js
[
  {
    ruleId: "tag-is-present",
    idxFrom: 43,
    idxTo: 48,
    message: "h1 is not allowed.",
    fix: {
      ranges: [[43, 48]],
    },
  },
];
```

Notice how above we don't bother with `line` and `column` values, as well as `severity`. Also, note that key structure is very similar, yet objects are in a wrong order (because rules were raised in such way).

Ava's `t.deepEqual` is exact match so 1) missing keys and 2) wrong object order in the array would be an issue.

Tap's `t.same` would match set/subset keys but would still not be able to detect that two objects are in a wrong order.

Solution is this package.

It will try to match which object is the most similar to the source's, then will not raise errors if source has extra keys.

Matching is passed to your chosen assertion functions, most likely `t.is` and `t.fail`.

{% include "btt.njk" %}

## Example \#1 — checking subset of keys only

Here is reduced example based on [`codsen-tokenizer`](/os/codsen-tokenizer/) tests:

```js
const t = require("tap");
import ct from "codsen-tokenizer";
import deepContains from "ast-deep-contains";

test("01.01 — text-tag-text", (t) => {
  const gathered = [];
  ct("  <a>z", (obj) => {
    gathered.push(obj);
  });

  deepContains(
    gathered,
    [
      {
        type: "text",
        start: 0,
        end: 2,
        // <---- tokenizer reports way more keys than that
      },
      {
        type: "html",
        start: 2,
        end: 5,
      },
      {
        type: "text",
        start: 5,
        end: 6,
      },
    ],
    t.is, // each pair of keys is ran by this function
    t.fail // major failures are pinged to this function
  );
});
```

In example above, reported objects will have more keys than what's compared. Throughout the time, when improving the tokenizer we will surely add even more new keys. All this should not affect the main keys. Using `t.same` would be a nuisance — we'd have to update all unit tests each time after a new improvement to the tokenizer is done, new key is added.

{% include "btt.njk" %}

## Example \#2 — matching array contents, order is random

Our linter [`emlint`](/os/emlint/) is pluggable — each rule is a plugin and program's architecture is based on the Observer patten — the main checking function in EMLint is extending the Node's `EventEmitter` class:

```js
class Linter extends EventEmitter {
  ...
}
```

This means, the nature in which errors are raised is somewhat _undetermined_. In EMLint unit tests we want to check, were correct errors raised and would the proposed string fixing index ranges fix the input.

Same way with the yard's dog and cat example, we don't care about the _order_ of the pets (linter error objects) — as long each one of the set is reported, happy days.

Behold - a program flags up two backslashes on a void HTML tag — the first backslash should be deleted, second one turned into normal slash — we don't care about the order of the elements as long as all elements were matched, plus there might be extra keys in the source objects — source objects are superset of what we're matching:

```js
const t = require("tap");
import { Linter } from "emlint";
import deepContains from "ast-deep-contains"; // <------------ this program
import { applyFixes } from "t-util/util";

const BACKSLASH = "\u005C";

t.test(
  `06.01 - ${`\u001b[${36}m${`both sides`}\u001b[${39}m`} - extreme case`,
  (t) => {
    const str = `<${BACKSLASH}br${BACKSLASH}>`;
    const linter = new Linter();
    // call the linter and record the result's error messages:
    const messages = linter.verify(str, {
      rules: {
        tag: 2,
      },
    });
    // assertion:
    deepContains(
      messages,
      [
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 1,
          idxTo: 2,
          message: "Wrong slash - backslash.",
          fix: {
            ranges: [[1, 2]],
          },
          // <---- "messages" we're comparing against will have more keys but we don't care
        },
        {
          ruleId: "tag-closing-backslash",
          severity: 2,
          idxFrom: 4,
          idxTo: 5,
          message: "Replace backslash with slash.",
          fix: {
            ranges: [[4, 5, "/"]],
          },
        },
      ],
      t.is, // each pair of key values is ran by this function
      t.fail // major failures are pinged to this function
    );
  }
);
```

The order in which backslashes will be reported does not matter, plus Linter might report more information — that's welcomed but will be ignored, not a cause for error.

{% include "btt.njk" %}

## API

**{{ packageJsons["ast-deep-contains"].lect.req }}(tree1, tree2, cb, errCb\[, opts])**

in other words, it's a function which takes 5 input arguments:

| Input argument | Type                                        | Obligatory? | Description                                                                                                            |
| -------------- | ------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `tree1`        | reference AST, can be superset of `tree2`   | yes         | Array, object or nested thereof                                                                                        |
| `tree2`        | AST being checked, can be subset of `tree1` | yes         | Array, object or nested thereof                                                                                        |
| `cb`           | function                                    | yes         | This function will be called with pairs, of values from each path. Think `t.is` of AVA. See API below.                 |
| `errCb`        | function                                    | yes         | If path does not exist on `tree1`, this callback function will be called with a message string. Think `t.fail` of AVA. |
| `opts`         | Plain object                                | no          | Optional plain object containing settings, see API below.                                                              |

Program returns `undefined` because it's operated by callbacks.

{% include "btt.njk" %}

### Options object

| `options` object's key  | Type    | Default | Description                                                                                                                                                            |
| ----------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `skipContainers`        | Boolean | `true`  | During traversal, containers (arrays and objects) will be checked for existence and traversed further but callback won't be pinged. Set to `false` to stop doing that. |
| `arrayStrictComparison` | Boolean | `false` | Objects in the array can be of random order, as long as each one is matched, order does not matter. For strict order, set to `true`.                                   |

Here is the defaults object, in one place, if you need to copy it:

```js
{
  skipContainers: true,
  arrayStrictComparison: false
}
```

{% include "btt.njk" %}

### `opts.skipContainers`

Consider these two AST's, for example:

Object 1:

```json
{
  "a": {
    "b": "c"
  }
}
```

Object 2:

```json
{
  "a": {
    "b": "d"
  }
}
```

During traversal, _monkey_ will check for existence of path "a" on Object 1 but won't report the values `{"b": "c"}` and `{"b": "d"}`. This way, when using this program in unit test context, AVA's `t.is` can be passed and we would be matching the values only. Missing paths would get reported to AVA's `t.fail`.

Let me repeat, no matter the setting on `opts.skipContainers`, in example above, the existence of the `a` will be checked, it's just that the values, objects, won't be passed to a callback, because they might be not equal either — first one might be superset!

{% include "btt.njk" %}

### API's Output

Output is `undefined` — this program is used exclusively through callbacks. Those do the job — function does not return anything.
