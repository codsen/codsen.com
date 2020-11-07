const converter = require("number-to-words");

module.exports = (num) => {
  if (["string", "number"].includes(typeof num)) {
    return converter.toWords(+num);
  }
  if (Array.isArray(num)) {
    return converter.toWords(num.length);
  }
  if (num && typeof num === "object") {
    return converter.toWords(Object.keys(num).length);
  }
  // do nothing
  return num;
};
