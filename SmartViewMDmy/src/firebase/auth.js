import firebase from 'firebase/app';
import 'firebase/auth';
import { createUserDocument } from './user';

export const signup = async ({ firstName, lastName, receiveEmail, email, password, phone}) => {
  const resp = await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password);
  const user = resp.user;
  //console.log(user);
  await user.updateProfile({ displayName: `${firstName} ${lastName}`, photoURL: `${receiveEmail}|${phone}` });
  //console.log(user);
  await createUserDocument(user);
  return user;
};

export const logout = () => {
  return firebase.auth().signOut();
};

export const login = async ({ email, password }) => {
  const resp = await firebase
    .auth()
    .signInWithEmailAndPassword(email, password);

  return resp.user;
};

export const updatePassword = async (newPassword) => {
  const user = await firebase
    .auth()
    .currentUser
    .updatePassword(newPassword)
    .then(function() {
    // Update successful.
      console.log('Password succesfully updated')
      alert('Password succesfully updated')
    }).catch(function(error) {
      // An error happened.
      alert('Error during password update: ',error)
    });

  return user
  };

 export const sendResetEmail = async (email, continueUrl) => {
    const actionCodeSettings = { url: continueUrl }
    //event.preventDefault();
    const user = await firebase
      .auth()
      .sendPasswordResetEmail(email, actionCodeSettings ) 
      .then(() => {
        console.log('Sent email with link to reset password')
        alert('Sent email with link to reset password')
        // setEmailHasBeenSent(true);
        // setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
      })
      // .catch(() => {
      //   alert("Error resetting password");
      // });
  return user
};
  // export const updateDisplayName = async (user) => {
  //   const user = await firebase
  //     .auth()
  //     .updateUser(user.uid, { displayName: name })
  //     .then(function() {
  //     // Update successful.
  //       console.log('displayName succesfully updated')
  //       alert(`displayName succesfully updated to ${name} for uid: ${uid}`)
  //     }).catch(function(error) {
  //       // An error happened.
  //       alert('Error during displayName update: ',error)
  //     });
  
  //   return user
  //   };