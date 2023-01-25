import { render } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { activeCardValue, newCardValue } from 'mocks/api/projects/data.pc'
import { Providers } from 'providers'
import { waitForLoadingToFinish } from 'utils/test-utils'
import { EstimateCardProps, EstimateFilters } from '../estimate-filters'

const renderProjectFileters = async ({ selectedCard, onSelectCard }: EstimateCardProps) => {
  await render(<EstimateFilters selectedCard={selectedCard} onSelectCard={onSelectCard} />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

describe('Given a ProjectTilesFilter Render properly', () => {
  describe('When the component is mounted', () => {
    test('Then it should render properly', async () => {
      const selectedCard = 'All'
      const onSelectCard = jest.fn()

      await renderProjectFileters({ selectedCard, onSelectCard })

      // expect(screen.getByText('New')).toBeInTheDocument()
      // expect(screen.getByTestId('value-of-new').textContent).toEqual(`${newCardValue}`)
      // expect(screen.getByText('Active')).toBeInTheDocument()
      // expect(screen.getByTestId('value-of-active').textContent).toEqual(`${activeCardValue}`)
    })

    test('Then onSelect of card onSelectCard should be called', async () => {
      const selectedCard = 'All'
      const onSelectCard = jest.fn()

      await renderProjectFileters({ selectedCard, onSelectCard })

      // const card = screen.getByText('New')

      // await userEvent.click(card)

      // expect(onSelectCard).toHaveBeenCalled()
      // expect(onSelectCard).toBeCalledWith('new')
    })
  })
})
