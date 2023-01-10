import { OverviewGraph } from 'components/chart/Overview'
import { PaidChartGraph } from 'components/chart/paid-chart'
import { render, screen } from '@testing-library/react'
import { WO_BY_VENDORS_PER_MONTH, PAID_BY_YEAR_AND_MONTH } from 'mocks/api/vendor-dashboard/data'
import { months, monthsShort } from 'utils/date-time-utils'

const vendorData = months.map(key => ({
  name: monthsShort[key],
  Active: WO_BY_VENDORS_PER_MONTH?.[key]?.Active || 0,
  PastDue: WO_BY_VENDORS_PER_MONTH?.[key]?.PastDue || 0,
  Closed: WO_BY_VENDORS_PER_MONTH?.[key]?.Completed || 0,
  Paid: WO_BY_VENDORS_PER_MONTH?.[key]?.Paid || 0,
  Canceled: WO_BY_VENDORS_PER_MONTH?.[key]?.Cancelled || 0,
}))

describe('Charts testcases', () => {
  test('Overview graph test case', async () => {
    const { container } = render(<OverviewGraph width={400} height={300} vendorData={vendorData} />)
    expect(screen.getByTestId('legend-Canceled')).toBeInTheDocument()
    expect(screen.getByTestId('legend-Active')).toBeInTheDocument()
    expect(screen.getByTestId('legend-PastDue')).toBeInTheDocument()
    expect(screen.getByTestId('legend-Paid')).toBeInTheDocument()

    expect(container.getElementsByClassName('recharts-cartesian-grid').length).toBe(1)
    expect(container.getElementsByClassName('recharts-xAxis').length).toBe(1)
    expect(container.getElementsByClassName('recharts-yAxis').length).toBe(1)
    /* Jan-Dec (12 x axis ticks) & [0,2,4] (3 y axis ticks) */
    expect(container.getElementsByClassName('recharts-cartesian-axis-tick').length).toBe(15)
    expect(container.getElementsByClassName('recharts-custom-tooltip').length).toBe(1)
    expect(container.getElementsByClassName('recharts-bar').length).toBeGreaterThan(0)
    expect(container.getElementsByClassName('recharts-bar-rectangle').length).toBe(vendorData.length * 5)
  })

  test('PaidChart graph test case', async () => {
    const { container } = render(
      <PaidChartGraph width={400} height={300} data={PAID_BY_YEAR_AND_MONTH} filters={undefined} />,
    )

    expect(container.getElementsByClassName('recharts-xAxis').length).toBe(1)
    expect(container.getElementsByClassName('recharts-yAxis').length).toBe(1)
    expect(container.getElementsByTagName('rect').length).toBe(1)
    /* 2 x axis and 5 y axis ticks */
    expect(container.getElementsByClassName('recharts-cartesian-axis-tick').length).toBe(2)
    /* as per the provided data, there will be two bars on graph */
    expect(container.getElementsByClassName('recharts-bar-rectangle').length).toBe(2)
    expect(container.getElementsByClassName('recharts-tooltip-wrapper').length).toBe(1)
    expect(container.getElementsByClassName('recharts-bar').length).toBeGreaterThan(0)
  })
})
