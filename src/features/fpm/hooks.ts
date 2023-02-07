export const useMonthData = (currentMonth, chartData) => {
  const monthExistsInChart =
    chartData && chartData?.chart && Object.keys(chartData?.chart)?.find(months => months === currentMonth)
  let nameMonthData = {}
  if (monthExistsInChart) {
    nameMonthData = chartData?.chart[currentMonth]
  }
  return { nameMonthData }
}
