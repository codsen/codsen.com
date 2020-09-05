const { DateTime } = require("luxon");

const appendSuffix = n => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

// See https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
module.exports = (dateObj) => {
  return DateTime.fromJSDate(dateObj, {
    zone: "Europe/London",
  }).toFormat("DDDD");
};
