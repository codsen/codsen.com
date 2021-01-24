// pulls the live CI Config, it's referred to in some blog posts or packages
// for example, "/os/lerna-clean-changelogs-cli/"

const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://github.com/codsen/codsen.com/blob/main/.semaphore/semaphore.yml`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        saveData(
          JSON.stringify(response.data),
          `${__dirname}/../dev/ciConfig.json`
        );
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
