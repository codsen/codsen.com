// renders a unique string for cache-busting purposes
// returns it for asker (Eleventy global) but also,
// saves it in the root for post-processing scripts to
// pick upon when shuffling folders later

const fs = require("fs");

module.exports = () => {
  const hash = String(fs.readFileSync("hash.txt", "utf8")).trim();
  return {hash};
};
