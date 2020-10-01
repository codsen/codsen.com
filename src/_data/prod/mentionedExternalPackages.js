const fs = require("fs");
const path = require("path");
const parseFrontMatter = require("gray-matter");
const pacote = require("pacote");
const saveData = require("../../../utils/scripts/saveData.js");

// function getDirectories(path) {
//   return fs.readdirSync(path).filter(function (file) {
//     return fs.statSync(path+'/'+file).isDirectory();
//   });
// }

let fileList;
const extractAllMentionedPackages = (rootPath, saveDownFileList = false) => {
  return (
    fs.promises
      // read articles folder
      .readdir(rootPath)
      // extract all .md files
      .then((received) => received.filter((val) => path.extname(val) === ".md"))
      // read every .md path and parse its front-matter
      .then((received) => {
        if (saveDownFileList) {
          fileList = received.map((val) => path.basename(val, ".md"));
        }
        return Promise.all(
          received.map((filePath) =>
            fs.promises
              .readFile(path.join(rootPath, filePath), "utf8")
              .then((contents) => {
                if (
                  parseFrontMatter(contents) &&
                  parseFrontMatter(contents).data &&
                  Array.isArray(parseFrontMatter(contents).data.packages)
                ) {
                  return parseFrontMatter(contents).data.packages;
                }
                return [];
              })
          )
        );
      })
      // flatten array of arrays into one array
      .then((received) => received.reduce((acc, curr) => acc.concat(curr), []))
      // filter unique then sort
      .then((received) => [...new Set(received)].sort())
    // log result
    // .then((received) => {
    //   console.log(
    //     `███████████████████████████████████████ ${`\u001b[${33}m${`received`}\u001b[${39}m`} = ${JSON.stringify(
    //       received,
    //       null,
    //       4
    //     )}`
    //   );
    //   return received;
    // })
  );
};

module.exports = async () => {
  const p1 = await extractAllMentionedPackages("src/articles");
  // console.log(
  //   `${`\u001b[${33}m${`p1`}\u001b[${39}m`} = ${JSON.stringify(p1, null, 4)}`
  // );
  const p2 = await extractAllMentionedPackages("src/os", true);
  // console.log(
  //   `${`\u001b[${33}m${`p2`}\u001b[${39}m`} = ${JSON.stringify(p2, null, 4)}`
  // );
  // console.log(
  //   `${`\u001b[${33}m${`fileList`}\u001b[${39}m`} = ${JSON.stringify(
  //     fileList,
  //     null,
  //     4
  //   )}`
  // );

  // ============

  const externalPackages = [...new Set(p1.concat(p2))]
    .filter((pack) => !fileList.includes(pack))
    .sort();
  console.log(
    `${`\u001b[${33}m${`externalPackages`}\u001b[${39}m`} = ${JSON.stringify(
      externalPackages,
      null,
      4
    )}`
  );

  return Promise.all(
    externalPackages.map((p) =>
      pacote
        .manifest(p, {
          fullMetadata: true,
        })
        .then((pkg) => {
          if (!pkg.version) {
            return Promise.reject(
              new Error(`${p} version from npm came as null!`)
            );
          }
          // console.log(
          //   `${`\u001b[${33}m${`pkg`}\u001b[${39}m`} = ${JSON.stringify(
          //     pkg,
          //     null,
          //     4
          //   )}`
          // );
          return [p, pkg.description];
        })
    )
  )
    .then((received) => {
      return Object.fromEntries(received);
    })
    .then((received) => {
      saveData(
        JSON.stringify(received),
        `${__dirname}/../dev/mentionedExternalPackages.json`
      );
      return received;
    });
};
