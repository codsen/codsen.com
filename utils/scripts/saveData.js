const writeFileAtomic = require("write-file-atomic");
const path = require("path");

module.exports = (data, filename) => {
  if (process.env.ELEVENTY_ENV === "seed") {
    writeFileAtomic(filename, data, (err) => {
      if (err) throw err;

      // truncate the URL to be project's
      // +1 removes leading slash
      const rootUrlLen = path.resolve(".").length + 1;
      console.log(
        `saveData.js: Writing ${path.resolve(filename).slice(rootUrlLen)}.`
      );
    });
  }
};
