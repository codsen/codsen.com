// adds thousand separators

module.exports = (str) => {
  if (!str) return "";
  const nums = String(str).replace(/,/g, "");
  if (!nums) return "";
  return parseInt(str, 10).toLocaleString();
};
