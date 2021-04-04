const title = require("title");
const { stripHtml } = require("string-strip-html");
const { rApply } = require("ranges-apply");
const { rInvert } = require("ranges-invert");
const { rRegex } = require("ranges-regex");

function tagAwareTitle(str) {
  const whitelist = [
    "eslint",
    "rollup",
    "esbuild",
    "readme",
    "iife",
    "npm",
    "json",
    "svg",
    "xml",
    "css",
    "rss",
    "umd",
    "vs",
  ];

  const { filteredTagLocations } = stripHtml(str, {
    stripTogetherWithTheirContents: ["*"],
  });
  // console.log(
  //   `020 tagAwareTitle(): ${`\u001b[${33}m${`filteredTagLocations`}\u001b[${39}m`} = ${JSON.stringify(
  //     filteredTagLocations,
  //     null,
  //     4
  //   )}`
  // );
  const inverted = rInvert(
    filteredTagLocations.concat(
      whitelist.reduce((acc, curr) => {
        const rangesFindings = rRegex(new RegExp(curr, "gi"), str);
        if (rangesFindings) {
          return acc.concat(rangesFindings);
        }
        return acc;
      }, [])
    ),
    str.length
  );
  // console.log(
  //   `028 tagAwareTitle(): ${`\u001b[${33}m${`inverted`}\u001b[${39}m`} = ${JSON.stringify(
  //     inverted,
  //     null,
  //     4
  //   )}`
  // );

  if (Array.isArray(inverted) && inverted.length) {
    // take inverted ranges, for example, [[3, 4], [10, 15]]
    // and add third element, replacement, which is same character
    // indexes only processed through "title":
    return rApply(
      str,
      inverted.map(([from, to]) => [from, to, title(str.slice(from, to))])
    );
  }
  // otherwise, just apply title() on the whole string:
  return title(str);
}

module.exports = (str) => {
  if (typeof str === "string") {
    return tagAwareTitle(str);
  }
  return str;
};
