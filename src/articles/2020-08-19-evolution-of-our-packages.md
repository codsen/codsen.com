---
title: Evolution of Our npm Packages, From a README Perspective
date: "2020-08-19"
image: "002"
packages:
  - detergent
  - email-comb
  - html-crush
  - bitbucket-slug
tags:
  - monorepo
  - indieweb
---

As our npm package count grows, the README automation becomes more and more an issue. Installation instructions, badges, contribution guidelines can be automatically generated, but many other chapters can't.

Here's our story from a README perspective.

---

## The Beginning

At first, we had a handful of npm packages, a folder with a few subfolders, and didn't manage anything at all: each npm package had its own, manually written README.md.

The newer the edit date of the README was, the nicer it was as were experimenting and adding more features like badges. There was lots of copy-pasting and a risk that old bits from old README could remain and end up published to the new README.

## Level 2 — `np`

Later we discovered a CLI helper [np](https://www.npmjs.com/package/np) from Mr&nbsp;Sorhus — the idea is genius: you hack away on a package, then release time comes, you trigger `np`, it wipes `node_modules` and installs fresh and runs all tests, then if all pass, asks you the next version, releases to npm and pushes to the git remote.

## Level 3 — let's loop `np`

By this time we had around 20 packages, but we didn't release that often. The releasing was manual, per-package or folder, so we thought — what if we could loop over folders and call the `np` inside each one?

We did that.

All README's still manually-written though.

## Level 4 — `lect`

At one moment, it popped to our mind that, actually, we _can_ generate fresh and replace specific chapters in README, then put this on a script and run it often.

For that, we created a CLI [`lect`](/os/lect/). There is only [one config](https://github.com/codsen/codsen/blob/main/packages/.lectrc.json) in the `/packages/` root, plus each `package.json` can have their own, per-package settings.

This approach is different from Mr&nbsp;Schlinkert's [`verb`](https://www.npmjs.com/package/verb) which keeps README contents in a separate file, `.verb.md` and renders that into README.md each time.

With time we added more and more automation features to `lect`, automating the maintenance of auxiliary files: `.npmignore`, `.npmrc`, `.prettierignore`, `LICENSE`, even `rollup.config.js`.

For example, glance at [`email-comb`](https://github.com/codsen/codsen/blob/main/packages/email-comb/rollup.config.js) Rollup config. It's generated.

## Level 5 — `lerna` monorepo, `commitizen`

Conceptually, Lerna does three things for us:

1. **bootstrap dependencies** — dedupe and "lift" them from package folders to the root
2. while integrating with [`commitizen`](https://github.com/commitizen/cz-cli), when release time comes, **fill CHANGELOG** files (completely automating them) and **bump the `version`** in package.json. Once you have all versions bumped, you're a king — you can loop over all folders calling `npm publish` inside each — and npm won't let you publish packages without bumped versions — only Lerna-bumped packages will get published.
3. `lerna run` is an excellent async **script runner**.

We're pretty sure we're using it in strange ways, but it does solve our technical challenges. Namely:

- **Cohesion within an ecosystem of packages**. In other words, if you code up a new feature on one package, how do you check, did you break anything up and down-stream dependency-wise? Manually, it's tedious: either symlink or copy-paste builds into `node_modules` of another package, run its tests, then restore things as they were. In a monorepo, that's automated. Plus, we can `lerna run test` — run `test` script inside each monorepo package. Think Mr&nbsp;Bahmutov's [dont-break](https://github.com/bahmutov/dont-break) but within monorepo boundaries and automated.
- **`node_modules` duplication and sheer gluttony**. If not in monorepo, each package is a standalone folder with its `node_modules` which `np` wipes and installs again. We calculated there were gigabytes of dependencies wiped and downloaded each time — laptop being pretty much unusable, burning fans for the duration of whole release (an hour or so).

At the moment of writing, our 115 packages monorepo root `node_modules` has 1,107 dependency folders, weighing only 191 MB. That's a tiny size by `node_modules` standards.

For the record, Lerna has _warts_ too, for example, we couldn't use `lerna add` for what we wrote our own linker CLI, [`lerna-link-dep`](/os/lerna-link-dep/). Nor we could use `lerna publish`. We go as far as `lerna version`, and from there on, we use other means. We also use our own [package updater CLI](/os/update-versions/). That deserves a separate post.

## Level 6 - Releases through GitLab CI only

Conceptually, CI — Continuous Integration — is a terminal session which is spun on a server at GitLab datacenters. That terminal session runs a bunch of commands as per `yml` config file.

Even though CI is at GitLab and repo sits at GitLab, there is no internal "rabbit hole" to pump the files through. CI build artefacts (everything, starting with version-bumped package.jsons) go through "Internets" as if 3rd person did — git remote is set (repo), then files are committed and pushed there from a CI session.

During the Christmas of 2018, with a couple of spare weeks at hand, we decided to put up the monorepo onto our GitLab CI. It went successfully, although there were a few accidental semver bumps because of `commitizen` and initial misconfiguration.

See our current GitLab CI config `yml` script [here](https://github.com/codsen/codsen/blob/main/.semaphore/semaphore.yml). We don't publish CI session data because of potential security issues if secrets leak there, but our CI script is public, and you can save lots of time by referencing it.

From a user perspective, CI is fantastic because it ports all the npm publishing up from the user's laptop to CI servers. We `git push` to GitLab and get on with our day, getting an email from GitLab if pipeline failed or an email from npm if packages got published.

Theoretically, development/releasing could be done opportunistically — without bothering to run the whole test suite locally — if package's tests pass, `git push`, see what happens — CI won't let through anything breaking anyway. We don't do that.

Moving npm package publishing to CI is a very wise choice, although there are very few people that share their CI configs or talk about their CI setups. We had to assemble our CI script from scratch, and it took a couple of weeks to nail it.

If you remember Mr&nbsp;Lindesay's [is-promise](https://www.zdnet.com/article/another-one-line-npm-package-breaks-the-javascript-ecosystem/) story — one of the outcomes was that **releasing was moved to a CI**.

## Level 7 — own website

From Indieweb principles:

> "own your data, scratch your itches, build tools for yourself, selfdogfood, document your stuff, open source your stuff, UX design is more important than protocols, visible data for humans first and machines second, platform-agnostic platforms, plurality over monoculture, longevity, and remember to have fun!"
> — [https://indieweb.org/principles](https://indieweb.org/principles)

Moving all the npm package README files to an owned website makes sense.

README updates won't warrant package releases any more.

Website and programs monorepo are separate git repositories, so their issue trackers are also separate. It allows treating documentation amends properly — from issue templates to meaningful CI checks — separating the concerns.

People from outside can raise tickets and help you to update README, and that won't affect programs' source code.

There are SAAS companies out there which "quality assess" open-source npm packages, are they "suitable for corporate" or not. I was shocked to find out that excessive (by their standards) `patch` releasing is deemed to be **a sign of low code quality**. Oops! Our effort seeking README perfection is apparently harmful!

Another argument to port README's outside npm/git provider is **UX and features in general**. Your website can outdo npm or GitHub/GitLab/BitBucket easily:

- Proper dark mode, with manual and auto settings
- Full control over images, their caching
- Complete control over markdown rendering. Did you know, Eleventy `markdown-it` can have plugins and at the moment there are [388 available](https://www.npmjs.com/search?q=keywords%3Amarkdown-it-plugin)? Are you sure your README markdown's in npm/Github/GitLab/Bitbucket walled gardens receive the best possible treatment?
- Heading anchors, TOC's. Smooth scroll anybody?
- Interactive charts
- Code playgrounds, embedded as iframes, for example, Runkit (not to mention usual CSS playgrounds like JSBin or Codepen)
- Improved page layouts
- Cross-selling and up-selling — for example, cross-linking the hell out of articles and packages and tags.
- Banners, if you wish

Owning data and hosting it on your terms gives fantastic opportunities!

## Conclusion

**We will host all our Open Source program README files, in full form here, on codsen.com, while keeping bare-minimal versions on npm**.

And README files on the repo on GitLab — if they will exist at all, will contain only a link to codsen.com homepage.

## Future

To shuffle the things even further, we'll:

1. Seek to publish all our packages to Deno hosting service, [deno.land/x](https://deno.land/x)
2. Treat npm and Deno _equally_ in the documentation and everywhere
3. As a final alternative, we'll seek to publish all packages straight to Cloudflare CDN, bypassing even Deno hosting service, to contribute in preventing it the npm's fate.

One day, it will be possible to consume Codsen programs using Deno straight from CDN, without even dealing with _npm-github-microsoft_ or Deno's hosting service.
