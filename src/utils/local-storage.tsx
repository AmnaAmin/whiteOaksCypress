export const getDataFromStorage = (key = '') => {
  try {
    return JSON.parse(window?.localStorage?.getItem?.(key) as string)
  } catch (error) {
    console.error('error parse data from localstorage:', error)
    return null
  }
}

export const setDataToStorage = (key = '', data = {}) => {
  try {
    if (window?.localStorage?.setItem) {
      window.localStorage.setItem(key, JSON.stringify(data))
    }
  } catch (error) {
    console.error('error parse data from localstorage:', error)
  }
}
