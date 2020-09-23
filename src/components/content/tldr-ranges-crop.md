It crops the {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %}, ensuring no _range_ from an array goes beyond a given index.

Along the way, it will also {% if page.url == "/ranges/" %}<a href="#ranges-merge">{% else %}<a href="/os/ranges-merge/">{% endif %}merge</a> and {% if page.url == "/ranges/" %}<a href="#ranges-sort">{% else %}<a href="/os/ranges-sort/">{% endif %}sort</a> _ranges_.
