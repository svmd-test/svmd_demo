import { firestore, storage ,requestFirebaseNotificationPermission} from './config'; //
import { updatePassword } from '../firebase/auth'; // updateDisplayName

export const createUserDocument = async (user) => {
  // get a reference to the Firestore document
  const docRef = firestore.doc(`/users/${user.uid}`);
  //console.log(user);
  // create user object
  const extraInfo=user.photoURL.split("|")
  const userProfile = {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    receiveEmail: ( extraInfo[0] === "true") ,
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: extraInfo[1],
    gender: '',
    dob: '',
    weight: '',
    height: '',
    devices: ['bloodPressureMonitor'],
    doctor: '',
    created: new Date(user.metadata.creationTime)
  };

  // write to Cloud Firestore
  return docRef.set(userProfile);
};

export const updateUserDocument = async (user) => {
  console.log('User.. : ', user)

  const docRef = firestore.doc(`/users/${user.uid}`);
  const { password, ...userPasswLess} = user;
  if (password) {
    //console.log('Pw...: ', await password)
    updatePassword(password)
  }
  // if (user.name) {
  //   updateDisplayName(user.name,user.uid)
  // }

  requestFirebaseNotificationPermission()
  .then((firebaseToken) => {
    // eslint-disable-next-line no-console
    // alert("User there fBt:")
    return docRef.update({'firebaseToken' : { 'key' : firebaseToken ,'created' : Date.now() } } )
    //console.log("User fBt: ", firebaseToken, docRef.update({'firebaseToken' : firebaseToken}));
    //return firebaseToken;
  })
  .catch((err) => {
    //alert("Oops")
    //console.log("requestFirebaseNotificationPermission Error: ", err);
    return err;
  });

  // console.log('User.aft..: ', userPasswLess)
  return docRef.update(userPasswLess);
};

export const overrideUserDocument = async (user) => {
  console.log('User.. : ', user)

  const docRef = firestore.doc(`/users/${user.uid}`);

  return docRef.update({ override : user});
};

export const setUserDeviceLastReading =  (uid,deviceType,lastReading,diff,readings) => {
  let device={}
  device[deviceType]={ 'lastReading' : lastReading , 'updated' : Date.now()  } // manufacturer_name_string:deviceInformation.manufacturer_name_string
  console.log("setUserDeviceLastReading: ",uid,deviceType,lastReading,device,diff)
  const docRef = firestore.doc(`/users/${uid}`);
  //const doc = await docRef.get();

  const alertMessage = `SmartViewMD saved ${diff} ${deviceType} device reading(s). ${readings.join(", ")}`
  alert(alertMessage)
  console.log(alertMessage,device )
  return docRef.update( {deviceInfo: device } )
}

export const setUserDevicePW =  (uid,deviceType,passWord,deviceInformation) => {
  let device={}
  device[deviceType]={ 'pw' : passWord , 'paired' : Date.now() , ...deviceInformation } // manufacturer_name_string:deviceInformation.manufacturer_name_string
  console.log("setUserDevicePW: ",uid,deviceType,passWord,deviceInformation,device)
  const docRef = firestore.doc(`/users/${uid}`);
  //const doc = await docRef.get();

  const alertMessage = `SmartViewMD paired to ${deviceInformation?.manufacturer_name_string} ${deviceInformation?.model_number_string} ${deviceType} device.`
  alert(alertMessage)
  console.log(alertMessage,device )
  return docRef.update( {deviceInfo: device } )
}

export const getUserDevicePW = async (uid,deviceType) => {
  const docRef = firestore.doc(`/users/${uid}`);
  const doc = await docRef.get();
  return !doc.data()?.deviceInfo[deviceType]?.pw.exists ? doc.data().deviceInfo[deviceType].pw : []
}

function trimUserReading(readings) {
  let readingWithValue={}
  for (let device in readings.devices) {
    let deviceReading={}
    deviceReading[device] = readings.devices[device]
    if (getAllVals(deviceReading)!=="") {
      readingWithValue={ ...deviceReading , ...readingWithValue}
    }
  }
  return { devices: readingWithValue}
}

function getAllVals(obj) {
  let val=""
  for (let k in obj) {
    if (typeof obj[k] === "object") {
      val+=getAllVals(obj[k])
    } else {
      // base case, stop recurring
      val+=`${obj[k]}`.trim();
    }
  }
  return val
}

export const addUserReading = async (user) => {
  const docRef = firestore.doc(`/users/${user.uid}`);
  const doc = await docRef.get();
  const doctor = !doc.data().doctor.exists ? doc.data().doctor : '';
  requestFirebaseNotificationPermission()
  .then((firebaseToken) => {
    return docRef.update({'firebaseToken' : { 'key' : firebaseToken ,'created' : Date.now() } } )
  })
  .catch((err) => {
    return err;
  });
  //console.log ("...user.add: ", user.add.devices)
  const navs = {
    userAgent: navigator?.userAgent,
    appName: navigator?.appName,
    appVersion: navigator?.appVersion,
    vendor: navigator?.vendor,
    platform: navigator?.platform
  }
  const batch = firestore.batch()

  if (user?.adds?.length) {
    user.adds.forEach( add => {
      const readingRef = docRef.collection('readings').doc()
      let reading = {}
      if ( user?.createdBy ) {
        reading = { ...add.reading , navigator: navs, createdBy: user.createdBy }
      } else {
        reading = { ...add.reading , navigator: navs }
      }      
      console.log(`ADD:`,reading)
      batch.set(readingRef, reading);
    })
    return batch.commit()
  } else {
    const readingWithValue = trimUserReading(user.add)
    if (user?.createdBy) {
      return readingWithValue && Object.entries(readingWithValue).length > 0 ? docRef.collection('readings').add({ created: Date.now(), profile: {doctor: doctor}, ...readingWithValue, navigator: navs , createdBy: user.createdBy } ) : null
    } else {
      return readingWithValue && Object.entries(readingWithValue).length > 0 ? docRef.collection('readings').add({ created: Date.now(), profile: {doctor: doctor}, ...readingWithValue, navigator: navs } ) : null
    }
  }
};

export const uploadImage = (userId, file, progress) => {
  return new Promise((resolve, reject) => {
    // create file reference
    const filePath = `users/${userId}/profile-image`;
    const fileRef = storage.ref().child(filePath);

    // upload task
    const uploadTask = fileRef.put(file);

    uploadTask.on(
      'state_changed',
      (snapshot) => progress(snapshot),
      (error) => reject(error),
      () => {
        resolve(uploadTask.snapshot.ref);
      }
    );
  });
};

export const getDownloadUrl = (userId) => {
  const filePath = `users/${userId}/profile-image`;
  return storage.ref().child(filePath).getDownloadURL();
};
