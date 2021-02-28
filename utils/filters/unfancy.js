const { unfancy } = require("string-unfancy");

// See https://www.npmjs.com/package/string-unfancy/
module.exports = (str) => {
  if (typeof str === "string" && str.length) {
    return unfancy(str.replace(/[`'"]/g, ""));
  }
  return str;
};
