// we have interdeps.json
// https://gitlab.com/codsen/codsen/-/blob/master/stats/interdeps.json
// or ingested in Eleventy, dev version: src/_data/dev/interdeps.json or
// prod live version: src/_data/prod/interdeps.js
// where it's listed, who is consuming each package
// (within monorepo boundaries, not including 3rd party npm packages).
// For example, "email-comb" is consumed by "gulp-email-remove-unused-css":
//
// {
//   "name": "gulp-email-remove-unused-css",
//   "size": 884,
//   "imports": ["email-comb"]
// }
//
//

// In single package pages, when there's only one internal consumer, like in
// "email-comb" case, we want to tell, which package is it.

// This filter takes the name of the package, runs through every object
// in the interdeps.json array and reports the name key of it, where the
// given package is among values in the "imports" key value array.

const interdeps = require("../../src/_data/dev/interdeps.json");

module.exports = (str) => {
  for (let i = 0, len = interdeps.length; i < len; i++) {
    // traverse the array of plain objects, return name key of the first
    // encountered consumer
    if (
      Array.isArray(interdeps[i].imports) &&
      interdeps[i].imports.includes(str)
    ) {
      return interdeps[i].name;
    }
  }
  return str;
};
