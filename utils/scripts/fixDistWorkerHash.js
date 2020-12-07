#!/usr/bin/env node

// SEARCH function
// -----------------------------------------------------------------------------

// reads dist/search.json, grabs its contents and replaces
// the magic placeholder in bundle/js/search-worker.js
// with those contents

const fs = require("fs");
const path = require("path");

const hash = String(fs.readFileSync("hash.txt", "utf8")).trim();

const appJsContents = fs.readFileSync(
  path.resolve(`dist/assets/${hash}/js/app.js`),
  "utf8"
);

fs.writeFileSync(
  path.resolve(`dist/assets/${hash}/js/app.js`),
  appJsContents.replace(/REPLACE_WITH_HASH_URL/, hash)
);

console.log(
  `utils/scripts/fixDistWorkerHash.js: ${`\u001b[${34}m${`Wrote`}\u001b[${39}m`} dist/assets/${hash}/js/app.js`
);

// /os/ homepage interdeps chart JSON
// -----------------------------------------------------------------------------

// 1. copy the json

fs.copyFileSync(
  "./src/_data/dev/interdeps.json",
  `./dist/assets/${hash}/js/interdeps.json`
);

// 2. replace the hash placeholder in interdeps.js
const interdepsJsContents = fs.readFileSync(
  path.resolve(`dist/assets/${hash}/js/interdeps.js`),
  "utf8"
);

fs.writeFileSync(
  path.resolve(`dist/assets/${hash}/js/interdeps.js`),
  interdepsJsContents.replace(/REPLACE_WITH_HASH_URL/, hash)
);

console.log(
  `utils/scripts/fixDistWorkerHash.js: ${`\u001b[${34}m${`Copied`}\u001b[${39}m`} dist/assets/${hash}/js/interdeps.json`
);
