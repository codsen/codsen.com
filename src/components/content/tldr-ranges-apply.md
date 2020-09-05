It applies all amendments (described by {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_Ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}), producing a new string:

```js
const {{ packageJsons["ranges-apply"].lect.req }} = require("ranges-apply");
const oldString = `The quick brown fox jumps over the lazy dog.`
const ranges = [
  [4, 19, "bad grey wolf"],
  [35, 43, "little Red Riding Hood"]
];
const result = {{ packageJsons["ranges-apply"].lect.req }}(oldString, ranges);
console.log(result);
// => "The bad grey wolf jumps over the little Red Riding Hood."
```
