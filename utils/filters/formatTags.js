module.exports = (str) => {
  const tags = ["table", "tr", "td"];
  const re = new RegExp(`\\b(${tags.join("|")})\\b`, "gi");
  return str
    .replace(re, (match, p1) => `<code>${p1}</code>`.toLowerCase())
    .replace(/HTML/gi, "HTML")
    .replace(/CSS/gi, "CSS")
    .replace(/\bjs\b/gi, "JS");
};
