It iterates all characters in a string, as if given {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} were already applied:

Ranges in the following example "punches out" a "hole" from `a` to `g` (included), replacing it with `xyz`. That's what gets iterated:

```js
const {{ packageJsons["ranges-iterate"].lect.req }} = require("ranges-iterate");
// it's callback-based, like Array.prototype.forEach()
{{ packageJsons["ranges-iterate"].lect.req }}("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
  console.log(`i = ${i}; val = ${val}`);
});
// => i = 0; val = x
// => i = 1; val = y
// => i = 2; val = z
// => i = 3; val = h
// => i = 4; val = i
// => i = 5; val = j
```

Sometimes certain operations on a string aren't really composable — sometimes we want to traverse the string as if _ranges_ were applied, as if we already had the final result.
