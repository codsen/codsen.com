// pulls live "interdeps.json" from
// https://gitlab.com/codsen/codsen/-/blob/master/stats/interdeps.json

const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://gitlab.com/codsen/codsen/-/raw/master/stats/interdeps.json`;

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
