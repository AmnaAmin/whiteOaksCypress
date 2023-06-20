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

export const truncateWithEllipsisInCenter = (str: string) => {
  if (str.length > 30) {
    return str.substr(0, 10) + '.....' + str.substr(str.length - 10, str.length)
  }
  return str
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

export const isValidEmail = value => {
  return /\S+@\S+\.\S+/.test(value)
}

export const isValidPhoneNumber = value => {
  if (value?.replace(/\D+/g, '').length! === 0) {
    return true
  } else if (value?.replace(/\D+/g, '').length! < 10) {
    return false
  }
  return true
}

export const preventSpecialCharacter = e => {
  if (/[^a-zA-Z\s]/g.test(e.key)) {
    e.preventDefault()
  }
}

export const capitalize = text => {
  return text?.charAt(0)?.toUpperCase() + text?.slice(1)?.toLowerCase()
}
