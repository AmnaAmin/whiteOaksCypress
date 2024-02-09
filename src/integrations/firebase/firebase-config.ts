// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { addAlertCount } from 'features/alerts/alerts-service'

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
  const { data = {} } = payload || {}
  console.debug('Message received. ', payload, (data || {})?.alertHistoryId)
  addAlertCount((data || {})?.alertHistoryId)
})
