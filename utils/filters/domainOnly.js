const url = require("url");

// extracts domain from URL string, removes www too, if present

module.exports = (str) => {
  const urlParts = url.parse(String(str), false);
  // const query = url_parts.query;
  if (urlParts && urlParts.hostname) {
    return urlParts.hostname.replace(/www\./, "");
  }
  return str;
};
