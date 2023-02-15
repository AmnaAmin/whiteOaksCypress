// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { addAlertCount } from 'features/alerts/alerts-service'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*const firebaseConfigTestProject = {
  apiKey: 'AIzaSyAAOYgWWEuIcgW8saeZ62WB0a5WTwSUWRM',
  authDomain: 'test-project-cc173.firebaseapp.com',
  projectId: 'test-project-cc173',
  storageBucket: 'test-project-cc173.appspot.com',
  messagingSenderId: '284145334634',
  appId: '1:284145334634:web:461851666da71f09fe0d13',
  measurementId: 'G-4PH32C3Q7S',
}

const vapidKeyTestProject = 'BFpGAm40M8bPfO0zmWKMw1OjItQ0DXVTOZvAYsrnCeIqQQ1Au885ruMAZCAno-oIkTXzshh_Dota1Rd4Yi8VLDw'*/

const firebaseConfig = {
  apiKey: 'AIzaSyDubiFzyOj0iar4chN2Z1Fg356LfYDGagQ',
  authDomain: 'whiteoaks-9dc51.firebaseapp.com',
  databaseURL: 'https://whiteoaks-9dc51.firebaseio.com',
  projectId: 'whiteoaks-9dc51',
  storageBucket: 'whiteoaks-9dc51.appspot.com',
  messagingSenderId: '884836479897',
  appId: '1:884836479897:web:3425d1369f17258b1c9908',
  measurementId: 'G-WNCM8PYDCZ',
}
const vapidKey = 'BCGZ9afTA7Jh2qf9_4_-FDLgWB5ndeiq6DxTw6PrWhK6AvRcbY2hs2O43lQYruPeXFDXVIDg1rsYMzGJD44b_DI'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
export const fetchToken = () => {
  getToken(messaging, {
    vapidKey,
  })
    .then(currentToken => {
      if (currentToken) {
        sessionStorage.setItem('fbToken', currentToken)
        console.log(currentToken)
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.')
        // ...
      }
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err)
      // ...
    })
}

onMessage(messaging, payload => {
  console.log('Message received. ', payload)
  const { data = {} } = payload || {}
  console.debug('Message received. ', payload, (data || {})?.alertHistoryId)
  addAlertCount((data || {})?.alertHistoryId)
})
