// inspired by:
// https://github.com/11ty/eleventy-base-blog/blob/ffef660e0e96b2ee69dac7e0a5b9e2aa87ebc5a6/_11ty/getTagList.js

module.exports = (collectionApi) => {
  const tagSet = new Set();
  collectionApi.getAll().forEach((item) => {
    if ("tags" in item.data) {
      let tags = item.data.tags;

      tags = tags.filter(
        (tagVal) => !["all", "nav", "post", "posts"].includes(tagVal)
      );

      for (const tag of tags) {
        tagSet.add(tag);
      }
    }
  });

  // returning an array in addCollection works in Eleventy 0.5.3
  return [...tagSet];
};
