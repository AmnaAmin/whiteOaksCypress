/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here. Other Firebase libraries
 // are not available in the service worker.
 **/
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
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
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
let messaging = null

if (firebase?.messaging?.isSupported()) {
  firebase.initializeApp(firebaseConfig)
  messaging = firebase.messaging()
}

// [END initialize_firebase_in_sw]

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START on_background_message]

const postMessageTypes = {
  show: 'alert-notification',
}

// using post to send stuff on background notification from firebase
const postShowNotificationMessage = type => {
  return self.clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then(function (windowClients) {
      let matchingClient = null
      for (var i = 0; i < windowClients.length; i++) {
        var windowClient = windowClients[i]
        if (windowClient?.url?.includes(self.location.origin)) {
          matchingClient = windowClient
          break
        }
      }
      if (matchingClient?.postMessage) matchingClient.postMessage(type)
    })
}

if (messaging) {
  messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)
    // Customize notification here
    postShowNotificationMessage({ postMessageType: postMessageTypes.show, payload })
  })
}
// [END on_background_message]
