const matcher = require("matcher");

// Problem: in "/os/<package>" single pages, how do we show related article posts,
// tagged with glob or exactly?

// Articles can manually describe related packages in markdown front-matter,
// see "packages" key below:
//
// ---
// title: Running or not running spot instances
// date: '2020-07-14'
// image: "009"
// packages:
//   - email-comb
//   - string-strip-html
//   - ranges-*
// tags:
//   - amazon
//   - eks
// ---
//
// now, the nunjucks single package page template has access to all articles,
// "articles" below. It also has access to the name of the particular package.
// See "packageName" below.

// The plan is to filter out all article objects which matcher.js reports as matching.

module.exports = (articles, packageName) => {
  return articles.filter((article) => {
    if (
      packageName &&
      article &&
      article.data &&
      article.data.packages &&
      Array.isArray(article.data.packages) &&
      article.data.packages.length
    ) {
      return article.data.packages.some((val) =>
        matcher.isMatch(packageName, val)
      );
    }
  });
};
