This is a wrapper on top of market-leading HTML entity decoder [he.js](https://github.com/mathiasbynens/he) `decode()` which returns {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} instead of string:

```js
const {{ packageJsons["ranges-ent-decode"].lect.req }} = require("ranges-ent-decode");
const result = {{ packageJsons["ranges-ent-decode"].lect.req }}("a &#x26; b &amp; c");
console.log(result);
// => [
//      [2, 8, "&"],
//      [11, 16, "&"],
//    ]
```

We tested the hell out of the code, directly and up-the-dependency-stream but as a cherry on top, all [he.js](https://github.com/mathiasbynens/he) unit tests were ported to `node-tap` and do pass.
