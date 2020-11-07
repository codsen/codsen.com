const converter = require("number-to-words");

module.exports = (num) => {
  if (["string", "number"].includes(typeof num)) {
    return converter.toOrdinal(+num);
  }
  if (Array.isArray(num)) {
    return converter.toOrdinal(num.length);
  }
  if (num && typeof num === "object") {
    return converter.toOrdinal(Object.keys(num).length);
  }
  // do nothing
  return num;
};
