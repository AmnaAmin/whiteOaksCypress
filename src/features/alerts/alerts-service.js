import { getDataFromStorage, setDataToStorage } from 'utils/local-storage'

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
