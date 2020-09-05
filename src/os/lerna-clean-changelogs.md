---
layout: package
title: lerna-clean-changelogs
---

## Idea

This is a "string-in/string-out" function which cleans strings, which hopefully are changelog file contents. We could say it is a low-level API for other cleaning tools: websites, [CLI apps](/os/lerna-clean-changelogs-cli/) and whatnot.

If you want a ready-to-use _cleaning tool_, consider the sibling CLI application of this package (which is driven by this very package) — [lerna-clean-changelogs-cli](/os/lerna-clean-changelogs-cli/). Install it globally:

```bash
npm i -g lerna-clean-changelogs-cli
```

{% include "btt.njk" %}

## API - Input

This package exports a function:

**cleanChangelogs(str)**

In other words, a function takes one input argument:

| Input argument | Key value's type | Obligatory? | Description                                 |
| -------------- | ---------------- | ----------- | ------------------------------------------- |
| `str`          | String           | yes         | The input string of zero or more characters |

If the first input argument is not a string, an error will be thrown.
If the first input argument is an empty string it's fine; an empty string will be in the result.

This library is **deliberately decoupled from the file read/write operations** because we might want to put it on the web or to drive a [CLI application](/os/lerna-clean-changelogs-cli/) using it or whatever. API as string-in, string-out^ is the most universal.

^ Actually, we export a plain object, where the result is under key "`res`" because we also export other information under other keys (such as version). However, the idea is the same - string-in, string-out.

{% include "btt.njk" %}

## API - Output

A plain object is returned and it contains the following keys:

| Key's name | Key value's type | Description                                                          |
| ---------- | ---------------- | -------------------------------------------------------------------- |
| `version`  | String           | Version as present currently in `package.json`. For example, `1.0.0` |
| `res`      | String           | The string you gave in the input, just cleaned.                      |

for example,

```js
{
  res: "some text",
  version: "1.3.56",
}
```

{% include "btt.njk" %}

## Purpose

This package performs the following cleaning steps:

1. It removes bump-only changelog entries that `conventional-changelog` generates. There can be many reasons For example:

   ```
   **Note:** Version bump only for package ranges-apply
   ```

   These will be deleted along with their headings.

2. It removes diff links from headings. Change the following:

   ```
   ## [2.9.1](/os/ranges-apply/compare/ranges-apply@2.9.0...ranges-apply@2.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.9.1 (2018-12-27)
   ```

   We need to do that because those links don't work on BitBucket and, generally, are _a noise_.

3. Remove `h1` headings and turn them into `h2`, with the exception of the first, main heading of the changelog.

   For exampe, change the following:

   ```
   # [2.0.0](/os/ranges-apply/compare/ranges-apply@2.0.0...ranges-apply@1.9.1) (2018-12-27)
   ```

   into:

   ```
   ## 2.0.0 (2018-12-27)
   ```

   (notice how a second hash character added, beside link being removed)

4. Replaces two or more empty lines into one line. `conventional-changelog` itself leaves excessive whitespace. As a bonus, if line only contains whitespace characters (spaces, tabs etc.) those whitespace characters are removed. They're hard to spot but useless.

5. If existing, pre-lerna changelog entries use dashes to note list items, those dashes are updated to match `conventional-changelog` notation using asterisks.


{% include "btt.njk" %}
