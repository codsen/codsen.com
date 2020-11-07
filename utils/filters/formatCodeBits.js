// takes string, npm package description, and extracts chunks meant to be
// under code-pre (not not possible due to package.json limitations) - then
// it wraps those with <code>

const whitelistChunk = [
  "node-tap",
  "t.same",
  "ava",
  "t.deepEqual",
  "class",
  "id",
  "alt",
  "img",
  "console.log",
  "npm-check-updates",
  "json-comb",
  "indexOf",
  "commitizen",
];

module.exports = (str) => {
  // insurance
  if (!str || typeof str !== "string" || !str.length) {
    return str;
  }
  // now we know it's a string and a non-empty-one
  return (
    str
      // split by whitespace
      .split(/\s+/)
      // wrap chunk with <code>
      .map((chunk) =>
        whitelistChunk.includes(chunk) ||
        chunk.startsWith("_.") ||
        chunk.startsWith("String.")
          ? `<code>${chunk}</code>`
          : chunk
      )
      // custom overrides
      .map((chunk) => {
        if (chunk === "id)") {
          return `<code>id</code>)`;
        }
        if (chunk === "console.logs") {
          return `<code>console.log</code>s`;
        }
        return chunk;
      })
      // join back
      .join(" ")
  );
};
