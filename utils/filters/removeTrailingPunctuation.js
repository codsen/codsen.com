// strips trailing punctuation
module.exports = (str) => {
  if (typeof str === "string" && ["."].includes(str.slice(-1))) {
    return str.slice(0, str.length - 1);
  }
  return str;
};
