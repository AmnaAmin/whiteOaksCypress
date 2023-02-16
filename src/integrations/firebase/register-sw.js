/* eslint-disable camelcase, no-console */

import { addAlertCount } from 'features/alerts/alerts-service'

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register(`/firebase-messaging-sw.js`)
      .then(registration => {
        console.debug('Registration successful, scope is:', registration.scope)
      })
      .catch(err => {
        console.debug('Service worker registration failed, error:', err)
      })

    navigator.serviceWorker.addEventListener('message', function handler(event) {
      const { postMessageType, payload } = event?.data || {}
      const { data = {} } = payload || {}
      console.debug('Received a message from service worker: ', event.data, (data || {})?.alertHistoryId)
      switch (postMessageType) {
        case 'alert-notification':
          addAlertCount((data || {})?.alertHistoryId)
          break
        default:
          break
      }
    })
  }
}

export { registerServiceWorker }
