// Problem: in our design, HTML header tags have sup elements on top.
// We want the sup text to be tight above top right corner of the header tag.
// Now, sometimes, header ends with tall lowercase letters like "L", "T" or "I"
// which reduce the margin between header and sup. If we increase it, then
// headers with short letters "A" etc will have an excessive gap.
//
// Solution is to add an extra class on header tag which marks if any of the
// last three letters are tall.
//
// Function returns a boolean.

module.exports = (str) => {
  let source = str;
  if (str.includes("-")) {
    source = str.split("-").pop();
  }

  if (source.length > 2) {
    source = source.slice(-2);
  }

  return !!source
    .split("")
    .filter((letter) => "tidfhjklb".includes(letter))
    .join("");
};
