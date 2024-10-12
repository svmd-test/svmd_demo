//const { Alert } = require("bootstrap");

// import firebase scripts inside service worker js script
importScripts('https://www.gstatic.com/firebasejs/5.7.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '986308448892' 
});

const messaging = firebase.messaging();

self.addEventListener('notificationclick', (event) => {
    if (event.action) {
        clients.openWindow(event.action);
    }
    //alert("event clicked")
    event.notification.close();
}); 