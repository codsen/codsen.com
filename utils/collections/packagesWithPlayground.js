const webApps = require("../../src/_data/webapps.json");

// Extract an array of package names which have a playground
module.exports = () => {
  return [
    // dedupe using a Set (for extra-insurance)
    ...new Set(
      // get array of root-level keys in webapps.json
      Object.keys(webApps)
        // filter those which have a value of a plain object
        // without a "url" entry (meaning local playgrounds)
        .filter((key) => !webApps[key].url)
    ),
  ];
};
