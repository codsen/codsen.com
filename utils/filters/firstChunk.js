module.exports = (str) => {
  // insurance
  if (!str || typeof str !== "string" || !str.length || !str.includes("-")) {
    return str;
  }
  // the real deal
  return str.split("-")[0];
};
