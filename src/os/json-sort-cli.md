---
layout: package
title: json-sort-cli
---

## Use it

Once installed, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without flags:

```bash
$ jsonsort file1.json "folder1/folder2/**/*.*" folder3 -s
$ jsonsort * -t -n -s
$ jsonsort yourspecialfolder -s

$ jsonsort -v
$ jsonsort --version
$ jsonsort -h
$ jsonsort --help
```

or `sortjson`, same thing. We wired up both. See the [API section](#api-flags) (of call for help via CLI, `jsonsort -h`).

{% include "btt.njk" %}

## API - flags

| short | long                 | description                                                                                        |
| ----- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `-n`  | `--nodemodules`      | Don't ignore any **n**ode_modules folders and package-lock.json's                                  |
| `-t`  | `--tabs`             | Use **t**abs for JSON file indentation                                                             |
| `-i`  | `--indentationCount` | How many spaces or tabs to use (default = 2 spaces or 1 tab)                                       |
| `-s`  | `--silent`           | When on, no output is shown. Only exit codes determine the success or failure.                     |
| `-a`  | `--arrays`           | Also sort any arrays if they contain only string elements                                          |
| `-h`  | `--help`             | Shows (similar to this) **h**elp                                                                   |
| `-v`  | `--version`          | Shows the installed **v**ersion of your `json-sort-cli`                                            |
| `-p`  | `--pack`             | Skip all `package.json` files                                                                      |
| `-d`  | `--dry`              | Only output the paths of the files                                                                 |
| `-c`  | `--ci`               | Does nothing, exits with non-zero code if files COULD BE sorted, with zero code if no sort needed. |

Put either short or long version of a desired flag, before or after the path or list of paths. For example, all these commands below are the same:

- `jsonsort templates/springsale03 -s`
- `jsonsort -s templates/springsale03`
- `jsonsort templates/springsale03 --silent`
- `jsonsort --silent templates/springsale03`

{% include "btt.njk" %}

## What it does exactly

It **sorts JSON files deeply**.

That is, it does not matter is it's a plain object within array within array within a plain object - all objects no matter how deep, will be detected and sorted.

If this tool processes any `package.json` files (put `-p` to disable this), it will first deep-sort alphabetically, then use `format-package` ([npm](https://www.npmjs.com/package/format-package)) to arrange keys according to a commonly agreed format — `name` at the top, depedencies at the bottom etc.

This is a parsing-type application, so written files are also **prettified** — tabulations and whitespace are fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used.

Under the bonnet, this application uses [ast-monkey-traverse](/os/ast-monkey-traverse), [sorted-object](https://www.npmjs.com/package/sorted-object), [format-package](https://www.npmjs.com/package/format-package).

{% include "btt.njk" %}

### Extra features

- `package.json` are first deep-sorted alphabetically, then using `format-package` ([npm](https://www.npmjs.com/package/format-package)) (on by default, but put `-p` to disable this)
- Works on dot files, as long as they are parse-able as JSON
- Can process a set of files in folder (use wildcards for example, `jsonsort "**/packages/*/data/*.json"`)
- Broken JSON files don't stop the process, other healthy files from batch are still sorted. Notifies user.
- System files like `.DS_Store` are not processed by default, don't worry about excluding them in the input path.

{% include "btt.njk" %}

## CI mode

When in CI mode, this CLI won't amend the files, only calculate the sorted result, compare the file's contents with it, then exit with a:

- zero code, if sorting would make no difference to a file
- non-zero code, if sorting would not make any difference

Basically, your scripts with this CLI would fail on unsorted JSON's. Thanks [widerin](https://gitlab.com/widerin) for the idea for this feature.

**CI mode does not write files**, only exits with one code or another.

{% include "btt.njk" %}
