---
title: An Observation Regarding TypeScript And Type Safety
date: '2021-03-11'
image: "010"
packages:
  - typescript
tags:
  - js
  - ts
---

Consider a function written in TS, which multiplies two numbers:

---

```ts
// mult.ts
function mult(num1: number, num2: number): number {
  return num1 * num2;
}
```

It takes two numbers, multiplies them and returns a number.

When we ship this program "to production", when it's transpiled to JavaScript, we will get it transpiled [into](https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABAWxAGygCjCZBGALkR2QCMBTAJwBpjcAmIkiygSidxcQG8AoASErkoISkhJ5EAKjrJ6Abl4BfIA):

```js
// mult.js
"use strict";
function mult(num1, num2) {
  return num1 * num2;
}
```

plus we'll get a definitions file:

```ts
// mult.d.ts
declare function mult(num1: number, num2: number): number;
```

Notice that TS didn't add add any hard-coded _throws_ such as:

```js
// mult.js
function mult(num1, num2) {
  if (typeof num1 !== "number") {
    throw new TypeError(`the first input argument is not a number but ${typeof num1}!`)
  }
  if (typeof num2 !== "number") {
    throw new TypeError(`the second input argument is not a number but ${typeof num2}!`)
  }
  return num1 * num2;
}
```

It's because TypeScript transpiles TS code into JS code, nothing more — if something didn't exist in your TS source code (like a type error `throw`), it won't exist in transpiled JS.

Yes, if your code editor is TS-aware, if all is set up right, when a user installs your package with `mult()` and tries to pass a string, the TS engine will refer to bundled type definitions and will complain and _probably_ will fail the build. In theory, if your end-user's code editor didn't understand the TS definitions file, if they're working in JS environment only, they might not get any error messages when passing strings to `mult()`!

## Takeaway

If you code in TypeScript, you still have to add type error throws if you want them to be thrown!

When I was learning TS, this was one of the unanswered questions of mine. I was asking, to what extent will TS improve your transpiled, end JavaScript code. The answer is, in built JS distribution files, in `dist/` folder, you won't find anything that you didn't put into the TS source.

Some people assumed that by switching to TS, they don't have to include any IF-ELSE type checks with _throws_ any more. They assumed that all end users who download packages from npm would either code in TS or would be using a code editor which "understands" bundled type definitions. But that was a wrong assumption, at least in the context of Open Source npm packages. Many things can go wrong — with type definitions, code editors, bundlers and so on. Good old hard-coded type checks and error _throws_ are still relevant in TS code.

In the case of Open Source programs, npm packages, you probably want to stick to your old practices; if you used to put type checks and _throws_ in JS, continue doing that after migrating to TS. That's the message I'd send to my past self in a time machine.
