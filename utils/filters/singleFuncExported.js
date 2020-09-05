// our npm packages have internal field in package.json which tells,
// what's the export.
// For example, Detergent's package.json > lect.rec key is
// { det, opts, version }
// This filter below would return false

// Another example, package "detect-is-it-html-or-xhtml" is string-in/string-out,
// it exports only one function as default, package.json > lect.rec key is
// detectIsItHTMLOrXhtml
// This filter below would return true

// This will be used in /os/<package>/ single page sidebars, to identify single
// function packages and be able to tell people in UMD section that
// "replace with <lect.rec key>" is the function you get.

// PS. cli apps doesn't even have a package.json > lect.rec key
// for example, chlu-cli
// so code defensively
module.exports = (str) => typeof str === "string" && !str.includes("{");
