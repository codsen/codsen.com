---
layout: package
title: tap-parse-string-to-object
packages:
  - tap
---

## Idea

This library is a basic raw [Tap](https://node-tap.org/) parser, _string-to-object_.

It is aimed to parse Tap raw test output saved into files using `tap -o`.

Existing Tap parsers like [tap-parser](https://www.npmjs.com/package/tap-parser) are aimed at operations in the terminal; they consume piped output there and return streams.

This program is similar to `JSON.parse` except that it works synchronously and asynchronously, depending on what you give:

- if you (synchronously) give it a **string**, it will (synchronously) output a **plain object**
- if you (synchronously) give it a **stream** of a raw Tap string, it will output a promise of a **plain object**

In both cases, the plain object will look like this:

```js
{
  ok: true,
  assertsTotal: 8,
  assertsPassed: 8,
  assertsFailed: 0,
  suitesTotal: 2,
  suitesPassed: 2,
  suitesFailed: 0
}
```

It is not a comprehensive parser — it won't give you test names — but it will extract the totals of all asserts and all suites.

We are going to use it ourselves to compile stats of all our unit tests.

{% include "btt.njk" %}

## API

API depends on what you give as an input:

- if you (synchronously) provide a `string`, you'll (synchronously) receive a plain object
- if you provide (synchronously) provide a stream, you'll receive a promise of a plain object

The whole idea with streams is that raw test output files can be big — for example [`detergent`'s](/os/detergent/) raw Tap output is around 250MB, there are ~750,000 assertions there. Reading and processing such file synchronously would cripple even 8-core Intel i9 laptop. But the same file can be easily processed with streams.

However, we keep the string input as an alternative for peoples' convenience: maybe somebody just wants to play around and doesn't want to `await`? Be our guest — the synchronous result is given; just (synchronously) put a string into the inputs (promise yielding a string won't do).

In both cases, the result is similar to the described above:

```json
{
  ok: true,
  assertsTotal: 8,
  assertsPassed: 8,
  assertsFailed: 0,
  suitesTotal: 2,
  suitesPassed: 2,
  suitesFailed: 0
}
```

{% include "btt.njk" %}

## Async-use, With Streams and Promises

In real-world scenarios, async is preferred so this program takes _stream_, and returns a promise of a plain object:

```js
const fs = require("fs");
const path = require("path");
const parseRawTap = require("tap-parse-string-to-object");

// notice we put this async IIFE to be able to await the promise:
(async () => {
  // 1. define file's contents
  const filesContent = `TAP version 13
ok 1 - test/test.js # time=22.582ms { # Subtest: 01.01 - string input
ok 1 - 01.01.01
ok 2 - 01.01.02
1..2
ok 1 - 01.01 - string input # time=7.697ms

# Subtest: 01.02 - non-string input
ok 1 - 01.02.01
ok 2 - 01.02.02
ok 3 - 01.02.03
ok 4 - 01.02.04
ok 5 - 01.02.05
1..5
ok 2 - 01.02 - non-string input # time=2.791ms

1..2 # time=22.582ms
}

ok 2 - test/umd-test.js # time=16.522ms { # Subtest: UMD build works fine
ok 1 - should be equivalent
1..1
ok 1 - UMD build works fine # time=10.033ms

1..1 # time=16.522ms
}

1..2

# time=1816.082ms
`;

  // 2. write the test file
  await fs.writeFile(path.resolve("sampleTestStats.md"), filesContent);

  // 3. now read it again, but as a stream
  const contentsAsStream = fs.createReadStream(
    path.resolve("sampleTestStats.md")
  );

  // 4. a promise (which we await) is returned and it yields a plain object:
  const result = await parse(contentsAsStream);
  console.log(JSON.stringify(result, null, 4));
  // => {
  //      ok: true,
  //      assertsTotal: 8,
  //      assertsPassed: 8,
  //      assertsFailed: 0,
  //      suitesTotal: 2,
  //      suitesPassed: 2,
  //      suitesFailed: 0
  //    }
})();
```

{% include "btt.njk" %}

## Parser's Algorithm

We wrote our own little parser. In essence, it counts all lines that (when trimmed) start with "ok" and "not ok", with condition that those lines are consecutive and located after a line which contains a string "# Subtest".

Each opening curlie brace bumps the suite count.

The exception for all above is chunks we skip — everything between line with three dashes (`---`) and line with three dots (`...`).

{% include "btt.njk" %}
