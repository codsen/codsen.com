module.exports = (str, val) => {
  if (typeof str === "string") {
    return str.startsWith(val);
  }
  return str;
};
