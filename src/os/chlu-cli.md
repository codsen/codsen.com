---
layout: package
title: chlu-cli
---

{% include "src/components/content/monorepo-2020.njk" %}

## How it works

This is a CLI app. Once installed, call it in the root folder where your `changelog.md` sits:

```bash
chlu
```

On a default setting, `chlu` just silently does the job — checks and fixes your changelog. If you want some output, call it with `--loud` flag. It will say "OK" each time it writes successfully.

Chlu works on both **GitLab**, **Bitbucket** and **GitHub** repositories.

`chlu` stands for **CH**ange**L**og **U**pdate. We should note that all changelogs should follow the rules given by http://keepachangelog.com. Now, the tedious part is **diff links**. Chlu takes care of them. Also, changelog should have all dates in ISO format, should have diff links between changelog entries and use a consistent title format, for example, `## [1.11.0] - 2018-07-24`. These are main things, and `chlu-cli` automates updating all that.

{% include "btt.njk" %}

## What it does

![features](/images/package-chlu-cli-features_comp.png)

**7 main features (see above):**

1. Wraps the version with a link (brackets) and creates the diff URL in the footer.
2. Adds missing diff links in the footer. It's intelligent-enough to detect existing links and their order.
3. If the `.git` repo data is successfully read, it will create/convert diff links either in Bitbucket- or GitHub-based repository changelogs.
4. User account name in diff link is set correctly as per `package.json`
5. Project's name in diff link is set correctly as per `package.json`
6. "from" version is chosen wisely. If there is no `git` data available, a previous entry in the changelog will be used. But if there is, the real, previous version will be used. In practice, often there are many patch releases between changelog entries (hence the word used in the title — "notable changes"). If we merely calculated the diff between changelog entries (usually minor/major releases), all patch releases would get caught in between and skew the picture of what was released for real.
7. If dates are not in [ISO format](https://en.wikipedia.org/wiki/ISO_8601) (year-month-date), we try to convert them. Couple well-known projects with messed-up changelogs are used as guinea pigs in our unit tests.

{% include "btt.njk" %}

## A nifty setup idea

It would be tedious and unnecessary to run `chlu` manually. Not to mention, you might even forget to run it.

What we suggest is, add `chlu` to one of your aliases, for example, `git add .`. That's what we do.

For example, edit your `.zshrc` (or Bash config, or whatever-you-are-using-shell's config) file to contain:

```bash
# create a function which runs commands if certain files exist, and skips if they don't:
my-git-add() {
  [ -e readme.md ] && doctoc readme.md
  [ -e changelog.md ] && chlu
  npm-check
  git add .
}

# create alias for your command, call the function:
alias gaa=my-git-add
```

The example above runs:

- [doctoc](https://www.npmjs.com/package/doctoc) on `readme.md` if it exists,
- then it runs [chlu](/os/chlu-cli) on `changelog.md` if it exists,
- then it runs [npm-check](https://www.npmjs.com/package/npm-check) and lastly,
- it runs the `git add .`.

It means, you always get your readme, changelog committed in a correct, updated state and all dependencies checked.

{% include "btt.njk" %}
