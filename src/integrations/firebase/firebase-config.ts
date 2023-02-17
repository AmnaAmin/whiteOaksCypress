// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { addAlertCount } from 'features/alerts/alerts-service'

export const firebaseConfig = {
  apiKey: 'AIzaSyDubiFzyOj0iar4chN2Z1Fg356LfYDGagQ',
  authDomain: 'whiteoaks-9dc51.firebaseapp.com',
  databaseURL: 'https://whiteoaks-9dc51.firebaseio.com',
  projectId: 'whiteoaks-9dc51',
  storageBucket: 'whiteoaks-9dc51.appspot.com',
  messagingSenderId: '884836479897',
  appId: '1:884836479897:web:3425d1369f17258b1c9908',
  measurementId: 'G-WNCM8PYDCZ',
}
export const vapidKey = 'BCGZ9afTA7Jh2qf9_4_-FDLgWB5ndeiq6DxTw6PrWhK6AvRcbY2hs2O43lQYruPeXFDXVIDg1rsYMzGJD44b_DI'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export const processRegisteration = async () => {
  let warning = ''
  const hasSupport = await isSupported()
  if (hasSupport) {
    getToken(messaging, {
      vapidKey,
    })
      .then(currentToken => {
        if (currentToken) {
          sessionStorage.setItem('fbToken', currentToken)
          console.log('fbToken', currentToken)
        } else {
          warning = 'Permission Denied'
          console.log('No registration token available. Request permission to generate one.')
        }
      })
      .catch(err => {
        warning = 'Error'
        console.log('An error occurred while retrieving token. ', err)
      })
  } else {
    warning = 'Browser Not Supported'
  }
  return warning
}

onMessage(messaging, payload => {
  console.log('Message received. ', payload)
  const { data = {} } = payload || {}
  console.debug('Message received. ', payload, (data || {})?.alertHistoryId)
  addAlertCount((data || {})?.alertHistoryId)
})
