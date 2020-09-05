Inverts {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}:

```js
const {{ packageJsons["ranges-invert"].lect.req }} = require("ranges-invert");
const oldRanges = [[3, 5], [5, 7]];

const result = {{ packageJsons["ranges-invert"].lect.req }}(oldRanges, 9);
console.log(result);
// => [
//      [0, 3],
//      [7, 9],
//    ]
```

Source string length (`9` above, for example) is needed because the last inverted range will touch the ending of the string.
