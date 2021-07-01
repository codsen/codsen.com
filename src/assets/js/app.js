/* eslint no-restricted-globals:0 */

// few Codsen scripts
// -----------------------------------------------------------------------------

import { CountUp } from "countup.js";

let myWorker; // worker variable on the top scope
let searchStart; // to keep a note of starting time
const searchInputField = document.querySelector(`input.search-field`);
const contentMain = document.querySelector(`.content-main`);
let searchContentsDiv;

// fires when the initial HTML document has been completely loaded and parsed
window.addEventListener("DOMContentLoaded", () => {
  let myStorage;
  let retrievedStorage;
  const htmlEl = document.documentElement;
  const navButton = document.querySelector("button.menu-toggle");
  const searchButton = document.querySelector("button.search-toggle");
  const wildOnFooter = document.querySelector(".wild");
  const autoDarkModeButton = document.querySelector(
    'button[data-theme-name="auto"]'
  );
  const lightModeButton = document.querySelector(
    'button[data-theme-name="light"]'
  );
  const darkModeButton = document.querySelector(
    'button[data-theme-name="dark"]'
  );
  const libsTotal = document.querySelector("#os-libraries-total");
  const commitsTotal = document.querySelector("#os-commits-total");
  const assertsTotal = document.querySelector("#os-asserts-total");

  const CODSENCREATEDDATE = 1409936400000;
  const defaultOpts = {
    menuExpanded: false,
    searchExpanded: false,
    dark: "auto", // |'dark'|'light'
  };
  let codsenOpts = { ...defaultOpts };

  // https://stackoverflow.com/a/53518692/3943954
  // const fired = false

  // try to fetch the storage
  // -----------------------------------------------------------------------------

  function updateUI() {
    if (htmlEl) {
      if (navButton) {
        // mini header doesn't have a nav button!

        // tackle menu/search which both are mutually exclusive:
        if (codsenOpts && codsenOpts.searchExpanded) {
          // add class to the body
          htmlEl.setAttribute("data-search-expanded", "true");
          searchButton.setAttribute("aria-expanded", "true");

          // if search is expanded, collapse the nav
          htmlEl.setAttribute("data-menu-expanded", "false");
          navButton.setAttribute("aria-expanded", "false");

          // focus on the text input
          searchInputField.focus();
        } else if (codsenOpts && codsenOpts.menuExpanded) {
          // add class to the body
          htmlEl.setAttribute("data-menu-expanded", "true");
          navButton.setAttribute("aria-expanded", "true");

          // if nav is expanded, collapse the search
          htmlEl.setAttribute("data-search-expanded", "false");
          searchButton.setAttribute("aria-expanded", "false");
        } else {
          htmlEl.setAttribute("data-menu-expanded", "false");
          htmlEl.setAttribute("data-search-expanded", "false");
          navButton.setAttribute("aria-expanded", "false");
          searchButton.setAttribute("aria-expanded", "false");
        }
      }

      // tackle dark mode, which is independent:
      if (codsenOpts && codsenOpts.dark) {
        htmlEl.setAttribute("data-theme", codsenOpts.dark);
      }
    }
  }

  function dumpEverythingToStorage() {
    if (window && window.localStorage) {
      myStorage.setItem(
        "codsen",
        JSON.stringify({ ...defaultOpts, ...codsenOpts })
      );
    }
  }

  if (window && window.localStorage) {
    myStorage = window.localStorage;

    if (myStorage.getItem("codsen")) {
      try {
        retrievedStorage = JSON.parse(myStorage.getItem("codsen"));
      } catch (e) {
        // if parse failed or there's anything wrong, just wipe the storage
        dumpEverythingToStorage();
      }

      if (
        typeof retrievedStorage !== "object" ||
        typeof retrievedStorage.menuExpanded !== "boolean"
      ) {
        dumpEverythingToStorage();
      } else {
        // all OK

        codsenOpts = { ...retrievedStorage };
        // initial search and menu are always collapsed
        // practically, this means, expanding search and going to another
        // page will collapse either of both:
        codsenOpts.searchExpanded = false;
        codsenOpts.menuExpanded = false;
        updateUI();
      }
    } else {
      dumpEverythingToStorage();
    }
  }

  // -----------------------------------------------------------------------------

  if (htmlEl && navButton) {
    navButton.addEventListener(
      "click",
      () => {
        // set state
        codsenOpts.menuExpanded = !codsenOpts.menuExpanded;
        codsenOpts.searchExpanded = false;
        updateUI();
        dumpEverythingToStorage();
      },
      false
    );
  }

  function searchClickActions() {
    codsenOpts.searchExpanded = !codsenOpts.searchExpanded;
    codsenOpts.menuExpanded = false;
    updateUI();
    dumpEverythingToStorage();
  }

  if (htmlEl && searchButton) {
    searchButton.addEventListener(
      "click",
      () => {
        searchClickActions();
      },
      false
    );
  }

  if (htmlEl && autoDarkModeButton) {
    autoDarkModeButton.addEventListener(
      "click",
      () => {
        codsenOpts.dark = "auto";
        updateUI();
        dumpEverythingToStorage();
      },
      false
    );
  }

  if (htmlEl && lightModeButton) {
    lightModeButton.addEventListener(
      "click",
      () => {
        codsenOpts.dark = "light";
        updateUI();
        dumpEverythingToStorage();
      },
      false
    );
  }

  if (htmlEl && darkModeButton) {
    darkModeButton.addEventListener(
      "click",
      () => {
        codsenOpts.dark = "dark";
        updateUI();
        dumpEverythingToStorage();
      },
      false
    );
  }

  // calculate "fresh" on Home page
  // -----------------------------------------------------------------------------

  const freshSpan = document.querySelector(`#fresh`);
  if (freshSpan) {
    const postedDate = freshSpan.getAttribute("data-time");
    // expect ISO 8601 format like "2019-01-01"
    if (typeof postedDate === "string" && postedDate.length === 10) {
      // 7 * 24 * 60 * 60 * 1000
      if (Date.now() - Date.parse(postedDate) < 604800000) {
        freshSpan.textContent = "FRESH ";
      }
    }
  }

  // calculate company's age on the footer
  // -----------------------------------------------------------------------------

  // https://stackoverflow.com/a/58259388/3943954
  function dateDiffInDaysMonthsYears(start) {
    const m1 = new Date(start);
    const m2 = new Date(Date.now());
    let yDiff = m2.getFullYear() - m1.getFullYear();
    let mDiff = m2.getMonth() - m1.getMonth();
    let dDiff = m2.getDate() - m1.getDate();

    if (dDiff < 0) {
      const daysInLastFullMonth = getDaysInLastFullMonth(start);
      if (daysInLastFullMonth < m1.getDate()) {
        dDiff =
          daysInLastFullMonth + dDiff + (m1.getDate() - daysInLastFullMonth);
      } else {
        dDiff = daysInLastFullMonth + dDiff;
      }
      mDiff--;
    }
    if (mDiff < 0) {
      mDiff = 12 + mDiff;
      yDiff--;
    }
    if (!mDiff && !dDiff) {
      return ` That makes Codsen precisely ${yDiff}\u00A0year${
        yDiff < 2 ? "" : "s"
      } old.`;
    }
    if (!dDiff) {
      return ` That makes Codsen precisely ${yDiff}\u00A0year${
        yDiff < 2 ? "" : "s"
      } and ${mDiff}\u00A0month${mDiff < 2 ? "" : "s"} old.`;
    }
    // else
    return ` That makes Codsen ${yDiff}\u00A0year${yDiff < 2 ? "" : "s"}${
      mDiff ? `, ${mDiff}\u00A0month${mDiff < 2 ? "" : "s"}` : ""
    } and ${dDiff}\u00A0day${dDiff < 2 ? "" : "s"}\u00A0old.`;
  }

  function getDaysInLastFullMonth(day) {
    const d = new Date(day);
    const lastDayOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return lastDayOfMonth.getDate();
  }

  const ageSpan = document.querySelector(`#agePlaceholder`);
  if (ageSpan) {
    ageSpan.textContent = dateDiffInDaysMonthsYears(CODSENCREATEDDATE);
  }

  // search
  // -----------------------------------------------------------------------------

  // close search if ESC is pressed
  // if (searchInputField) {
  //   searchInputField.onkeydown = (evt) => {
  //     evt = evt || window.event;
  //     let isEscape = false;
  //     if ("key" in evt) {
  //       isEscape = evt.key === "Escape" || evt.key === "Esc";
  //     } else {
  //       isEscape = evt.keyCode === 27;
  //     }
  //     if (isEscape) {
  //       searchClickActions();
  //     }
  //   };
  // }

  // upon window load, check, is q= URL parameter passed
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get("s");
  if (searchParam && window.Worker) {
    searchClickActions();
    // console.log(`286 app.js: searchParam=${searchParam}`);
    searchInputField.value = searchParam;

    // clear URL s= param
    const newURL = location.href.split("?")[0];
    window.history.pushState("object", document.title, newURL);

    // console.log(`293 app.js: posting to worker`);
    setWebWorker();
    myWorker.postMessage(searchInputField.value.trim());
  } else if (searchInputField) {
    searchInputField.value = "";
  }

  // generate random "wild" term
  // -----------------------------------------------------------------------------

  if (wildOnFooter) {
    const words = [
      "Go wild!",
      "Go bananas!",
      "Go bonkers!",
      "Go crazy!",
      "Oh, behave!",
    ];
    wildOnFooter.textContent = words[Math.floor(Math.random() * words.length)];
  }

  // open source page
  // -----------------------------------------------------------------------------

  if (libsTotal) {
    const libsTotalcountUp = new CountUp(
      "os-libraries-total",
      libsTotal.textContent
    );
    libsTotalcountUp.start();
  }
  if (commitsTotal) {
    const commitsTotalCountUp = new CountUp(
      "os-commits-total",
      commitsTotal.textContent
    );
    commitsTotalCountUp.start();
  }
  if (assertsTotal) {
    const assertsTotalCountUp = new CountUp(
      "os-asserts-total",
      assertsTotal.textContent
    );
    assertsTotalCountUp.start();
  }
});

