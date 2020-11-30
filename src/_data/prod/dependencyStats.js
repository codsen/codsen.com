// pulls live "dependencyStats.json" from
// https://git.sr.ht/~royston/codsen/tree/master/stats/dependencyStats.json

const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://git.sr.ht/~royston/codsen/blob/master/stats/dependencyStats.json`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        saveData(
          JSON.stringify(response.data),
          `${__dirname}/../dev/dependencyStats.json`
        );
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
