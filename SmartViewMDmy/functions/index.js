const functions = require('firebase-functions');

const sendWelcomeEmail = require('./smartviewmd/sendWelcomeEmail.js')

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {

  console.log('user:', user)

  if ( user.photoURL == 'true' ) {

    return sendWelcomeEmail(user.email);

  } else {

    console.log('No email selected')
    return null

  }

});