// inspired by:
// https://github.com/11ty/eleventy-base-blog/blob/ffef660e0e96b2ee69dac7e0a5b9e2aa87ebc5a6/_11ty/getTagList.js

module.exports = (collectionApi) => {
  // Compile array of all tags. We're interested in the list of them all.
  let tagsArr = [];
  collectionApi.getAll().forEach((item) => {
    if ("tags" in item.data) {
      const tags = item.data.tags;
      tagsArr = tagsArr.concat(
        tags.filter(
          (tagVal) => !["all", "nav", "post", "posts"].includes(tagVal)
        )
      );
    }
  });

  // Calculate frequencies of each tag
  const frequency = {};
  tagsArr.forEach((item) => {
    frequency[item] = frequency[item] ? frequency[item] + 1 : 1;
  });

  // Sort by frequencies
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map((x) => {
      return x[0];
    });
};
