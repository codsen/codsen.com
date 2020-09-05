// takes (randomised order) array of package names and a name of one of the
// packages, tells you which one is next from that list

module.exports = (arrOfPackageNames, packageNameStr) => {
  // insurance
  if (
    !arrOfPackageNames ||
    !Array.isArray(arrOfPackageNames) ||
    !arrOfPackageNames.length
  ) {
    throw new Error(
      "utils/filters/getNextPackage.js - list of all packages is missing!"
    );
  }
  const currentIdx = arrOfPackageNames.indexOf(packageNameStr);

  // either picks next if exists or the first:
  return arrOfPackageNames[currentIdx + 1] || arrOfPackageNames[0];
};
