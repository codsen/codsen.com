Takes a string, matches the given regex on it and returns {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} which would do the same thing.

Similarly to `String.prototype.match()`, a no-results case will yield `null` (which {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}ranges-merge</a> and others would gladly accept).
