const arrayShuffle = require("array-shuffle");

module.exports = (arr) => {
  // insurance
  if (!arr || !Array.isArray(arr) || arr.length < 2) {
    return arr;
  }
  // the real deal
  return arrayShuffle(arr);
};
