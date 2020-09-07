const contentParser = require('./utils/transforms/contentParser.js')
const htmlMinTransform = require('./utils/transforms/htmlmin.js')
const fs = require('fs')
const markdownIt = require("markdown-it")
const compiledAssertionCounts = require("./src/_data/prod/compiledAssertionCounts.js")
const uslug = require('uslug')
const uslugify = s => uslug(s)
const arrayShuffle = require("array-shuffle");
const implicitFigures = require("markdown-it-implicit-figures")

/**
 * Import site configuration
 */
const config = require('./src/_data/config.json')

/**
 * Import hash value from the root
 */
const hash = String(fs.readFileSync("hash.txt", "utf8")).trim();
console.log(`ELEVENTY CONFIG ${`\u001b[${33}m${`hash`}\u001b[${39}m`} = ${JSON.stringify(hash, null, 4)}`)

module.exports = function (eleventyConfig) {
  /**
   * A useful way to reference the context we are runing eleventy in
   */
  let env = process.env.ELEVENTY_ENV;

  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  eleventyConfig.addWatchTarget('./bundle/')

  /**
   * Set up excerpts
   */
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  })

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.io/docs/copy/
   */
  eleventyConfig.addPassthroughCopy({
    './static': '.'
  })
  eleventyConfig.addPassthroughCopy(`./src/assets/css/${config.syntaxTheme}`)
  eleventyConfig.addPassthroughCopy({
    bundle: `assets/${hash}`
  })

  /**
   * Add filters
   *
   * @link https://www.11ty.io/docs/filters/
   */
  // human friendly date format
  eleventyConfig.addFilter("dateDisplay", require("./utils/filters/date.js"));
  // prepare search contents
  eleventyConfig.addFilter("squash", require("./utils/filters/squash.js"));
  // robot friendly date format for crawlers
  eleventyConfig.addFilter("iso", require("./utils/filters/dateIso.js"));
  // extract domain only from a URL
  eleventyConfig.addFilter("domainOnly", require("./utils/filters/domainOnly.js"));
  // strip html upon request
  eleventyConfig.addFilter("strip", require("./utils/filters/strip.js"));
  // add <br> in front of dashes in h*
  eleventyConfig.addFilter("breakDashes", require("./utils/filters/breakDashes.js"));
  // extracts "amazon" from "/articles/tag/amazon/" in <title>
  eleventyConfig.addFilter("extractTagName", require("./utils/filters/extractTagName.js"));
  // turns "/articles/aaa/bbb/ccc/" into "/articles/", used to underline nav
  eleventyConfig.addFilter("rootUrl", require("./utils/filters/rootUrl.js"));
  // turns "/articles/aaa/bbb/ccc/" into "/articles/aaa/bbb/", used calculate the "edit on GitLab" URL
  eleventyConfig.addFilter("goUpUrl", require("./utils/filters/goUpUrl.js"));
  // turns package name into global (remove dashes and turn camelcase)
  eleventyConfig.addFilter("packageGlobal", require("./utils/filters/packageGlobal.js"));
  // returns boolean, are any of last three letters are tall ("t" or "i" or "l" etc)
  eleventyConfig.addFilter("isTall", require("./utils/filters/isTall.js"));
  // adds thousand separators
  eleventyConfig.addFilter("thousandSeparator", require("./utils/filters/thousandSeparator.js"));
  // slug generation
  eleventyConfig.addFilter("slugify", require("./utils/filters/slugify.js"));
  // report the name of the first consumer within the monorepo
  eleventyConfig.addFilter("firstConsumer", require("./utils/filters/firstConsumer.js"));
  // boolean flag, is given import a single function
  eleventyConfig.addFilter("singleFuncExported", require("./utils/filters/singleFuncExported.js"));
  // filters list of package name against list of package names and or globs
  eleventyConfig.addFilter("matchPackageName", require("./utils/filters/matchPackageName.js"));
  // takes list of packages and single package name and compiles a list related packages
  eleventyConfig.addFilter("filterRelatedPackages", require("./utils/filters/filterRelatedPackages.js"));
  // basically, Array.slice(), plus insurance and takes "end" argument, slicing (0, end)
  eleventyConfig.addFilter("limit", require("./utils/filters/limit.js"));
  // taps "array-shuffle" from npm
  eleventyConfig.addFilter("shuffle", require("./utils/filters/shuffle.js"));
  // picks next element from the array
  eleventyConfig.addFilter("getNextPackage", require("./utils/filters/getNextPackage.js"));
  // picks previous element from the array
  eleventyConfig.addFilter("getPrevPackage", require("./utils/filters/getPrevPackage.js"));
  // package.json "description" field value massaging
  eleventyConfig.addFilter("formatCodeBits", require("./utils/filters/formatCodeBits.js"));
  // ranges-sort-all -> ranges
  eleventyConfig.addFilter("firstChunk", require("./utils/filters/firstChunk.js"));
  // Array.concat
  eleventyConfig.addFilter("concat", require("./utils/filters/concat.js"));
  // Object.keys
  eleventyConfig.addFilter("objectKeys", require("./utils/filters/objectKeys.js"));
  // trim punctuation - used in social card metadata descriptions
  eleventyConfig.addFilter("trimPunctuation", require("./utils/filters/trimPunctuation.js"));

  // determines what's the type of the article
  eleventyConfig.addFilter("calculateType", arr => {
    if (!Array.isArray(arr) || !arr.length) {
      return "article"
    }
    if (arr.includes("video")) {
      return "video"
    }
    return "article"
  });
  // diy slugify
  eleventyConfig.addFilter("slugify", (str) => {
    return str.toLowerCase().replace(/\s+/g, "-");
  });
  // for explorations
  eleventyConfig.addFilter("dump", function(code) {
    return JSON.stringify(Object.keys(code), null, 4);
  });

  // takes:
  // "/articles/tag/all/"
  // returns:
  // "articles"
  eleventyConfig.addFilter("extractStem", function(str = "") {
    return str.split("/").filter(val => val.trim())[0]
  });

  // render excerpts
  eleventyConfig.addFilter("md", function(content = "") {
    return markdownIt({
      html: true
    }).render(content)
  });

  /**
   * Add Transforms
   *
   * @link https://www.11ty.io/docs/config/#transforms
   */
  if (env === 'prod') {
    // Minify HTML when building for production
    eleventyConfig.addTransform('htmlmin', htmlMinTransform)
  }
  // Parse the page HTML content and perform some manipulation
  eleventyConfig.addTransform('contentParser', contentParser)

  /**
   * Add Plugins
   * @link https://github.com/11ty/eleventy-plugin-rss
   * @link https://github.com/11ty/eleventy-plugin-syntaxhighlight
   */
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-rss'))
  eleventyConfig.addPlugin(require('@11ty/eleventy-plugin-syntaxhighlight'))
  eleventyConfig.addPlugin(require("eleventy-plugin-markdown-shortcode"), {
    html: true,
    linkify: true,
});

  /**
   * Blog posts collection for blog and feed
   * @link https://github.com/hankchizljaw/hylia
   */
  const now = new Date()
  const livePosts = post => post.date <= now && !post.data.draft
  eleventyConfig.addCollection('posts', collectionApi => {
    return [
      ...collectionApi
        .getFilteredByGlob(
          `./${config.paths.src}/${config.paths.blogdir}/**/*`
        )
        .filter(livePosts),
    ]
  })
  eleventyConfig.addCollection('now', collectionApi => {
    return [
      ...collectionApi
        .getFilteredByGlob(
          `./${config.paths.src}/now/**/*`
        )
    ]
  })
  eleventyConfig.addCollection('allPackagesRandomList', collectionApi => {
    return arrayShuffle([
      ...collectionApi
        .getFilteredByGlob(
          `./${config.paths.src}/os/*`
        ),
    ].map(packagePostObj => packagePostObj.data.title))
  })

  /**
   * All tags collection for page "/articles/tag/all/"
   * used:
   *
   * @link https://github.com/11ty/eleventy-base-blog/blob/ffef660e0e96b2ee69dac7e0a5b9e2aa87ebc5a6/.eleventy.js
   */
  eleventyConfig.addCollection("tagList", require("./utils/collections/getTagList.js"));
  eleventyConfig.addCollection("tagListSortedByCount", require("./utils/collections/tagListSortedByCount.js"));

  /**
   * Override BrowserSync Server options
   *
   * @link https://www.11ty.dev/docs/config/#override-browsersync-server-options
   */
  eleventyConfig.setBrowserSyncConfig({
    notify: false,
    open: true,
    snippetOptions: {
      rule: {
        match: /<\/head>/i,
        fn: function (snippet, match) {
          return snippet + match
        },
      },
    },
    // Set local server 404 fallback
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      },
    },
  })

  /**
   * Filter array of strings, names of Ranges libraries.
   * Also, first list exact order as "packageCategories.rangeLibsList",
   * then append other range libraries at the end, filtered from
   * "compiledAssertionCounts.all".
   */
  eleventyConfig.addFilter("libsRange", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.startsWith("ranges-"))))];
  });
  eleventyConfig.addFilter("libsHtml", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.startsWith("html-"))))];
  });
  eleventyConfig.addFilter("libsString", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.startsWith("string-"))))];
  });
  eleventyConfig.addFilter("libsObject", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.startsWith("ast-") || libName.startsWith("object-"))))];
  });
  eleventyConfig.addFilter("libsLerna", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.startsWith("lerna-"))))];
  });
  eleventyConfig.addFilter("libsCli", (alreadySortedArr = [], all) => {
    return [...new Set(alreadySortedArr.concat(Object.keys(all).filter(libName => libName.endsWith("-cli"))))];
  });
  eleventyConfig.addFilter("libsMisc", (all, remove1, remove2, remove3, remove4, remove5, remove6, remove7) => {
    return [...new Set(Object.keys(all).filter(val => (
      !remove1.includes(val) &&
      !remove2.includes(val) &&
      !remove3.includes(val) &&
      !remove4.includes(val) &&
      !remove5.includes(val) &&
      !remove6.includes(val) &&
      !remove7.includes(val)
    )))];
  });

  /**
   * Add Markdown plugins
   *
   * @link https://www.11ty.dev/docs/languages/markdown/
   */
   let markdownLib = markdownIt({
     html: true,
   })
    .disable('code')
    .use(require('markdown-it-kbd'))
    .use(require('markdown-it-anchor'), {
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: "§",
      slugify: uslugify
    })
    .use(implicitFigures, {
      dataType: false,  // <figure data-type="image">, default: false
      figcaption: false,  // <figcaption>alternative text</figcaption>, default: false
      tabindex: false, // <figure tabindex="1+n">..., default: false
      link: false // <a href="img.png"><img src="img.png"></a>, default: false
    })

   eleventyConfig.setLibrary("md", markdownLib);

  /*
   * Disable use gitignore for avoiding ignoring of /bundle folder during watch
   * https://www.11ty.dev/docs/ignores/#opt-out-of-using-.gitignore
   */
  eleventyConfig.setUseGitIgnore(false);

  /**
   * Make the seed target act like prod
   */
  env = (env=="seed") ? "prod" : env;

  /**
   * Eleventy configuration object
   */
  return {
    dir: {
      input: config.paths.src,
      includes: config.paths.includes,
      layouts: `${config.paths.includes}/layouts`,
      output: config.paths.output,
      data: `_data/${env}`,
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
