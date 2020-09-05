---
layout: package
title: regex-empty-conditional-comments
---

## Usage

```js
const emptyCondCommentRegex = require("regex-empty-conditional-comments");

// empty comment which was meant to target Outlook-only
emptyCondCommentRegex().t.test(`<!--[if !mso]>
<![endif]-->`);
//=> true

// empty comment which was meant to target non-Outlook-only
emptyCondCommentRegex().t.test(`<!--[if !mso]><!-- -->
<!--<![endif]-->`);
//=> true

emptyCondCommentRegex().t.test(`<!--[if !mso]><!-- -->
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<!--<![endif]-->`);
//=> false

emptyCondCommentRegex().t.test(`<!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->`);
//=> false

emptyCondCommentRegex().exec("<html><!--[if !mso]><![endif]--><title>")[0];
//=> '<!--[if !mso]><![endif]-->'

`<html> <!--[if !mso]><![endif]--> <title>text</title> <!--[if gte mso 9]>
<xml>
<![endif]-->`.match(emptyCondCommentRegex());
//=> ['<!--[if !mso]><![endif]-->']
```

{% include "btt.njk" %}

