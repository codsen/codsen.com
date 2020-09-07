// trim, remove trailing punctuation, then trim again

module.exports = (str) => {
  if (!str || typeof str !== "string") {
    return str;
  }
  if (![".", "?", "!", ";"].includes(str.trim().slice(-1))) {
    return str.trim();
  }

  return str.trim().slice(0, -1).trim();
};
