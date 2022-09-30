export const currencyFormatter = (amount: number | string, maxFractionDigits?: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maxFractionDigits || 2,
  })

  return formatter.format(Number(amount))
}

export const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, 'g'), replace)
}

const currencyPrefix = '$'
const currencyThousandSeparator = ','
const percentageSuffix = '%'

export const removeCurrencyFormat = (value = '') => {
  if (value) {
    return replaceAll(replaceAll(value + '', `\\${currencyPrefix}`, ''), `\\${currencyThousandSeparator}`, '')
  }

  return value
}

export const removePercentageFormat = (value = '') => {
  if (value) {
    return replaceAll(replaceAll(value + '', `\\${percentageSuffix}`, ''), `\\${currencyThousandSeparator}`, '')
  }

  return value
}

export const truncateWithEllipsis = (s: string, maxLength: number) => {
  if (s.length > maxLength) {
    return s.substring(0, maxLength) + '...'
  }
  return s
}

/**
 * Divides given value by 100
 * @param percentage (number) The percentage input
 * @returns Formatted percentage
 */
export const percentageFormatter = (percentage: number) => {
  if (percentage) {
    return Number(percentage / 100)
  }
  return percentage
}
