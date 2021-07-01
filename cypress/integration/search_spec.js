Cypress.Commands.add("waitForResource", (name, options = {}) => {
  if (Cypress.browser.family === "firefox") {
    cy.log("Skip waitForResource in Firefox");

    return;
  }

  cy.log(`Waiting for resource ${name}`);

  const log = false; // let's not log inner commands
  const timeout = options.timeout || Cypress.config("defaultCommandTimeout");

  cy.window({ log }).then(
    // note that ".then" method has options first, callback second
    // https://on.cypress.io/then
    { log, timeout },
    (win) => {
      return new Cypress.Promise((resolve, reject) => {
        let foundResource;

        const interval = setInterval(() => {
          foundResource = win.performance
            .getEntriesByType("resource")
            .find((item) => item.name.endsWith(name));

          if (!foundResource) {
            // resource not found, will try again
            return;
          }

          clearInterval(interval);
          // because cy.log changes the subject, let's resolve the returned promise
          // with log + returned actual result
          resolve(
            cy.log("✅ success").then(() => {
              // let's resolve with the found performance object
              // to allow tests to inspect it
              return foundResource;
            })
          );
        }, 100);

        // control how long we should try finding the resource
        // and if it is still not found. An explicit "reject"
        // allows us to show nice informative message
        setTimeout(() => {
          if (foundResource) {
            // nothing needs to be done, successfully found the resource
            return;
          }

          clearInterval(interval);
          reject(new Error(`Timed out waiting for resource ${name}`));
        }, timeout);
      });
    }
  );
});

describe("The Home Page", () => {
  it("successfully loads", () => {
    cy.visit("/");
    cy.waitForResource("app.js");
    cy.get(".search-toggle").click();
    cy.get("html").should("have.attr", "data-search-expanded", "true");
    cy.get("input.search-field").should("have.focus").type("strip");
    cy.contains("Found").should("exist");
  });
});
