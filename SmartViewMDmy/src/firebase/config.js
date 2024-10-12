import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
//import 'firebase/messaging';
import '@firebase/messaging';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_WEB_APP_ID
});
//console.log(firebase.app().options);

export const firestore = firebase.firestore();
export const storage = firebase.storage();
let messaging;
// we need to check if messaging is supported by the browser
if(firebase.messaging.isSupported()) {
  //alert("config.js Messaging supported")
  messaging = firebase.messaging();
} else {
  //alert("Messaging NOT supported")
  //messaging = firebase.messaging();

}

export {
  messaging
};

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(()=>{
        //alert("have Messaging Connection")
      })
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        // console.log("firebaseToken:", firebaseToken) 
        resolve(firebaseToken);
      })
      .catch((err) => {
        //alert(err)
        //console.log("error Messaging Connection: ", err)
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      //console.log('PUSH NOTIFICATION:',payload)
      resolve(payload);
    });
  });

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            updateViaCache: 'none'
        });
        messaging.useServiceWorker(registration);
        messaging.onMessage((payload) => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.body,
                icon: payload.notification.icon,
                actions: [
                    {
                        action: payload.fcmOptions.link,
                        title: 'SmartViewMD Notification'
                    }
                ]
            };
            //console.log("title: ",title, "\noptions: ",options)
            registration.showNotification(title, options);           
        });
    });
}