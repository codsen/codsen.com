/* eslint no-underscore-dangle: 0 */

// pulls live "dependencyStats.json" from
// https://gitlab.com/codsen/codsen/-/blob/master/stats/dependencyStats.json

const axios = require("axios");
const pMap = require("p-map");
const saveData = require("../../../utils/scripts/saveData.js");

const listOfPackageNamesUrl = `https://gitlab.com/codsen/codsen/-/raw/master/stats/compiledAssertionCounts.json`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(listOfPackageNamesUrl)
      .then((response) =>
        pMap(Object.keys(response.data.all), (packageName) => {
          return axios
            .get(
              `https://gitlab.com/codsen/codsen/-/raw/master/packages/${packageName}/examples/api.json`
            )
            .then((received) => {
              return [packageName, received.data];
            })
            .catch(() => {
              return [packageName, null];
            });
        })
      )
      .then((received) => {
        // We get an array of api.json's each containing all examples for that
        // package. Let's turn it into plain object,
        // { lib1: {<api.json for lib1>}, lib2: {<api.json for lib2>} }

        const preppedJson = Object.fromEntries(received);

        saveData(
          JSON.stringify(preppedJson),
          `${__dirname}/../dev/packageExamples.json`
        );
        resolve(preppedJson);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
