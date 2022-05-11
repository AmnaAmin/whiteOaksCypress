export const currencyFormatter = (amount: number | string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  return formatter.format(Number(amount))
}

export const truncateWithEllipsis = (s: string, maxLength: number) => {
  if (s.length > maxLength) {
    return s.substring(0, maxLength) + '...'
  }
  return s
}
