import { render } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { monDayValue, tueDayValue, wedDayValue } from 'mocks/api/projects/data.pc'
import { Providers } from 'providers'
import { waitForLoadingToFinish, screen } from 'utils/test-utils'
import { WeekDayFilters, WeekDayFiltersProps } from '../weekday-filters'

const renderWeekDayFilters = async ({ selectedDay, onSelectDay }: WeekDayFiltersProps) => {
  await render(<WeekDayFilters onSelectDay={onSelectDay} selectedDay={selectedDay} />, { wrapper: Providers })

  await waitForLoadingToFinish()
}

describe('Weekday Filter Test Cases', () => {
  test('Weekday Filter should show accurate count', async () => {
    const selectedDay = 'Mon'
    const onSelectDay = jest.fn()

    await renderWeekDayFilters({ selectedDay, onSelectDay })

    expect(screen.getByText('Mon')).toBeInTheDocument()
    expect(screen.getByTestId('value-of-mon').textContent).toEqual(`${monDayValue}`)
    expect(screen.getByText('Tue')).toBeInTheDocument()
    expect(screen.getByTestId('value-of-tue').textContent).toEqual(`${tueDayValue}`)
    expect(screen.getByText('Wed')).toBeInTheDocument()
    expect(screen.getByTestId('value-of-wed').textContent).toEqual(`${wedDayValue}`)

    //** COMMENTING OUT DUE TO CHANGE IN LOGIC **//

    // expect(screen.getByText('All')).toBeInTheDocument()
    // expect(screen.getByText('Clear Filter')).toBeInTheDocument()

    // const card = screen.getByText('Mon')
    // await userEvent.click(card)
    // expect(onSelectDay).toHaveBeenCalled()
    // expect(onSelectDay).toBeCalledWith('Mon')
  })
})
