---
layout: package
title: email-all-chars-within-ascii-cli
---

## Quick Take

Call on one file:

![ran on one file](https://glcdn.githack.com/codsen/codsen/raw/master/packages/email-all-chars-within-ascii-cli/media/mov1.gif)

Call just the application and it will let you choose a file from that folder:

![ran without any arguments](https://glcdn.githack.com/codsen/codsen/raw/master/packages/email-all-chars-within-ascii-cli/media/mov2.gif)

Call on multiple files all at once:

![ran on multiple files all at once](https://glcdn.githack.com/codsen/codsen/raw/master/packages/email-all-chars-within-ascii-cli/media/mov3.gif)

{% include "btt.njk" %}

## Use it

Once installed, call it on a file:

`withinascii YOURFILE.html` or

`tinaturner "templates/YOURFILE.html"`

Whichever is easier for you to remember.

## Idea

This CLI app will check, does your HTML file (or some other extension) contains non-ASCII characters.

Specifically, it will check, are your file contents suitable for 7bit encoding, in other words, are all characters within the [basic ASCII range](http://www.fileformat.info/info/unicode/block/basic_latin/list.htm), the first 126^ characters. However, **only** this check would be short-sighted, as invisible control characters (anything below decimal point 32) fall within ASCII range but are bad.

We don't want any invisible control characters (anything below decimal point 32), EXCEPT:

- [HT](http://www.fileformat.info/info/unicode/char/0009/index.htm), horizontal tab, decimal number 9
- [LF](http://www.fileformat.info/info/unicode/char/000a/index.htm), new line, decimal number 10
- [CR](http://www.fileformat.info/info/unicode/char/000d/index.htm), carriage return, decimal number 13

^ Also, we don't want character at a decimal point 127, [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm), which technically falls within basic ASCII range but might appear broken in email-consumption software.

{% include "btt.njk" %}

## Practical use

We're going to use this library to validate our email templates, as a part of final QA. In theory, all email templates should be [HTML encoded](/os/detergent/) and have no characters outside the basic ASCII range (or invisible control characters like ETX). In practice, all depends on the server, because your ESP back-end _might_ encode the rogue characters for you. But it might not, and you'd be in trouble.

We're going to prepare for the worst and deliver all our templates ready for ANY encoding, conforming to 7bit spec: no characters beyond first 126 decimal point.

PS. It's 126, not 127 because 127 is "invisible" [DEL](http://www.fileformat.info/info/unicode/char/007f/index.htm) character which is not acceptable in templates.

Check out [the API](/os/email-all-chars-within-ascii/) version which works well in Gulp environment.

{% include "btt.njk" %}
