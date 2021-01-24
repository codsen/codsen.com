---
layout: package
title: eslint-plugin-test-num
packages:
  - tap
---

## Purpose

Giving unique number for each unit test allows us to find it quicker. Compare:

![no message in a test](/images/eslint-plugin-test-num_msg_01.png)

vs

![text message](/images/eslint-plugin-test-num_msg_02.png)

vs

![unique identifier number](/images/eslint-plugin-test-num_msg_03.png)

For example, here's a real-life terminal output, [`codsen-parser`](/os/codsen-parser/) unit tests, [tap](https://www.npmjs.com/package/tap) unit test runner:

![unit tests with numbers](/images/codsen-article-test-num.png)

We can quickly identify tests `11`, `12`, `13`, `14` and `15` by a number. If we used test's descriptions as the only means to identify it, it would be way harder to find their location.

But notice there were **104 tests** above!

{% include "btt.njk" %}

## Idea

Let's put an identifier number in the test's title and in the test's message:

![bunch of numbers to maintain](/images/eslint-plugin-test-num_msg_00.png)

This is an ESLint rule which automatically updates those numbers.

{% include "btt.njk" %}

## Setup

See our [current ESLint config](https://github.com/codsen/codsen/blob/main/.eslintrc.json).

First, make sure `eslint` itself is installed among the dev dependencies. "`i`" below means `install`, "`-D`" below means "dev dependency" (as opposed to a normal dependency). Quick refresher — when you publish an npm package and somebody installs it, its dev dependencies don't get installed when they `npm i` your package. That's the essence of how dev and normal dependencies differ.

Both `eslint` and `eslint-plugin-test-num` are for your program's testing, so we install them as "dev" dependencies, via `-D` flag:

```bash
npm i -D eslint
npm i -D eslint-plugin-test-num
```

{% include "btt.njk" %}

## Some basics

Then, you need to configure ESLint to use the plugin.

As you know, ESLint is _pluggable_ which is the reason why it won over predecessors JSLint and JSHint — ESLint runs only the rules you asked for, and at the warning levels you asked for.

We need to do the _asking_.

We'll use an ESLint [configuration file](https://eslint.org/docs/user-guide/configuring). If you don't have a config file yet, you can nip the config file from another project and tweak it or, you can use initiation script `eslint --init`. Mind you, eslint configs are dot files which are hidden by the system. It's best practice [to make them visible](https://lmgtfy.com/?q=show+dot+files+in+mac).

But now, some basics first.

For example, the following rule configuration row:

```
"test-num/correct-test-num": "error",
```

means:

"set the rule "correct-test-num" from plugin "test-num" (which comes from npm package "eslint-plugin-test-num") to report findings at an "error" level.

{% include "btt.njk" %}

## Setup instructions

We need to add `test-num` to the plugins section of your `.eslintrc` configuration file, for example, here's a real config file we use — notice the `"test-num"` in `"plugins"` key:

```json
{
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:test-num/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["test-num"],
  "ignorePatterns": [
    "**/eslint-plugin-test-num/rules/utils/**",
    "**/dist/**",
    "rollup.config.js",
    "**/tap/**"
  ],
  "rules": {
    "curly": "error",
    "no-constant-condition": [
      "error",
      {
        "checkLoops": false
      }
    ],
    "no-else-return": "error",
    "no-inner-declarations": "error",
    "no-unneeded-ternary": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "one-var": ["error", "never"],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "test-num/correct-test-num": "error",
    "strict": "error",
    "symbol-description": "error",
    "yoda": [
      "error",
      "never",
      {
        "exceptRange": true
      }
    ]
  }
}
```

Reciting the ESLint documentation, rules can have different settings:

> "off" or 0 - turn the rule off
>
> "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
>
> "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
>
> https://eslint.org/docs/user-guide/configuring#configuring-rules

Which means, you can put `2` (as number, without quotes) or `"error"` (as string, so with quotes):

```json
{
  "rules": {
    "test-num/correct-test-num": 2
  }
}
```

or

```json
{
  "rules": {
    "test-num/correct-test-num": "error"
  }
}
```

Both are the same thing.

{% include "btt.njk" %}

## PS.

Check out: [`eslint-plugin-row-num`](/os/eslint-plugin-row-num/) - it updates `console.log` row numbers so you know where exactly did that `console.log` came from. It's especially relevant when you Rollup your programs and tests are ran against a file different from source from which `console.log` originate.

{% include "btt.njk" %}
