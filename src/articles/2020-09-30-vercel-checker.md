---
title: Automated Vercel Redirect Maintenance on Eleventy
date: "2020-09-30"
image: "007"
packages:
  - vercel
  - "@11ty/eleventy"
tags:
  - vercel
  - meta
  - eleventy
---

Vercel, our static website hosting service, makes it easy to set up page redirects, you can have up to 1024 redirects. It's all controlled from a single JSON file. Many things can go wrong in that file, stakes are quite high (starting with SEO) and any redirect mistakes can be hard to spot.

Here's our automated checking setup.

---

## Some background first

Web page redirects can help in many cases. For example,

- to salvage the traffic after changing URL's (for instance, after renaming the blog post's title),
- as defences against mistyped URL's (for example, we've got "whitespace" spelt with and without a hyphen, on different packages), and
- to cover the gaps in URL paths (for example, `/articles/tag/all` exists but `/articles/tag` does not).

There are two ways to perform page redirects: client-side and server-side.

**Client-side**, it's done via `<meta>` [redirect tags](https://www.w3.org/TR/WCAG20-TECHS/H76.html), for example `<meta http-equiv="refresh" content="0;URL='http://thetudors.example.com/'" />`. But that's not optimal because if implemented, when people will land of a "wrong" page, the server will respond with `200 OK` code (which is not "OK"), then `<meta>` will redirect them to "correct" page; a browser will issue a GET request to a new URL, which will (hopefully) respond with another `200 OK`. That's not good.

The _proper_ way is to do it **server-side**; to cause the server to respond with [code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/308) `308 Permanent Redirect` when a visitor lands on the "wrong" page. Then the server will respond to a new location; the browser will GET-request that, and (hopefully) get `200 OK`.

Our static site generator of choice is [Eleventy](https://www.npmjs.com/package/@11ty/eleventy), but vercel redirects apply to any front-end solution.

## Redirects in Vercel

Vercel server-side redirects are set in a [config file](https://vercel.com/docs/configuration#project/redirects), `vercel.json`, which is placed in the root folder of the website and looks like this:

```json
{
  "redirects": [
    {
      "source": "/articles/tag",
      "destination": "/articles/tag/all",
      "statusCode": 308
    },
    {
      "source": "/os/array-include-with-glob",
      "destination": "/os/array-includes-with-glob",
      "statusCode": 308
    }
  ]
}
```

We are going to check the following things:

- read, check, sort and overwrite the `vercel.json` with redirects sorted by the `source` key
- validate the `source` URL, to ensure it _does not exist_ (otherwise, what's the point of redirect?)
- validate the `destination` URL, to ensure it exists (so that we're redirecting to a real page)
- JSON schema should be validated, at least rudimentary, to make sure only three keys: `source`, `destination` and `statusCode` are in each object
- `source` should not equal `destination` (but that's covered by validations that `destination` exist and `source` does not; if so, it can't be the same thing)
- ensure redirect count is less than 1024
- there are 4K line limit too but such check is irrelevant, our URL's won't go as long
- ensure URL's are _relative_, there should be no domain (or even `http` substring anywhere)

## Implementation

The check script relies on having access to the _production build_ of the website because we are checking, do files exist on `dist/` folder. We don't publish, risk google bot crawling errors and then check. We check right after the build, using npm scripts, intending to run the checks on GitLab CI (and fail to publish if any errors are found).

This checking functionality could be part of a [vercel CLI](https://www.npmjs.com/package/vercel), but to do URL-validation checks, vercel CLI would need some information — where is the `dist` build folder. Even then, CLI would be triggered from npm scripts, from `package.json`, so we're back to square one. You can't escape npm scripts.

Some checks could be part of vercel CLI though, checks for redirect URL length, or misspelt keys.

We will create an internal Node script file, triggered by `package.json` during builds. It will be run during CI builds too.

Here's how we set it up — we create `utils/scripts/validateVercelJson.js` [file](https://git.sr.ht/~royston/codsen.com/tree/master/utils/scripts/validateVercelJson.js), put the _shebang line_ `#!/usr/bin/env node` at the top, set the permissions `chmod +x utils/scripts/validateVercelJson.js` and wire up a new script in [package.json](https://git.sr.ht/~royston/codsen.com/tree/master/package.json): `"test:vercel": "node utils/scripts/validateVercelJson.js",`. The `node ...` call is so-called _Node repl_; it's just calling Node as a CLI program, in a terminal, executing another JS file. If all pass, nothing happens; if an error occurs, an error is thrown, the build would fail (also we want this to happen on GitLab CI pipelines).

It's hard to explain all eight checks in writing due to sheer code amount, plus the code will likely change over time, so head to GitLab and see the current, live validator script [`validateVercelJson.js`](https://git.sr.ht/~royston/codsen.com/tree/master/utils/scripts/validateVercelJson.js) and the live [`vercel.json`](https://git.sr.ht/~royston/codsen.com/tree/master/vercel.json). They're public and open-source!
