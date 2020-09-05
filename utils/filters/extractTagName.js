// in: "/articles/tag/amazon/"
// out: "amazon"

module.exports = (str = "") => {
  if (!str || !str.includes("/")) {
    return str;
  }
  const arr = str.split("/").filter((val) => val.trim());
  return arr[arr.length - 1];
};
