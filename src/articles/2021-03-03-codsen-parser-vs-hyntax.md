---
title: "`codsen-parser` vs. `hyntax`"
date: '2021-03-03'
image: "009"
packages:
  - codsen-parser
  - codsen-tokenizer
  - hyntax
tags:
  - js
---

Imagine the HTML: `<a></b>`.

Parser-wise, how would you design the AST architecture, considering cases like above?

---

`hyntax` HTML parser, for example, interprets it like this:

```json
{
  "nodeType": "document",
  "content": {
    "children": [
      {
        "nodeType": "tag",
        "parentRef": "[Circular ~]",
        "content": {
          "openStart": {
            "type": "token:open-tag-start",
            "content": "<a",
            "startPosition": 0,
            "endPosition": 1
          },
          "name": "a",
          "openEnd": {
            "type": "token:open-tag-end",
            "content": ">",
            "startPosition": 2,
            "endPosition": 2
          },
          "selfClosing": false
        }
      }
    ]
  }
}
```

Notice the `</b>` is not even mentioned here!

In contrast, `codsen-parser`:

```json
[
    {
        "type": "tag",
        "start": 0,
        "end": 3,
        "value": "<a>",
        "tagNameStartsAt": 1,
        "tagNameEndsAt": 2,
        "tagName": "a",
        "recognised": true,
        "closing": false,
        "void": false,
        "pureHTML": true,
        "kind": "inline",
        "attribs": [],
        "children": []
    },
    {
        "type": "tag",
        "start": 3,
        "end": 7,
        "value": "</b>",
        "tagNameStartsAt": 5,
        "tagNameEndsAt": 6,
        "tagName": "b",
        "recognised": true,
        "closing": true,
        "void": false,
        "pureHTML": true,
        "kind": "inline",
        "attribs": [],
        "children": []
    }
]
```

The takeaway is that "normal" parsers like `hyntax` are not aimed at tackling broken code. That's why I'm working on `codsen-parser` and `codsen-tokenizer`. The _tokenizer_ builds tokens, plain objects, and the _parser_ consumes _tokenizer_, taking those tokens and nesting them into an object tree.

I decided to ship the parser and tokenizer as separate programs because somebody might not need the AST, the plain object tree.