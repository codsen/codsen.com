const { DateTime } = require("luxon");

// converts the date into ISO format, "2020-06-10"
// https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens

module.exports = (dateObj) => {
  return DateTime.fromJSDate(dateObj, {
      zone: "Europe/London"
    }).toISODate();
};
