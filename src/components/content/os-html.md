They all process HTML and CSS. Our speciality is so-called _scanerless parsing algorithm_ — we don't parse and then work on AST and then render. We aim to work on the source code directly while traversing it as a string.

The whole idea is, if you don't parse the HTML, you can support broken or mixed code. Unless you write your parser, it becomes a bottleneck — parser throws here and there, and you can do nothing about it.

It is vital to support _broken code_ because this allows us to make broken code fixing programs.

It is equally vital to support _mixed code_ because both web page and email template HTML can contain anything from templating languages to programming languages.
