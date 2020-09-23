Processes the string outside the given {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}. Each "gap" in the string between ranges will be fed into callback you supply — same like in `Array.prototype.forEach()`.

This program makes the life easier because if you did it manually, you'd have to {% if page.url == "/ranges/" %}<a href="#ranges-invert">{% else %}<a href="/os/ranges-invert/">{% endif %}invert ranges</a> and loop over each inverted chunk. Finally, you'd have to write unit tests of all that.
