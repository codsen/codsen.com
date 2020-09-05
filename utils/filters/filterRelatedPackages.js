const arrayShuffle = require("array-shuffle");

// Problem: in "/os/<package>" single pages, how do we show related packages?

// OK, some come from manually set list in package front-matter, for example:
//
// ---
// layout: package
// title: string-trim-spaces-only
// packages:
//   - ranges-apply
//   - ranges-push
//   - string-collapse-leading-whitespace
//   - string-strip-html
// ---

// But not all do, and we need an automated substitute.

// "compiledAssertionCountsAll" comes from "compiledAssertionCounts.json" in
// src/_data/dev/compiledAssertionCountsAll.json
// src/_data/prod/compiledAssertionCountsAll.js
// (depends which ENV variable you are on, is it a "dev" build or "prod"/"seed" builds)

const blackList = [
  "bitbucket-slug",
  "gulp-email-remove-unused-css",
  "chlu",
  "chlu-cli",
  "lect",
  "helga",
];

module.exports = (
  compiledAssertionCountsAll,
  customSetPackagesArr = [],
  packageCategories,
  packageName
) => {
  // don't mutate the inputs!
  const result = new Set();

  // first goes CLI package is it's API package and API if it's CLI
  const possibleCounterpart = packageName.endsWith("-cli")
    ? packageName.slice(0, -4)
    : `${packageName}-cli`;
  if (Object.keys(compiledAssertionCountsAll).includes(possibleCounterpart)) {
    result.add(possibleCounterpart);
  }

  // cater "gulp-x" where "x" is name of other package
  if (packageName.includes("-")) {
    const packageWithoutFrontBit = packageName.split("-").slice(1).join("-");
    if (
      Object.keys(compiledAssertionCountsAll).includes(packageWithoutFrontBit)
    ) {
      result.add(packageWithoutFrontBit);
    }
  }

  // second goes manually declared packages from the front-matter
  if (Array.isArray(customSetPackagesArr) && customSetPackagesArr.length) {
    customSetPackagesArr.forEach(result.add, result);
  }

  // third, we have known package categories - use that, the order is special there
  Object.keys(packageCategories)
    // filter keys which have arrays inside and inside those arrays this package is mentioned
    .filter(
      (key) =>
        Array.isArray(packageCategories[key]) &&
        packageCategories[key].includes(packageName) &&
        // grouping only by the fact that it's a CLI is not right, discard that:
        !["flagshipLibsList", "cliAppsList"].includes(key)
    )
    // now we've got list of good keys under "packageCategories"
    // reduce those arrays into one
    .reduce((acc, key) => acc.concat(packageCategories[key]), [])
    // remove blacklisted
    .filter((p) => !blackList.includes(p))
    // finally, push each package name into our result Set
    .forEach(result.add, result);

  // third, filter some more and add to the result Set
  arrayShuffle(
    Object.keys(compiledAssertionCountsAll).filter((nameOfOneOfPackages) => {
      // Imagine "nameOfOneOfPackages" is string, something like "ranges-sort"
      // And we've got something like "ranges-apply".
      // Challenge: how do we match these as "related"?

      // first, exclude the current package
      if (nameOfOneOfPackages === packageName) {
        return false;
      }

      // if dash exists, extract the root part. "ranges-sort" -> "ranges"
      // that's a category which we'll match using String.startsWith()

      let groupCategory;
      if (packageName.includes("-")) {
        groupCategory = packageName.split("-")[0];

        // consider the package "str-indexes-of-plus"
        if (groupCategory === "str") {
          groupCategory = "string";
        }

        if (nameOfOneOfPackages.startsWith(groupCategory)) {
          return true;
        }
      }
    })
  )
    .filter((p) => !blackList.includes(p))
    .forEach(result.add, result);

  // remove the current package we're on, we don't want to suggest itself
  result.delete(packageName);

  if (result.size) {
    // if something was extracted, return that
    // only crop to 7 because that's been scientifically proven that peeps
    // can't handle more than 7 things in their brain "RAM" ("7 plus minus one rule")
    return [...result].slice(0, 7);
  }
  // else, return 5 random
  return arrayShuffle(Object.keys(compiledAssertionCountsAll).slice(0, 7));
};
