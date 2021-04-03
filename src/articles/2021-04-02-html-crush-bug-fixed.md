---
title: "`html-crush` bug fixed"
date: '2021-04-02'
image: "011"
packages:
  - html-crush
  - babel
tags:
  - js
---

One line in Babel config, `env` preset's `loose` set to [true](https://babeljs.io/docs/en/babel-preset-env#loose) was causing a spread operator to disappear on only CommonJS builds (not ES Modules or UMD), which led to broken logic (program could not calculate `opts.breakToTheLeftOf` correctly any more), program inserted extra blank lines. A crazy bug, isn't it?

---

## Situation

The `html-crush` TypeScript source:

```js
if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
  breakToTheLeftOfFirstLetters = [
    ...new Set(opts.breakToTheLeftOf.map((val) => val[0])),
  ].join("");
}
```

used to get transpiled into ESM (ES Modules, code with `import`/`export`):

```js
if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
  breakToTheLeftOfFirstLetters = [...new Set(opts.breakToTheLeftOf.map(val => val[0]))].join("");
}
```

but, CJS (CommonJS, code with `require`) was transpiled into:

```js
if (Array.isArray(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
  breakToTheLeftOfFirstLetters = [].concat(new Set(opts.breakToTheLeftOf.map(function (val) {
    return val[0];
  }))).join("");
}
```

The `...`, ES6 spread operator disappears!!!

## Cause

It was just mis-configured Babel, `loose: true,` line below:

```js
// babel.config.js
const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/env",
      {
        targets: {
          browsers: ["ie >= 11"],
        },
        exclude: ["transform-async-to-generator", "transform-regenerator"],
        modules: false,
        loose: true, // <----------- !!!
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
    NODE_ENV === "test" && "@babel/transform-modules-commonjs",
  ].filter(Boolean),
};
```

Once `loose` is disabled, all works fine again!

By the way, Babel [documentation](https://babeljs.io/docs/en/babel-preset-env#loose) describes `loose` very briefly:

> Enable "loose" transformations for any plugins in this preset that allow them.

I didn't expect this.

## Learning

Especially for large, important open source packages, in unit tests, it's wise to test all the builds: ESM, UMD and CJS. "If it quacks like a duck..." — there are no mysteries in programs, either tests pass, or they don't. In theory, unit-testing all builds should safeguard against errors in the build configs. I set up every single unit test in `html-crush` to check all three builds: UMD, CJS and ESM.

## Conclusion

Thanks for [Romain Vincent](https://github.com/SylannBin) for raising the GitHub [issue](https://github.com/codsen/codsen/issues/5). And sorry to everybody who encountered it.
