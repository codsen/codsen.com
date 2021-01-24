---
layout: package
title: csv-sort-cli
---

## Call on a file

Call `csvsort` (or `sortcsv`) appending your file name (with or without `-o`/`--overwrite` flag):

```bash
$ csvsort YOURFILE.csv

$ csvsort -o YOURFILE.csv
$ csvsort --overwrite YOURFILE.csv
$ csvsort -v
$ csvsort --version
$ csvsort -h
$ csvsort --help
```

**like this:**

![calling directly on a file](/images/package-csv-sort-cli-example1.gif)

{% include "btt.njk" %}

## Or omit the file's name

It will let you pick a CSV:

```bash
$ csvsort # omit the file's name, but you can include -o/--overwrite flag
```

omit the file name and `csv-sort-cli` will offer a list of CSV files in the current folder to choose from:

![calling without specifying a file name](/images/package-csv-sort-cli-example2.gif)

You can even try it without installing — use `npx`:

```bash
$ npx csv-sort-cli YOURFILE.csv
```

{% include "btt.njk" %}

## What it does exactly

1.  It **sorts CSV file rows** to correspond to the [double-entry bookkeeping](https://en.wikipedia.org/wiki/Double-entry_bookkeeping_system) principles:

![double bookkeeping example](/images/package-csv-sort-img1.png)

Sometimes internet banking CSV's have rows in a wrong order, especially when entries are on the _same date_. This library helps to sort the rows in correct order.

2.  As a bonus, it will **trim** the empty columns/rows:

![2D trim of a CSV contents](/images/package-csv-sort-img2.png)

3.  Not to mention, the our custom CSV parser [`csv-split-easy`](/os/csv-split-easy/) used here will ensure that all CSV cell _contents_ are trimmed, and there are no empty rows between the content rows. It also accepts any commas as content if the cell is wrapped with a double quotes.

{% include "btt.njk" %}
