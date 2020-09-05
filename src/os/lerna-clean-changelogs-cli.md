---
layout: package
title: lerna-clean-changelogs-cli
---

## Use it

Once installed, call it one of two ways:

```bash
$ lcc
$ lernacleanchangelog
```

PS. That dollar sign above just means it's a terminal. Never type that dollar sign!

## Purpose

This application performs the following cleaning steps on all encountered `changelog.md`'s:

1. It removes bump-only changelog entries that `conventional-changelog` generates. For example:

   ```
   **Note:** Version bump only for package ranges-apply
   ```

   These will be deleted along with their headings.

2. It removes diff links from headings. Change the following:

   ```
   ## [2.9.1](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.9.1 (2018-12-27)
   ```

   Diff links that changelog generator produces are not universal between GitLab, GitHub and BitBucket and sometimes there are bugs in them.

3. Remove `h1` headings and turn them into `h2`, with the exception of the first, main heading of the changelog.

   For exampe, change the following:

   ```
   # [2.0.0](https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply/compare/ranges-apply@2.0.0...ranges-apply@1.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.0.0 (2018-12-27)
   ```

   (notice how a second `#` character is added, beside link being removed)


{% include "btt.njk" %}

## The proof of the pudding is in the eating

Here's how we use it ourselves.

In short, GitLab CI calls package.json script and it cleanses the changelogs before npm package is published to npm and all builds are comitted from CI to git.

Have a look at our GitLab CI yml:

```yml
{{ gitlabCIConfig | safe }}
```

There's a line:

```
- npm run pub:vers
```

That's how CI calls npm script. By the way, "lerna-clean-changelogs-cli" can be called at all because our monorepo root [package.json](https://gitlab.com/codsen/codsen/-/blob/master/package.json) has it as a dev-dependency:

```
"devDependencies": {
  ...
  "lerna-clean-changelogs-cli": "^{{ packageJsons["lerna-clean-changelogs-cli"].version }}",
  ...
}
```

In the package.json, `pub:vers` looks like this:

```
"pub:vers": "lerna version --conventional-commits --no-commit-hooks --yes && lernacleanchangelog '**'",
```

We call `lerna version` and then we call `lernacleanchangelog` — the call name for `lerna-clean-changelogs-cli`. We could also call `lcc` instead but it's more descriptive, considering you come back after months and wonder what is such and such command...

{% include "btt.njk" %}
