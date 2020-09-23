It iterates all characters in a string, as if given {% if page.url !== "/ranges/" %}<a href="/ranges/">{% endif %}_ranges_{% if page.url !== "/ranges/" %}</a>{% endif %} were already applied.

Sometimes certain operations on a string aren't really composable — sometimes we want to traverse the string as if _ranges_ were applied, as if we already had the final result.
