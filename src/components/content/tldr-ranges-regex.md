Takes a string, matches the given regex on it and returns {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} which would do the same thing.

```js
const {{ packageJsons["ranges-regex"].lect.req }} = require("ranges-regex");
const oldString = `The quick brown fox jumps over the lazy dog.`;

const result = {{ packageJsons["ranges-regex"].lect.req }}(
  /the/gi,
  oldString
);
console.log(result);
// => [
//      [0, 3],
//      [31, 34]
//    ]

result.forEach(([from, to]) => {
  console.log(oldString.slice(from, to));
})
// => "The"
// => "the"
```

Similarly to `String.prototype.match()`, a no-results case will yield `null` (which {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}ranges-merge</a> and others would gladly accept).
