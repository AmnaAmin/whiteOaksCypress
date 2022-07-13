import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { monDayValue, wedDayValue } from '../data.pc'
import { Providers } from 'providers'
import React from 'react'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { WeekDayFilters, WeekDayFiltersProps } from '../weekday-filters'

const renderWeekDayFilters = async ({ selectedDay, onSelectDay }: WeekDayFiltersProps) => {
  await render(<WeekDayFilters onSelectDay={onSelectDay} selectedDay={selectedDay} />
  , { wrapper: Providers })

  await waitForLoadingToFinish()
}

describe('Weekday Filter Render properly', () => {
  describe('When the component is mounted', () => {
    test('Then it should render properly', async () => {
      const selectedDay = 'Mon'
      const onSelectDay = jest.fn()

      await renderWeekDayFilters({ selectedDay, onSelectDay })

      expect(screen.getByText('Mon')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-mon').textContent).toEqual(`${monDayValue}`)
      expect(screen.getByText('Wed')).toBeInTheDocument()
      expect(screen.getByTestId('value-of-wed').textContent).toEqual(`${wedDayValue}`)
    })

    test('Then onSelect of day onSelectDay should be called', async () => {
      const selectedDay = 'Mon'
      const onSelectDay = jest.fn()

      await renderWeekDayFilters({ selectedDay, onSelectDay })

      const card = screen.getByText('Mon')
     
      waitFor( () => {
         userEvent.click(card)
      })


      expect(onSelectDay).toHaveBeenCalled()
      expect(onSelectDay).toBeCalledWith('Mon')
    })
  })
})
