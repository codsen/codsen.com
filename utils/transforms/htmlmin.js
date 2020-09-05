const htmlmin = require("html-minifier");

module.exports = function (content, outputPath) {
  if (outputPath && outputPath.endsWith(".html")) {
    const minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
    });
    return minified;
  }

  return content;
};
