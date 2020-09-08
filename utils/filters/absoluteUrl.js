module.exports = (url, base = "https://codsen.com") => {
  try {
    return new URL(url, base).toString();
  } catch (e) {
    console.log(
      `\u001b[${31}m${`Tried to convert ${url} to be an absolute url with base ${base} but failed`}\u001b[${39}m`
    );
    return url;
  }
};
