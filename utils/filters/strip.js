const { stripHtml } = require("string-strip-html");

// See https://www.npmjs.com/package/string-strip-html
module.exports = (str) => {
  if (typeof str === "string") {
    return stripHtml(str).result;
  }
  return str;
};
