import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCardProps } from 'features/projects/project-filters/project-filters'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import {
  activeCardValue,
  completedCardValue,
  rejectedCardValue,
  invoicedCardValue,
  PastDueWOCardValue,
} from './project-filter-mock'
import { ProjectFilters } from './project-fliters'

const renderProjectFileters = async ({ selectedCard, onSelectCard }: ProjectCardProps) => {
  await render(<ProjectFilters selectedCard={selectedCard} onSelectCard={onSelectCard} />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

describe('Given a ProjectTilesFilter Render properly', () => {
  describe('When the component is mounted', () => {
    test('Then it should render properly', async () => {
      const selectedCard = 'All'
      const onSelectCard = jest.fn()

      await renderProjectFileters({ selectedCard, onSelectCard })

      expect(screen.getByText('Active WO')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-active wo').textContent).toEqual(`${activeCardValue}`)

      expect(screen.getByText('Past Due WO')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-past due wo').textContent).toEqual(`${PastDueWOCardValue}`)

      expect(screen.getByText('Completed')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-completed').textContent).toEqual(`${completedCardValue}`)

      expect(screen.getByText('Invoiced WO')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-invoiced wo').textContent).toEqual(`${invoicedCardValue}`)

      expect(screen.getByText('Rejected Invoices')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-rejected invoices').textContent).toEqual(`${rejectedCardValue}`)
    })

    test('Then onSelect of card onSelectCard should be called', async () => {
      const selectedCard = 'All'
      const onSelectCard = jest.fn()

      await renderProjectFileters({ selectedCard, onSelectCard })

      await userEvent.click(screen.getByText('Active WO'))
      await userEvent.click(screen.getByText('Past Due WO'))
      await userEvent.click(screen.getByText('Completed'))
      await userEvent.click(screen.getByText('Invoiced WO'))
      await userEvent.click(screen.getByText('Rejected Invoices'))

      expect(onSelectCard).toHaveBeenCalled()
      expect(onSelectCard).toBeCalledWith('active')
      expect(onSelectCard).toHaveBeenCalled()
      expect(onSelectCard).toBeCalledWith('pastDue')
      expect(onSelectCard).toHaveBeenCalled()
      expect(onSelectCard).toBeCalledWith('completed')
      expect(onSelectCard).toHaveBeenCalled()
      expect(onSelectCard).toBeCalledWith('invoiced')
      expect(onSelectCard).toHaveBeenCalled()
      expect(onSelectCard).toBeCalledWith('rejected')
    })
  })
})
