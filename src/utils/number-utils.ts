export const preventNegativeKeyDownFn = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e?.code === 'Minus') {
    e.preventDefault()
  }
}

export const isDecimalPlacesLimitExceeded = (val?: number) => {
  if (!val) return true
  if (!val.toString()?.includes('.')) return true
  const [, dec] = val?.toString().split('.')
  if (!dec) {
    return true
  } else {
    return dec?.toString()?.length <= 2
  }
}
