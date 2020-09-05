// pulls live GitLab CI Config, it's referred to in some blog posts or packages
// for example, "/os/lerna-clean-changelogs-cli/"

const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://gitlab.com/codsen/codsen/-/raw/master/.gitlab-ci.yml`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        saveData(
          JSON.stringify(response.data),
          `${__dirname}/../dev/gitlabCIConfig.json`
        );
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
