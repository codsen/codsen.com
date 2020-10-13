const title = require("title");
const stripHtml = require("string-strip-html");
const applyRanges = require("ranges-apply");
const invertRanges = require("ranges-invert");
const rangesRegex = require("ranges-regex");

function tagAwareTitle(str) {
  const whitelist = ["eslint", "readme", "npm"];

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
  const inverted = invertRanges(
    filteredTagLocations.concat(
      whitelist.reduce((acc, curr) => {
        const rangesFindings = rangesRegex(new RegExp(curr, "gi"), str);
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
    return applyRanges(
      str,
      inverted.map(([from, to]) => [from, to, title(str.slice(from, to))])
    );
  }
  // otherwise, just apply title() on the whole string:
  return title(str);
}

module.exports = (str) => {
  if (str && typeof str === "string" && !/\w\.\w/.test(str)) {
    return tagAwareTitle(str);
  }
  return str;
};
