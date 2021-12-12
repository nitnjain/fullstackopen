// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.visit('http://localhost:3000')

  cy.contains('Add a blog').click()

  cy.get('#title').type(title)
  cy.get('#author').type(author)
  cy.get('#url').type(url)

  cy.get('#addBlogBtn').click()
})

Cypress.Commands.add('login', ({ username, password }) => {
  cy.visit('http://localhost:3000')

  cy.get('#username').type(username)
  cy.get('#password').type(password)

  cy.get('#loginBtn').click()
})