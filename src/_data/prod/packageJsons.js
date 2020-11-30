/* eslint no-underscore-dangle: 0 */

const axios = require("axios");
const pacote = require("pacote");
const pMap = require("p-map");
const saveData = require("../../../utils/scripts/saveData.js");

const listOfPackageNamesUrl = `https://git.sr.ht/~royston/codsen/blob/master/stats/compiledAssertionCounts.json`;

module.exports = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(listOfPackageNamesUrl)
      .then((response) =>
        pMap(Object.keys(response.data.all), (packageName) => {
          // query the npm, get the full package.json of this package
          return pacote
            .manifest(packageName, { fullMetadata: true })
            .then((pkg) => {
              if (pkg.version === null) {
                throw new Error(
                  `${packageName} version from npm came as null, CLI will exit now, nothing was written.`
                );
              }
              const amendedPkg = pkg;
              delete amendedPkg.dist;
              delete amendedPkg._resolved;
              delete amendedPkg._from;
              delete amendedPkg._integrity;
              delete amendedPkg._nodeVersion;
              delete amendedPkg._npmVersion;
              delete amendedPkg._npmUser;
              delete amendedPkg._npmOperationalInternal;
              delete amendedPkg._hasShrinkwrap;
              delete amendedPkg._id;
              return amendedPkg;
            });
        })
      )
      .then((received) => {
        // We get an array of package.json's. Let's turn it into plain object,
        // there each package.json sits under package's name key:
        // { lib1: {<package.json for lib1>}, lib2: {<package.json for lib2>} }

        const preppedJson = Object.fromEntries(
          received.map((pkgObj) => [pkgObj.name, pkgObj])
        );

        saveData(
          JSON.stringify(preppedJson),
          `${__dirname}/../dev/packageJsons.json`
        );
        resolve(preppedJson);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
