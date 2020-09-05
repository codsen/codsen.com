// we use same thing that lect uses to generate Rollup configs which in turn
// generate UMD packages
const camelCase = require("lodash.camelcase");

module.exports = (str) => camelCase(str);
