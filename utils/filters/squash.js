const { unfancy } = require("string-unfancy");
const { stripHtml } = require("string-strip-html");

/**
 * Make a search index string by removing duplicated words
 * and removing less useful, common short words
 *
 * @param {String} text
 */

module.exports = function squash(text) {
  // Insurance
  if (!text) {
    return "";
  }

  // Array incoming? Unlikely, but join it into string and continue!
  if (Array.isArray(text)) {
    text = text.join(" ");
  }

  return [
    // Remove duplicated words using Set
    ...new Set(
      unfancy(
        stripHtml(
          text
            .split("")
            // remove surrogates and any emoji
            .filter((char) => char.charCodeAt(0) < 55291)
            .join(""),
          {
            stripTogetherWithTheirContents: [
              "script",
              "style",
              "xml",
              "code",
              "pre",
            ],
          }
        ).result.toLowerCase()
      )
        // remove url's - https://stackoverflow.com/a/3809435/3943954
        .replace(
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
          ""
        )
        // remove newlines, and punctuation
        .replace(
          /\.|,|;|:|"|\+|=|'|`|\^|\?|!|\/|\(|\)|{|}|>|<|#|-|–|—|\n|\r|\t|\[|\]|\d/g,
          " "
        )
        // split by whitespace
        .split(/\s+/)
    ),
  ]
    .filter(
      (keyw) =>
        ![
          "a",
          "all",
          "am",
          "an",
          "and",
          "as",
          "at",
          "be",
          "but",
          "d",
          "do",
          "for",
          "has",
          "i",
          "if",
          "in",
          "is",
          "it",
          "ll",
          "me",
          "my",
          "no",
          "not",
          "of",
          "off",
          "on",
          "or",
          "s",
          "so",
          "to",
          "up",
          "ve",
          "was",
          "we",
          "you",
          "the",
        ].includes(keyw) && keyw.length > 1
    )
    .join(" ")
    .trim();
};
