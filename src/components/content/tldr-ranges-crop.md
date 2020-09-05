It crops the {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}, ensuring no _range_ from an array goes beyond a given index.

```js
const {{ packageJsons["ranges-crop"].lect.req }} = require('ranges-crop');
const result = {{ packageJsons["ranges-crop"].lect.req }}(
  [
    [2, 3], [9, 10, "bad grey wolf"], [1, 2]
  ],
  7
);
console.log(result);
// => [
//      [1, 3]
//    ]
```

Along the way, it will also {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}merge</a> and {% if page.url == "/ranges/" %}<a href="#ranges-sort">{% else %}<a href="/os/ranges-sort/">{% endif %}sort</a> _ranges_.
