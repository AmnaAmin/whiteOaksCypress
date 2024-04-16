export const preventNegativeKeyDownFn = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e?.code === 'Minus') {
    e.preventDefault()
  }
}

export const extractDecimalNumbers = (number: number, decimalPlaces: number) => {
  if (!number?.toString()?.includes('.')) return number
  const [int, dec] = number?.toString()?.split('.')
  if (dec.length <= decimalPlaces) {
    return number
  } else {
    const decimals = dec.slice(0, decimalPlaces)
    return Number(int + '.' + decimals)
  }
}

export const isDecimalPlacesLimitExceeded = (number: number) => {
  if (!number?.toString()?.includes('.')) return true;
  const [, dec] = number?.toString().split('.')
  if (!dec) return true
  else return dec?.toString()?.length <= 2
}