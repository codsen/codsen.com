Tells, is a given natural number index within any of the {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}:

```js
const {{ packageJsons["ranges-is-index-within"].lect.req }} = require("ranges-is-index-within");
const ranges = [[1, 2], [5, 10]];
const result1 = {{ packageJsons["ranges-is-index-within"].lect.req }}(ranges, 6);
console.log(result1);
// => true
```

A wrapper on top of `Array.prototype.find()`.
