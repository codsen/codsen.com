---
layout: package
title: eslint-plugin-row-num
---

## Setup

First, make sure `eslint` itself is installed among the dev dependencies. "`i`" below means `install`, "`-D`" below means "dev dependency" (as opposed to a normal dependency). Quick refresher — when you publish an npm package and somebody installs it, its dev dependencies don't get installed when they `npm i` your package. That's the point of separating dev and normal dependencies.

Both `eslint` and `eslint-plugin-row-num` are for your program's testing, so we install them as "dev" dependencies, via `-D` flag:

```bash
npm i -D eslint
npm i -D eslint-plugin-row-num
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
"row-num/correct-row-num": "error",
```

means:

"set the rule "correct-row-num" from plugin "row-num" (which comes from npm package "eslint-plugin-row-num") to report findings at an "error" level.

{% include "btt.njk" %}

## Setup instructions

We need to add `row-num` to the plugins section of your `.eslintrc` configuration file, for example, here's a real config file we use — notice the `"row-num"` in `"plugins"` key:

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
    "plugin:row-num/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": ["row-num"],
  "ignorePatterns": [
    "**/eslint-plugin-row-num/rules/utils/**",
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
    "row-num/correct-row-num": "error",
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
    "row-num/correct-row-num": 2
  }
}
```

or

```json
{
  "rules": {
    "row-num/correct-row-num": "error"
  }
}
```

Both are the same thing.

{% include "btt.njk" %}

