const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://raw.githubusercontent.com/codsen/codsen/main/stats/interdeps.json`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        saveData(
          JSON.stringify(response.data),
          `${__dirname}/../dev/interdeps.json`
        );
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
