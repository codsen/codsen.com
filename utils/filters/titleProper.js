const title = require("title");

// See https://www.npmjs.com/package/string-strip-html
module.exports = (str) => {
  if (str && typeof str === "string" && !/\w\.\w/.test(str)) {
    return title(str);
  }
  return str;
};
