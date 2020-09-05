---
layout: package
title: json-comb
---

## Use it

Once installed, call `jsoncomb` in the terminal with list of a file or folder paths, using globs, for example:

```bash
$ jsoncomb --normalise "index.json"
$ jsoncomb -n "data/**/index.json" -i "data/defaults.json"
$ jsoncomb -n "**/*.json" -t

$ jsoncomb -v
$ jsoncomb --version
$ jsoncomb -h
$ jsoncomb --help
```

{% include "btt.njk" %}

## API - flags

| short | long          | description                                                   |
| ----- | ------------- | ------------------------------------------------------------- |
| `-n`  | `--normalise` | Normalise all files in the given set                          |
| `-i`  | `--ignore`    | **I**gnore paths if they contain only placeholder values      |
| `-t`  | `--tabs`      | Use **t**abs instead of default 2 spaces for JSON indentation |
| `-v`  | `--version`   | Shows the installed **v**ersion of your `json-sort-cli`       |
| `-h`  | `--help`      | Shows (similar to this) **h**elp                              |

{% include "btt.njk" %}

## Normalise

```bash
$ jsoncomb --normalise "index.json"
$ jsoncomb -n "data/**/index.json" -i "data/defaults.json"
```

{% include "btt.njk" %}
