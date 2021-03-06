describe('Host', () => {
  it('Hosts a game --> plays through it --> renders result page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#hostButton').click()
    cy.get(':nth-child(1) > .MuiButtonBase-root > .MuiCardMedia-root').click()
    cy.get('#startGame').click()

    cy.get('body').then(body => {
      const clickNextQuestion = () => {
        if (body.find('#nextQuestion').length > 0) {
          cy.get('#nextQuestion').click()
          clickNextQuestion()
        }
      }
      clickNextQuestion()
      cy.get('#showResults').click()
      cy.url().should('eq', 'http://localhost:3000/result')
    })
  })
})
