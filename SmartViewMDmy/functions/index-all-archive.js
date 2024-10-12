const functions = require('firebase-functions');
// const admin = require('firebase-admin')
// admin.initializeApp();
// //const db = admin.firestore();
// /* initialise firestore */
// const firestore = admin.firestore();
// firestore.settings({
//     timestampsInSnapshots: true
// });

//const sendWelcomeEmail = require('./smartviewmd/sendWelcomeEmail.js')

// exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
//   const email = user.email;
//   return sendWelcomeEmail(email);
// });

//const sendRecordAddedEmail = require('./smartviewmd/sendRecordAddedEmail.js')

// exports.sendRecordAddedEmail = functions.firestore.document('users/{userId}/readings/{readingId}').onCreate(async (snap,context) => {

//   const newValue = snap.data();
//   const patientRecord = await db.doc(`users/${context.params.userId}`).get();

//   const today = new Date();
//   const lastWeek= new Date(today - 7 * 24 * 60 * 60 * 1000);

//   let patientReadings=[];
//   await db.doc(`users/${context.params.userId}`).get()
//     .collection("readings").where('created','>',lastWeek).orderBy('created','desc' ).get()
//     .then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//           patientReadings.push(doc.data())
//       });
//     })
//   const email = "dom@belleit.net";
//   return sendRecordAddedEmail( email , newValue , patientRecord._fieldsProto , patientReadings);
// });


// exports.simpleHttp = functions.https.onRequest( async (request, response) => {

//   var today = new Date();
//   var lastWeek= new Date(today - 7 * 24 * 60 * 60 * 1000);
//   response.send(`<pre>today: ${today.toISOString()} \nlast week ${lastWeek.toISOString()} <pre>`);

// });

// exports.simpleHttp = functions.https.onRequest( async (request, response) => {
//   //response.send(`uid: ${request.query.uid}`);
//   const doc = db.doc(`users/${request.query.uid}`)
//   const patientRecord = await doc.get()

//   const today = Date.now();
//   const lastWeek= today - 7 * 24 * 60 * 60 * 1000;
//   //response.send(`<pre>today: ${new Date(today)} \nlast week ${new Date(lastWeek)} <pre>`);

//   let patientReadings=[];
//   await doc.collection("readings").where('created','>',lastWeek).orderBy('created','desc' ).get()
//   .then(querySnapshot => {
//     querySnapshot.forEach(doc => 
//       {
//         //console.log(doc.id, " => ", doc.data());
//         patientReadings.push(doc.data())
//         //return doc.id
//     });
//   })

//   //const readingTableData = Object.entries(patientRecord).map((x,y)=>(`${x}: ${y}`)).join("~");

//   //console.log("PatientRecord: ",patientRecord._fieldsProto )
//   //console.log("PatientReadings: ",patientReadings)
//   //response.send(`<pre>patientRecord: ${JSON.stringify(patientReadings, undefined, 2)}<pre>`);

//   const email = "dom@belleit.net";
//   response.send(`<pre>today: ${new Date(today)} \nlast week ${new Date(lastWeek)}\nPatient: ${JSON.stringify(patientRecord._fieldsProto.name.stringValue, undefined, 2)}\npatientRecord: ${JSON.stringify(await sendRecordAddedEmail( email , null , patientRecord._fieldsProto , patientReadings), undefined, 2)}<pre>`);

//   //return sendRecordAddedEmail( email , null , patientRecord._fieldsProto , patientReadings);
//   return null
// });

const storeAppInstanceToken = require('./smartviewmd/manageAppInstanceTokens.js')

const express = require('express')
const cors = require('cors')
const api = express()
 
// Automatically allow cross-origin requests
api.use(cors({ origin: true }))

api.get(['/api/v1', '/api/v1/'], (req, res) => {
    //console.log(req.originalUrl)
    res
      .status(200)
      .send(`<html>${req.originalUrl}<p><img src="https://media.giphy.com/media/6fScAIQR0P0xW/giphy.gif">`)
});

api.post('/storetoken', async (req, res) => {
    if (!req.body) res.sendStatus(400);
    if(req.body.token) {
        result = await storeAppInstanceToken(req.body.token);
        result?res.sendStatus(200):res.sendStatus(500);
    } else {
        res.sendStatus(400);
    }
});

// api.delete('/api/deletetoken', async(req, res) => {
//     if (!req.body) res.sendStatus(400);
//     if(req.body.token) {
//         result = await deleteAppInstanceToken(req.body.token);
//         result?res.sendStatus(204):res.sendStatus(500);
//     } else {
//         res.sendStatus(400);
//     }
// });

// api.post('/api/subscribe', async(req, res) => {
//     if (!req.body) res.sendStatus(400);
//     if(req.body.token) {
//         result = await subscribeAppInstanceToTopic(req.body.token, req.body.topic);
//         result?res.sendStatus(200):res.sendStatus(500);
//     } else {
//         res.sendStatus(400);
//     }
// });

// api.post('/api/unsubscribe', async(req, res) => {
//     if (!req.body) res.sendStatus(400);
//     if(req.body.token) {
//         result = await unsubscribeAppInstanceFromTopic(req.body.token, req.body.topic);
//         result?res.sendStatus(200):res.sendStatus(500);
//     } else {
//         res.sendStatus(400);
//     }
// });

exports.api = functions.https.onRequest( api );