#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const vercel = require("../../vercel.json");

if (vercel && Array.isArray(vercel.redirects) && vercel.redirects.length) {
  vercel.redirects.forEach((redirectObj, idx) => {
    // 1. enforce schema - only 3 keys - source, destination and statusCode
    // -------------------------------------------------------------------------
    const schemaKeys = ["source", "destination", "statusCode"];

    if (
      Object.keys(redirectObj).length !== 3 ||
      Object.keys(redirectObj).some((key) => !schemaKeys.includes(key))
    ) {
      const missing = schemaKeys.filter(
        (key) => !Object.keys(redirectObj).includes(key)
      );
      const rogue = Object.keys(redirectObj).filter(
        (key) => !schemaKeys.includes(key)
      );

      throw new Error(
        `${`\u001b[${31}m${`ERROR! The keys in the redirect object are wrong.${
          missing.length
            ? ` The following keys are missing: ${missing
                .map((s) => `"${s}"`)
                .join(", ")}.`
            : ""
        }${
          rogue.length
            ? ` The following keys are unrecognised: ${rogue
                .map((s) => `"${s}"`)
                .join(", ")}.`
            : ""
        } Check ${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    }

    // 2. ensure that each path in "source" does not exist
    // -------------------------------------------------------------------------
    const sourcePath = path.join("dist", redirectObj.source, "index.html");
    let fileFound = false;
    try {
      // existence of template.html
      fs.accessSync(sourcePath, fs.F_OK);
      fileFound = sourcePath;
    } catch (e) {
      //
    }

    if (fileFound) {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! SOURCE "${redirectObj.source}" EXISTS!`}\u001b[${39}m`} check:\n${`\u001b[${31}m${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}\u001b[${39}m`}`
      );
    } else {
      // console.log(`${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);
    }

    // 3. ensure that each path in "destination" does exist
    // -------------------------------------------------------------------------
    const destinationPath = path.join(
      "dist",
      redirectObj.destination,
      "index.html"
    );
    try {
      // existence of template.html
      fs.accessSync(destinationPath, fs.F_OK);
    } catch (e) {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! DESTINATION "${redirectObj.destination}" DOES NOT EXIST!`}\u001b[${39}m`} check:\n${`\u001b[${31}m${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}\u001b[${39}m`}`
      );
    }
    // console.log(`${`\u001b[${32}m${`OK`}\u001b[${39}m`}`);

    // 4. check are there really less than 1024 redirects?
    // -------------------------------------------------------------------------
    if (vercel.redirects.length >= 1024) {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! There are ${vercel.redirects.length} redirects, while max amount allowed is 1024.`}\u001b[${39}m`}`
      );
    }

    // 5. validate the status code
    // -------------------------------------------------------------------------
    if (!redirectObj.statusCode || typeof redirectObj.statusCode !== "number") {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! Status code is not a number! Check ${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    }

    // 6. duplicates alert
    // -------------------------------------------------------------------------
    if (
      vercel.redirects.some(
        (obj, currIdx) => obj.source === redirectObj.source && currIdx !== idx
      )
    ) {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! Duplicate detected! Check ${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    }

    // 7. enforce no http://
    // -------------------------------------------------------------------------
    if (
      redirectObj.source.includes("http") ||
      redirectObj.destination.includes("http")
    ) {
      throw new Error(
        `${`\u001b[${31}m${`ERROR! http:// detected! Paths should be relative. Check ${JSON.stringify(
          vercel.redirects[idx],
          null,
          4
        )}`}\u001b[${39}m`}`
      );
    }

    // 8. sort "vercel.redirects" array and overwrite
    // -------------------------------------------------------------------------
    vercel.redirects = vercel.redirects.sort((objA, objB) => {
      // objA is less than objB by some ordering criterion
      if (objA.source < objB.source) {
        return -1;
      }
      // objA is greater than objB by the ordering criterion
      if (objA.source > objB.source) {
        return 1;
      }
      // objA must be equal to objB
      return 0;
    });
    fs.writeFileSync("vercel.json", JSON.stringify(vercel, null, 2));
  });
}
