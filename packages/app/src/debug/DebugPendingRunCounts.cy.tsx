import DebugPendingRunCounts from './DebugPendingRunCounts.vue'

describe('<DebugPendingRunCounts />', () => {
  it('renders counts', () => {
    cy.mount(
      <DebugPendingRunCounts
        specs={{ completedSpecs: 2, totalSpecs: 20 }}
      />,
    )

    cy.contains('2 of 20').should('be.visible')

    cy.percySnapshot()
  })

  it('renders counts of zeros input is undefined', () => {
    cy.mount(
      <DebugPendingRunCounts
        specs={undefined}
      />,
    )

    cy.contains('0 of 0').should('be.visible')

    cy.percySnapshot()
  })
})
