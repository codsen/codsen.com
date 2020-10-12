---
layout: package
title: chlu
---

{% include "src/components/content/monorepo-2020.njk" %}

## Purpose

![features](https://glcdn.githack.com/codsen/codsen/raw/master/packages/chlu-cli/media/features_comp.png)

**7 main features (see above):**

1.  Wraps the version with a link (brackets) and creates the diff URL in the footer.
2.  Adds missing diff links in the footer. It's intelligent-enough to detect existing links and their order.
3.  If the `.git` repo data is successfully read, it will create/convert diff links either in Bitbucket- or GitHub-based repository changelogs.
4.  User account name in diff link is set correctly as per `package.json`
5.  Project's name in diff link is set correctly as per `package.json`
6.  "from" version is chosen wisely. If there is no `git` data available, a previous entry in the changelog will be used. But if there is, the real, previous version will be used. In practice, often there are many patch releases between changelog entries (hence the word used in the title — "notable changes"). If we merely calculated the diff between changelog entries (usually minor/major releases), all patch releases would get caught in between and skew the picture of what was released for real.
7.  If dates are not in [ISO format](https://en.wikipedia.org/wiki/ISO_8601) (year-month-date), we try to convert them. Couple well-known projects with messed-up changelogs are used as guinea pigs in our unit tests.

{% include "btt.njk" %}

## API - Input

**chlu(changelogContents, [gitTags, packageJsonContents])**

In other words, it is _a string-in, string-out_ function.

| Input argument       | Type         | Obligatory? | Description     |
| -------------------- | ------------ | ----------- | --------------- |
| `changelogContents`      | String       | yes         | Contents of the changelog |
| `gitTags`     | Plain Object | no         | Git data from [`gitTags`](https://www.npmjs.com/package/git-tags) to calculate "from" entry in diff url |
| `packageJsonContents`     | Plain Object | no         | package.json to retrieve the current version |

{% include "btt.njk" %}

## API - Output

It returns a string, processed changelog.

{% include "btt.njk" %}
