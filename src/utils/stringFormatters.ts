export const currencyFormatter = (amount: number | string, maxFractionDigits?: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maxFractionDigits || 2,
  })

  return formatter.format(Number(amount))
}

export const truncateWithEllipsis = (s: string, maxLength: number) => {
  if (s.length > maxLength) {
    return s.substring(0, maxLength) + '...'
  }
  return s
}
