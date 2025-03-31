/// <reference types="cypress"/>

import { Given } from "@badeball/cypress-cucumber-preprocessor";


Given("ユーザはTOP画面に遷移する", () => {
  // tells test to open local host
  cy.visit("http://localhost:3000");
});
