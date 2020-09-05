const stripHtml = require("string-strip-html");

// See https://www.npmjs.com/package/string-strip-html
module.exports = (str) => {
  return stripHtml(str).result;
};
