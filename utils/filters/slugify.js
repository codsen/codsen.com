const stripHtml = require("string-strip-html");
const markdownIt = require("markdown-it");
const uslug = require("uslug");

module.exports = (str) => {
  if (str.endsWith(".js")) {
    // remove .js - needed for codsen.com/os/ example file-page slugs
    str = str.replace(/\.js/, "");
  }
  return uslug(stripHtml(markdownIt({ html: true }).renderInline(str)).result);
};
