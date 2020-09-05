If, after {% if page.url == "/ranges/" %}<a href="#ranges-sort">{% else %}<a href="/os/ranges-sort/">{% endif %}sorting</a>, any two {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} in the vicinity have the same edge value (like `2` below), **merge them**:

```js
const {{ packageJsons["ranges-merge"].lect.req }} = require('ranges-merge')
{{ packageJsons["ranges-merge"].lect.req }}([
  [1, 2], [2, 3], [9, 10]
])
// => [
//   [1, 3], [9, 10]
// ]
}
```

If _ranges_ overlap, merge them too:

```js
const {{ packageJsons["ranges-merge"].lect.req }} = require('ranges-merge')
{{ packageJsons["ranges-merge"].lect.req }}([
  [1, 5], [2, 10]
])
// => [
//   [1, 10]
// ]
}
```
