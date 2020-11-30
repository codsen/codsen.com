// pulls live "interdeps.json" from
// https://git.sr.ht/~royston/codsen/tree/master/stats/interdeps.json

const axios = require("axios");
const saveData = require("../../../utils/scripts/saveData.js");

const url = `https://git.sr.ht/~royston/codsen/blob/master/stats/interdeps.json`;

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
