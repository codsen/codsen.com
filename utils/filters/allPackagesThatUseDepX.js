// Returns array of our monorepo packages which use a given package,
// either in package.json dependencies or devDependencies keys

module.exports = (packageJsons, checkedPackage) => {
  return Object.keys(packageJsons)
    .filter(
      (packageName) =>
        (packageJsons[packageName].dependencies &&
          packageJsons[packageName].dependencies[checkedPackage]) ||
        (packageJsons[packageName].devDependencies &&
          packageJsons[packageName].devDependencies[checkedPackage])
    )
    .map((packageName) => `- [\`${packageName}\`](/os/${packageName})`)
    .join("\n");
};
