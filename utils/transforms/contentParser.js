const jsdom = require("@tbranyen/jsdom");

const { JSDOM } = jsdom;
const eleventyConfig = require("../../src/_data/config.json");

function setClass(element, list) {
  list.map((item) => element.classList.add(item));
}

module.exports = (value, outputPath) => {
  if (outputPath && outputPath.endsWith(".html")) {
    /**
     * Create the document model
     */
    const DOM = new JSDOM(value);
    const document = DOM.window.document;

    /**
     * Get all the images from the post
     */
    const images = [...document.querySelectorAll("main article img")];
    if (images.length) {
      images.forEach((image) => {
        /**
         * Set the loading attribute to all
         * the images to be lazy loaded if supported
         */
        image.setAttribute("loading", "lazy");
        /**
         * Replace images with title with figure and figcaption
         */
        if (image.hasAttribute("title")) {
          /**
           * Create figure and figcaption elements
           */
          const figure = document.createElement("figure");
          const figCaption = document.createElement("figcaption");
          /**
           * Set figcaption content from image title
           * then remove the title attribute
           */
          figCaption.innerHTML = `<small>${image.getAttribute(
            "title"
          )}</small>`;
          image.removeAttribute("title");
          /**
           * Add custom class to the figure elements inside posts
           */
          setClass(figure, eleventyConfig.figureClass);
          /**
           * Clone image inside figure
           * and add the figcaption element
           */
          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);
          /**
           * Replace the original image with title
           * with the generated figure
           */
          image.replaceWith(figure);
        }
      });
    }

    /**
     * Wrap iframes inside the article with a div
     */
    const articleEmbeds = [...document.querySelectorAll("main article iframe")];
    if (articleEmbeds.length) {
      articleEmbeds.forEach((embed) => {
        const wrapper = document.createElement("div");
        embed.setAttribute("loading", "lazy");
        setClass(wrapper, eleventyConfig.iframeClass);
        wrapper.appendChild(embed.cloneNode(true));
        embed.replaceWith(wrapper);
      });
    }

    /**
     * Wrap tables inside the package pages with a div
     */
    const tables = [...document.querySelectorAll(".package-body table")];
    if (tables.length) {
      tables.forEach((table) => {
        const wrapper = document.createElement("div");
        setClass(wrapper, eleventyConfig.tableClass);
        wrapper.appendChild(table.cloneNode(true));
        table.replaceWith(wrapper);
      });
    }

    /**
     * Get all the code snippets and wrap them
     * inside a div to apply custom style
     */
    const codeSnippets = [
      ...document.querySelectorAll('pre[class^="language"'),
    ];
    if (codeSnippets.length) {
      codeSnippets.forEach((snippet) => {
        const wrapper = document.createElement("div");
        const codeFlavour = [...snippet.classList]
          // leave only classes which starts with language-
          .filter((c) => c.startsWith("language-"))
          // leave only first element
          .filter((val, idx) => !idx)
          // rename value "bash" to "terminal" - some people use zsh too :)
          // then pull out the value from that array and return the value
          // (the [0] part at the end)
          .map((val) =>
            ["language-bash"].includes(val) ? "language-terminal" : val
          )[0]
          .slice(9);

        setClass(wrapper, eleventyConfig.codeClass);
        snippet.setAttribute("rel", codeFlavour);

        wrapper.appendChild(snippet.cloneNode(true));
        snippet.replaceWith(wrapper);
      });
    }

    /**
     * Get all links with explicit href
     * and add noopener rel value
     */
    const links = [...document.querySelectorAll("a[href]")];
    if (links.length) {
      links.forEach((link) => {
        /**
         * For each link found get all the original attributes
         * and apply them to the custom link element
         */
        const externalLink = document.createElement("a");
        if (link.hasAttributes()) {
          const linkAttributes = link.attributes;
          for (let i = linkAttributes.length; i--; ) {
            externalLink.setAttribute(
              linkAttributes[i].name,
              linkAttributes[i].value
            );
          }
        }
        /**
         * If the link starts with http or https
         * append the "noopener" value to the rel attribute
         */
        const getHref = link.getAttribute("href");
        const currentRel = link.getAttribute("rel") || "";
        const isExternal =
          getHref.startsWith("http") && !getHref.includes("https://codsen.com");
        if (isExternal) {
          externalLink.setAttribute(
            "rel",
            [
              ...new Set(
                currentRel
                  .split(/\s+/)
                  .filter((relValStr) => relValStr.trim())
                  .map((relValStr) => relValStr.toLowerCase())
                  .concat(["noopener", "noreferrer"])
                  .sort()
              ),
            ].join(" ")
          );
          externalLink.setAttribute("target", "_blank");
        }
        externalLink.innerHTML = link.innerHTML;
        if (isExternal) {
          externalLink.insertAdjacentHTML(
            "beforeend",
            `&nbsp;<svg class="ext-link" height="10" viewBox="0 0 100 100" width="10" xmlns="http://www.w3.org/2000/svg"><path d="m38 30h-38v60h60v-38m-20-52v10l10 10-30 30 20 20 30-30 10 10h10v-50z" fill="none" stroke="#807e79" stroke-width="10" transform="translate(5 5)"/><title>opens in a new tab</title></svg>`
          );
        }
        link.replaceWith(externalLink.cloneNode(true));
      });
    }

    return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
  }
  return value;
};
