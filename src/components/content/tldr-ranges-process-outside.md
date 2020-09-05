Processes the string outside the given {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}. Each "gap" in the string between ranges will be fed into callback you supply — same like in `Array.prototype.forEach()`:

```js
const {{ packageJsons["ranges-process-outside"].lect.req }} = require("ranges-process-outside");
const gather = [];
{{ packageJsons["ranges-process-outside"].lect.req }}(
  "abcdefghij",
  [
    [1, 5] // delete from "b" to "f"
  ],
  (fromIdx, toIdx, offsetValueCb) => {
    gather.push(fromIdx);
  }
);
console.log(gather);
// => [0, 5, 6, 7, 8, 9]
```

As you see in example above, ranges' end index is not inclusive so character at index `5`, the `f` is not covered by `[1, 5]`. That's why when processing ranges outside that, `f` at index 5 gets pinged by the callback.

This program makes the life easier because if you did it manually, you'd have to {% if page.url == "/ranges/" %}<a href="#ranges-invert">{% else %}<a href="/os/ranges-invert/">{% endif %}invert ranges</a> and loop over each inverted chunk. Finally, you'd have to write unit tests of all that.
