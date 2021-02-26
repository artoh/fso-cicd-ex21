describe("WebKitsas", function() {
  it("front page can be opened", function() {
    cy.visit("http://localhost:5050")
    cy.contains("Tervetuloa WebKitsaaseen")
  })

  it("Change password dialog", function() {
    cy.visit("http://localhost:5050")
    cy.contains("Unohdin salasanan").click()
    cy.contains("Unohtuneen salasanan vaihtaminen")
  })
})
