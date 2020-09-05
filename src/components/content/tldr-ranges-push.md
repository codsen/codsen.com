When we want to gather {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}, instead of pushing them into an array, we can push them into this helper Class (for example, `gatheredRanges` below). That gives us automatic {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}merging</a> and {% if page.url == "/ranges/" %}<a href="#ranges-sort">{% else %}<a href="/os/ranges-sort/">{% endif %}sorting</a>.

```js
const {{ packageJsons["ranges-apply"].lect.req }} = require("ranges-apply");
const Ranges = require("ranges-push");
let gatheredRanges = new Ranges();

const oldString = `The quick brown fox jumps over the lazy dog.`;

// push the ranges
gatheredRanges.push(35, 43, "little Red Riding Hood");
gatheredRanges.push(4, 19, "bad grey wolf");

// retrieve the merged and sorted ranges by calling .current()
console.log(gatheredRanges.current());
// => [
//      [4, 19, "bad grey wolf"],
//      [35, 43, "little Red Riding Hood"]
//    ]

const result = {{ packageJsons["ranges-apply"].lect.req }}(oldString, gatheredRanges.current());
console.log(result);
// => "The bad grey wolf jumps over the little Red Riding Hood."
```

`ranges-push` also checks the types so it acts like a safeguard.
