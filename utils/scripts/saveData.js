const fs = require("fs");

module.exports = (data, path) => {
  if (process.env.ELEVENTY_ENV === "seed") {
    fs.writeFileSync(path, data);
    console.log(
      `saveData.js: ${`\u001b[${32}m${`Data saved for dev: ${path}`}\u001b[${39}m`}`
    );
  }
};
