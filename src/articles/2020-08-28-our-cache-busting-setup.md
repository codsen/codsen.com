---
title: Our Cache Busting Setup on Eleventy
date: '2020-08-28'
image: "004"
packages:
  - "@11ty/eleventy"
  - npm-run-all
  - cross-env
tags:
  - eleventy
  - parcel
  - meta
---

Cache busting is necessary because browsers cache the resources, namely, CSS and JS files, and if we update the website, visitors might not see their latest versions.

In theory, implementing web workers should solve the cache busting problem, and there are [Eleventy plugins](https://www.npmjs.com/package/eleventy-plugin-pwa) for that, but, we decided not to enable the PWA setup until we test it properly.

Here's how we bust the cache in an old-school way, on Eleventy + Nunjucks + Parcel.

---

We started this website on a [XITY](https://github.com/equinusocio/xity-starter) boilerplate. It gave a headstart providing a decent JS pipeline and PostCSS using [Parcel.js](https://parceljs.org/). We removed the [pwa](https://www.npmjs.com/package/eleventy-plugin-pwa) plugin and decided to bust cache in old ways.

## The Essence

![Folder-Based Cache Busting in Eleventy, Nunjucks and Parcel](/images/codsen-article-cache-busting.png)

1. Generate file-based Unix epoch timestamp;
2. Pipe the assets in Eleventy to a subfolder named as that timestamp;
3. Also, use that timestamp when templating, in asset paths.

If you need to reference the timestamp inside of any of the files from this subfolder (and you will need to, if you use _web workers_), then, an additional step:

4. Run a _find-and-replace_ script after the build completes.

<div role="presentation" class="separator">
  {% include "svg-codsen-star-small.njk" %} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
</div>

Read on for a proper explanation and setup examples.

<div role="presentation" class="separator">
  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {% include "svg-codsen-star-large.njk" %}
</div>

## Conceptually

In Web Architecture, the Addressability [principle](https://www.w3.org/2001/tag/doc/whenToUseGet.html) tells:

> "A URL identifies one and only one resource."
> <cite>Leonard Richardson, Mike Amundsen, and Sam Ruby. "RESTful Web APIs"</cite>

Given a visitor's browser caches _resources_ (CSS and JS files, for example) those resources are distinguished from one another by the _URL_.

For example, two clones of the same file but in different folders are still two different resources.

`https://codsen.com/crambles/main.jpg`<br>is not the same as<br>`https://codsen.com/oodles/main.jpg`

From here, it flows that all it takes to turn a resource into a new resource is to _change its URL_.

That's why, **conceptually**, _cache busting_ is achieved by **changing the URL**, one way or another. It can be done three ways:

1. Add unique characters to the **file name**. For example, `/css/main.css` ⇒ `/css/main-234802938402.css`
2. Put the resource file in a **uniquely-named folder**. For example, `/css/main.css` ⇒ `/css/234802938402/main.css`
3. Add unique **URL parameters**: `/css/main.css` ⇒ `/css/main.css?v=234802938402`

That's at least how it works in the pre-PWA world.

The third option seems easiest, but it is unreliable: URL parameter can get discarded anywhere in the file journey. Sorry [eleventy-plugin-cache-buster](https://www.npmjs.com/package/@mightyplow/eleventy-plugin-cache-buster).

That leaves us with _file-changing_ and _folder-changing_ options.

## File Versus the Folder

**Folder approach** is easier because we just pipe the files into a sub folder during Eleventy build — a one-liner:

```js
eleventyConfig.addPassthroughCopy({ bundle: `assets/${hash}` })
```

**File approach** would involve either:

- producing JS and CSS files with timestamped/hashed names when they're created (not possible, because they come from _Parcel_), or
- renaming them later during Eleventy asset ingestion (tricky, considering the `addPassthroughCopy` won't do and [`afterBuild`](https://www.11ty.dev/docs/events/#afterbuild) event hook is not released yet at the time of writing), or
- _find-and-replace_ script that runs after (both complicated and tricky, considering two layers of `watch` that would run in front of it, in the pipeline).

## Hash vs Timestamp

Another consideration: _what_ random value to put.

An easy way is JS [timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) `Date.now()` (or in the [terminal](https://www.linode.com/docs/tools-reference/tools/use-the-date-command-in-linux/) `date +%s > hash.txt`) but it’s not file-content-based _hash_, each deployment will cause assets to be treated as new, even if they haven’t changed since the last release.

A "proper" way is to use file-content-based hashes ([MD5](https://www.npmjs.com/package/md5) for example). URL would change only if file contents changed. The drawback is that we'd have one folder-per-file.

In either case, file or folder length is not an issue, timestamps are ten characters-long, and MD5 hashes are 32 characters-long.

For the initial setup, we went with easier, timestamp-based cache-busting.

## Simplified Explanation

We run a huge script from `package.json`. It does many things.

First, it outputs a current timestamp into a file `hash.txt`, into a root folder of a project. Probably there's an old file from a previous run, but it gets overwritten.

That `hash.txt` contains our reference timestamp value. Parcel and Eleventy will be run after this file has been written.

Parcel then runs, processing JS files (baking-in all dependencies) and PostCSS files (rendering all mixins etc. into normal CSS). Files from `src/assets/` get rendered into `bundle/`.

Then Eleventy script at `.eleventy.js` (located in the root folder) fires. First, it reads the `hash.txt`. Second, it copies all files from the `bundle/` folder into `dist/assets/${hash}` where `${hash}` is the hash from the `hash.txt` file.

Our assets are now placed in a uniquely-named folder.

{% raw %}

The HTML templates also need to "know" the hash, to write correct JS and CSS file paths. It's achieved by [global data files](https://www.11ty.dev/docs/data-global/) — a data file reads `hash.txt` and returns a plain object which templates consume like

```html
<link rel="stylesheet" href="/assets/{{ cacheBusting.hash }}/css/app.css">
`"

That's the essence of the setup.

{% endraw %}

## Huge Script, Deconstructed

Let's go through our `package.json` npm script `start`, piece-by-piece.

But first, ingredients:

[`npm-run-all`](https://www.npmjs.com/package/npm-run-all) runs the scripts from package.json sequentially or parallelly.

[`cross-env`](https://www.npmjs.com/package/cross-env) is to make it work on Windows. That's fair, considering not everybody can afford a Mac.

The script `start` is triggered by `npm run start` and it builds a development version of this website and watches for changes:

```json
"start": "cross-env ELEVENTY_ENV=dev run-s clean:* build:assets && cross-env ELEVENTY_ENV=dev run-p serve hash watch:*"
`"

Destructured, it calls the following npm scripts:

**FIRST, RUN SEQUENTIALLY** (`run-s`):

```json
"clean:cache": "rimraf ./.cache",
"clean:dist": "rimraf ./dist",
"clean:bundle": "rimraf ./bundle",
`"

These commands above delete folders. DIY solution for [#19](https://github.com/11ty/eleventy/issues/19).

```json
"build:assets": "parcel build ./src/assets/css/app.pcss ./src/assets/js/app.js ./src/assets/js/interdeps.js ./src/assets/js/search-worker.js --out-dir ./bundle --no-source-maps",
`"

This command above calls Parcel. JS file processing is configured by `.babelrc` and PostCSS `.pcss` file processing is configured by `postcss.config.js` — both configs are in the root.

Parcel doesn't need to be aware of our hash.

**THEN, RUN IN PARALLEL** (`run-p`):

```json
"serve": "date +%s > hash.txt && eleventy --serve --port=8080",
`"

The command above does two things: `date +%s > hash.txt` writes the timestamp into a `hash.txt`. `eleventy --serve --port=8080` being for development, builds and watches for changes.

```json
"hash": "delay 15 && node utils/scripts/fixDistWorkerHash.js",
`"

The command above might not be relevant for some, but our search runs off a [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) to a) unblock the thread, and b) to make it easy to start and kill it after each keypress in the _search_ field. Simply speaking, it's one JS file running another, pet JS file, in a separate CPU thread. There's messaging in-between.

The _catch_ is, `app.js`, the main script, needs to know the URL of the file of a worker:
```js
myWorker = new Worker(
  "http://localhost:8080/assets/REPLACE_WITH_HASH_URL/js/search-worker.js"
);
`"

When Eleventy is running in parallel, we give it 15 seconds using `delay 15`, and then we find-and-replace text in a file using Node's `fs.readFileSync` and `fs.writeFileSync` in a script located at `utils/scripts/fixDistWorkerHash.js`. For scripting like this, use what you know best — some people prefer Bash or Make or Perl, to name a few.

```json
"watch:assets": "parcel watch ./src/assets/css/app.pcss ./src/assets/js/app.js --out-dir ./bundle --no-source-maps --no-hmr",
`"

In the command above, Parcel runs in parallel and watches for file changes.


<div class="box-beware">

The _watch_ scripts of all kinds — commands marked by CLI flags `--serve` or `--watch` — they never end and thus block all further scripts chained with `&&`. If you append something after, that will **never trigger**. For example,

```json
"badexample": "eleventy --serve --port=8080 && echo \"oodles\""
`"

The `oodles` will never be printed in the terminal!

That's valid for any "watching" script: BrowserSync on watch mode, `serve` package from npm, Eleventy on a `--serve` flag and all others. If there's _watching_, you can't put other npm scripts after it using `&&`. That's one of the reasons chain watcher scripts are ran using `run-p` — rule doesn't apply to [`npm-run-all`](https://github.com/mysticatea/npm-run-all) because it fires different processes.

</div>

Here we covered only the _dev_ (development) build. The _prod_ (production) build is similar except it doesn't watch and there's another, standalone script which renames the `http://localhost:8080/` into `https://codsen.com/`.

If you wonder why we can't just use `/` in URL, that's because at the moment, if Parcel "sees" anything else than absolute URL, it will process it. In this case, it will do it wrong, so we use absolute URL's as a means to make Parcel ignore them. At the moment, it is not possible to force Parcel [to](https://github.com/parcel-bundler/parcel/issues/1186) [ignore](https://github.com/parcel-bundler/parcel/issues/1087) [things](https://github.com/parcel-bundler/parcel/issues/357).

## Conclusion

This setup is an MVP — "Minimal Viable Product". We'll continue improving it.

The source code of this website is Open Sourced. Feel free to fork it and play around with it. We all learn by _doing_; reading alone won't suffice.
