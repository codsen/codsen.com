It sorts the {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}:

```js
const {{ packageJsons["ranges-sort"].lect.req }} = require('ranges-sort')
const result = {{ packageJsons["ranges-sort"].lect.req }}([
  [2, 3], [9, 10, "bad grey wolf"], [1, 2]
]);
console.log(result);
// => [
//      [1, 2], [2, 3], [9, 10, "bad grey wolf"]
//    ]
```
