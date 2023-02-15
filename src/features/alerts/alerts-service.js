export const getDataFromStorage = (key = '') => {
  try {
    return JSON.parse(window?.localStorage?.getItem?.(key))
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

export const alertCountKey = 'alertNotificationCount'
export const alertCountEvent = 'alertNotificationAdded'

export const creatEventListener = eventName => {
  if (document?.createEvent) {
    // Create the event.
    const event = document.createEvent('Event')
    // Define that the event name.
    if (event?.initEvent) event.initEvent(eventName, true, true)
    if (document?.dispatchEvent) document.dispatchEvent(event)
  }
}

export const addAlertCount = id => {
  const newAlertId = +id
  if (newAlertId) {
    let alertIds = getDataFromStorage(alertCountKey) || []
    if (alertIds?.length) {
      if (!alertIds?.includes?.(newAlertId)) {
        alertIds = [...alertIds, newAlertId]
      }
    } else {
      alertIds = [id]
    }
    console.log('alertCountKey', alertCountKey)
    console.log('alertIds', alertIds)
    setDataToStorage(alertCountKey, alertIds)
    creatEventListener(alertCountEvent)
  }
}

export const resetAlertCount = () => {
  setDataToStorage(alertCountKey, [])
  creatEventListener(alertCountEvent)
}

export const getAlertCount = () => {
  const alertIds = getDataFromStorage(alertCountKey) || []
  return alertIds?.length || 0
}

export const ALERT_CATERGORY = {
  WARNING: 0,
  INFO: 1,
  ERROR: 2,
}
