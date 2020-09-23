When we want to gather {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}, instead of pushing them into an array, we can push them into this helper Class (for example, `gatheredRanges` below). That gives us automatic {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}merging</a> and {% if page.url == "/ranges/" %}<a href="#ranges-sort">{% else %}<a href="/os/ranges-sort/">{% endif %}sorting</a>.

`ranges-push` also checks the types so it acts like a safeguard.
