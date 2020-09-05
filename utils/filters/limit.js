// basically Array.slice() only as a filter for Nunjucks use, with insurance

module.exports = (arr, end) => {
  // insurance
  if (!arr || !Array.isArray(arr) || !arr.length || arr.length <= end) {
    return arr;
  }
  // the real deal
  return arr.slice(0, end);
};
