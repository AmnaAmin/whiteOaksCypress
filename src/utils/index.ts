export const scrollbarWidth = () => {
  // thanks too https://davidwalsh.name/detect-scrollbar-width
  const scrollDiv = document.createElement('div')
  scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

export const isValidAndNonEmptyObject = (object: {} | undefined | null) => {
  return object !== null && object !== undefined ? Object.entries(object).length > 0 : false
}

export function numberWithCommas(x: number) {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// reduce array of objects to object with key value pairs
export const reduceArrayToObject = (array: any[], key: string) => {
  return array?.reduce((obj, item) => {
    obj[item[key]] = item
    return obj
  }, {})
}

export const isDefined = value => {
  if (value === undefined || value === null) {
    return false
  }
  return true
}
