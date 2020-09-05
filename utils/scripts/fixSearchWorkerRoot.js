#!/usr/bin/env node

// SEARCH function
// -----------------------------------------------------------------------------

// reads dist/search.json, grabs its contents and replaces
// the magic placeholder in bundle/js/search-worker.js
// with those contents

const fs = require("fs");
const path = require("path");

const hash = String(fs.readFileSync("hash.txt", "utf8")).trim();

const searchIndexContents = fs.readFileSync(
  path.resolve("dist/search.json"),
  "utf8"
);

const appJsContents = fs.readFileSync(
  path.resolve(`dist/assets/${hash}/js/app.js`),
  "utf8"
);
const workerContents = fs.readFileSync(
  path.resolve(`src/assets/js/search-worker.js`),
  "utf8"
);

fs.writeFileSync(
  path.resolve(`src/assets/js/search-worker.js`),
  workerContents.replace(
    /const searchIndex.+/,
    `const searchIndex = ${searchIndexContents.trim()};`
  )
);
console.log(
  `utils/scripts/fixSearchWorkerRoot.js: ${`\u001b[${34}m${`Writing`}\u001b[${39}m`} src/assets/js/search-worker.js`
);

fs.writeFileSync(
  path.resolve(`dist/assets/${hash}/js/app.js`),
  appJsContents.replace(/http:\/\/localhost:8080\//, "https://codsen.com/")
);
console.log(
  `utils/scripts/fixSearchWorkerRoot.js: ${`\u001b[${34}m${`Writing`}\u001b[${39}m`} dist/assets/${hash}/js/app.js`
);
