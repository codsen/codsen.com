// extracts the root path:
// in: /articles/1/
// out: /articles/

// used in matching what to underline in nav, necessary
// for any pages with pagination or deeper-level pages (/articles/tags/zzz/)

module.exports = (str) => {
  // insurance
  if (!str || !str.length) {
    return str;
  }
  return `/${str.split("/").filter((v) => v.trim())[0]}/`;
};
