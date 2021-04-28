---
title: "rollup vs esbuild:<br/>`iife` is not `umd`"
date: "2021-04-04"
image: "012"
packages:
  - esbuild
  - rollup
tags:
  - js
  - ts
---

Rollup, Webpack, and new _esbuild_ can bundle JS programs to be usable in webpages, to be added as a `<script>`. However, there's a problem with _esbuild_.

---

It [produces](https://esbuild.github.io/api/#format) `iife` builds for browsers, not `umd`.

You might ask, what's the difference? They both work as intended in browsers, right?

Yes, but you can't `import`/`require` _esbuild_ `iife` bundles and **unit test them**:

```js
// test.js
import { stripHtml } from "../dist/string-strip-html.dev.umd";

// run unit tests on this stripHtml()
```

If we can't unit test **all the builds**&nbsp;— programs we produce&nbsp;— there's no way to completely guarantee the quality.

I've just had fixed a [hardcore bug](/articles/html-crush-bug-fixed/) in CJS builds, caused by a single misconfigured line in Babel, `loose` set to `true`. Rollup built fine, except Babel was casually omitting spread operators here and there, in CJS builds only. All that time, ESM and UMD builds were fine. It just happened that I was _assuming_ CJS will be solid; it should not break, at least without ESM failing too. Wrong.

Furthermore, since I write unit tests anyway, I can easily repurpose unit tests to **check all three builds** instead of one. All I need to do is to pipe them through an [intermediary helper function](https://github.com/codsen/codsen/blob/main/packages/html-crush/test/util/util.js), calculate a result for each build, compare them to ensure they all match, then return the result of `esm` build for further consumption in unit test asserts.

It's easy in `tap`/`ava` the unit test runners, although commonly-used Jest does not pass `t`, the main test [instance](https://jestjs.io/docs/api#testname-fn-timeout) so bad news Jest users. Basically, instead of:

```js
test('did not rain', () => {
  expect(inchesOfRain(value)).toBe(0);
});
```

We'd tap the test's instance, `t`, which in hypothetical Jest case would look like:

```js
test('did not rain', (t) => {
  t.expect(inchesOfRain(t, value)).toBe(0);
});
```

In real `tap` tests, it would rather resemble:

```js
tap.test('did not rain', (t) => {
  t.equal(inchesOfRain(t, value), 0);
});
```

And `inchesOfRain()` would add extra asserts, like doing extra calculations against different builds, then assert their differences, then return the result as normal.

Again, this shows how different programming and SPA web development workflows are — even unit test runner principles are different.

## Takeaway

The _esbuild_ `iife` builds are not [umd](https://github.com/umdjs/umd) builds, `iife` builds can't be unit-tested, unlike Rollup's `umd`. It's a big deal.
