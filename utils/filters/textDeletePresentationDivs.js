// removes <div role="presentation">...</div> - used in RSS <content> tags
module.exports = (str) =>
  str
    .replace(
      /\s*<\s*div role="presentation"[^>]*>([\s\S]*?)<\s*\/\s*div>\s*/g,
      ""
    )
    .replace(
      /\s*<\s*a class="header-anchor"[^>]*>([\s\S]*?)<\s*\/\s*a>\s*/g,
      ""
    );