// search
// -----------------------------------------------------------------------------

function wipeSearchContents() {
  if (
    document.contains(document.querySelector(".content-main__search-contents"))
  ) {
    // reuse existing div,
    searchContentsDiv = document.querySelector(
      ".content-main__search-contents"
    );
    // keep <h2> but delete <ol>
    if (
      document.contains(
        document.querySelector(".content-main__search-contents ol")
      )
    ) {
      searchContentsDiv.removeChild(
        document.querySelector(".content-main__search-contents ol")
      );
    }
  } else {
    // if div doesn't exist, create it and append under
    searchContentsDiv = document.createElement("div");
    searchContentsDiv.className = "content-main__search-contents";
    if (contentMain) {
      contentMain.prepend(searchContentsDiv);
    }
  }
}

function setWebWorker() {
  searchStart = Date.now();
  if (myWorker) {
    myWorker.terminate();
  }
  myWorker = new Worker(
    new URL(
      "/assets/REPLACE_WITH_HASH_URL/js/search-worker.js",
      import.meta.url
    )
  );

  myWorker.onmessage = (e) => {
    const { data } = e;
    wipeSearchContents();

    const timeTaken = Date.now() - searchStart;

    const newH2Elem = document.createElement("h2");
    newH2Elem.classList.add("search-heading");

    // it depends, are there any results to show?
    if (data.length) {
      //
      // assemble something like:
      // <h2>Found <span>0</span> results:</h2>
      // <ol class="posts">
      //   <li class="posts-entry">
      //     <a href="#" class="posts-link">Title of the article</a> <span class="tags"><a href="#" class="tag">tag value 1</a></span> <span class="date">Jun 2020</span>
      //   </li>
      // </ol>

      if (
        document.contains(
          document.querySelector(".content-main__search-contents h2")
        ) &&
        document.contains(
          document.querySelector(".content-main__search-contents h2 span")
        )
      ) {
        // if h2 exists, just reuse the span
        document.querySelector("#content-main__findings").textContent = "0";

        // tackle mismatching existing singular/plural "result"/"results"
        if (
          (data.length === 1 &&
            document.querySelector(".content-main__search-contents h2")
              .lastChild.previousSibling.textContent !== " result:") ||
          document.querySelector(".content-main__search-contents h2").lastChild
            .previousSibling.textContent !== " results:"
        ) {
          document.querySelector(
            ".content-main__search-contents h2"
          ).lastChild.previousSibling.textContent = ` result${
            data.length > 1 ? "s" : ""
          }`;

          document.querySelector(
            ".content-main__search-contents h2 > sup"
          ).textContent = `Δ=${timeTaken}ms`;
        }
      } else {
        if (document.querySelector(".content-main__search-contents h2")) {
          searchContentsDiv.removeChild(
            document.querySelector(".content-main__search-contents h2")
          );
        }
        newH2Elem.appendChild(document.createTextNode("Found "));

        const newH2Span = document.createElement("span");
        newH2Span.id = "content-main__findings";
        newH2Span.textContent = "0"; // instead of data.length
        newH2Elem.appendChild(newH2Span);

        newH2Elem.appendChild(
          document.createTextNode(` result${data.length > 1 ? "s" : ""}:`)
        );

        const newH2Sup = document.createElement("sup");
        newH2Sup.textContent = `Δ=${timeTaken}ms`;
        newH2Elem.appendChild(newH2Sup);

        searchContentsDiv.appendChild(newH2Elem);
      }

      // append results <ol>
      const newOl = document.createElement("ol");
      newOl.className = "posts";
      data.forEach((resObj) => {
        // extra insurance
        if (typeof resObj === "object" && resObj.item && resObj.item.title) {
          // each resembling something like:
          // {
          //   item: {
          //     url: "/tooling/",
          //     title: "Tooling",
          //     index: "tooling njk contents",
          //   },
          //   refIndex: 3,
          // }
          const newLi = document.createElement("li"); // <li class="posts-entry">
          newLi.className = "posts-entry";

          const newAnchor = document.createElement("a");
          newAnchor.className = "posts-link";
          newAnchor.href = resObj.item.url;
          console.log(
            `${`\u001b[${33}m${`resObj.item.title`}\u001b[${39}m`} = ${JSON.stringify(
              resObj.item.title,
              null,
              4
            )}`
          );
          newAnchor.textContent = resObj.item.title.replace(`'`, `’`);
          newAnchor.textContent = resObj.item.title.replace(`&#39;`, `’`);

          let calculatedPostType = resObj.item.postType.toUpperCase();
          if (calculatedPostType === "PACKAGE") {
            calculatedPostType = `\uD83D\uDCE6`;
          }

          newLi.appendChild(
            document.createTextNode(`${calculatedPostType} — `)
          );
          newLi.appendChild(newAnchor);
          newOl.appendChild(newLi);
        }

        // <a href="#" class="posts-link">Title of the article</a> <span class="tags"><a href="#" class="tag">tag value 1</a></span> <span class="date">Jun 2020</span>

        // newOl.appendChild(document.createElement("li"));
      });
      // finally, append it
      searchContentsDiv.appendChild(newOl);

      // animate the digit #content-main__findings
      const countUp = new CountUp("content-main__findings", data.length);
      countUp.start();
      // if (!countUp.error) {
      //   countUp.start();
      // }
    } else if (
      document.contains(
        document.querySelector(".content-main__search-contents h2")
      )
    ) {
      document.querySelector(".content-main__search-contents h2").textContent =
        "Nothing found!";
    } else {
      newH2Elem.appendChild(document.createTextNode("Nothing found!"));
      searchContentsDiv.appendChild(newH2Elem);
    }
  };
}

window.addEventListener("load", () => {
  // console.log("354 app.js: page is fully loaded");
  if (window.Worker && document.querySelector("button.search-toggle")) {
    // when page loads and if worker API is supported,
    // make the search button visible
    document.querySelector("button.search-toggle").style.display = "block";

    // listen to changes in the search input field.
    if (searchInputField) {
      searchInputField.addEventListener("input", () => {
        // clear URL s= param
        const newURL = location.href.split("?")[0];
        window.history.pushState("object", document.title, newURL);

        // console.log(`501 app.js: input`);
        setWebWorker();

        wipeSearchContents();
        if (searchInputField.value && searchInputField.value.trim()) {
          // console.log(`506 app.js: posting to worker`);
          myWorker.postMessage(searchInputField.value.trim());
        } else {
          while (searchContentsDiv.lastElementChild) {
            searchContentsDiv.removeChild(searchContentsDiv.lastElementChild);
          }
          wipeSearchContents();
        }
      });
    }
  }
});

// -----------------------------------------------------------------------------
