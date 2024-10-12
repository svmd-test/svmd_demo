import { playAudio} from '../components/playAudio';
import {
  addUserReading,
  //getUserDevicePW,
  setUserDevicePW,
} from "../firebase/user";
import { func } from 'prop-types';

// Getting Characteristics...
// > Characteristics: 00008a81-0000-1000-8000-00805f9b34fb No Descriptors found in Characteristic.
//                    00008a82-0000-1000-8000-00805f9b34fb 
//                    00008a90-0000-1000-8000-00805f9b34fb
//                    00008a91-0000-1000-8000-00805f9b34fb > Descriptors: 00002902-0000-1000-8000-00805f9b34fb
//                    00008a92-0000-1000-8000-00805f9b34fb

let _ = {
    UUID: {
      Service:          0x7802,
      Write:            0x8a81,
      Indicate_Info:    0x8a82,
      Indicate_Data:    0x8a21,
      Indicate_Battery: 0x8a22,
    },
    CommandCode:{
      Verification: 0x20,  //  32 to Device 1.4.10
      AccountID:    0x21,  //  33 to Device 1.4.8
      Acknowledge:  0x22,  //  34 to Device 1.4.13 1.5.11
      Password:     0xa0,  // 160 ? used - from Device 1.4.7
      RandomNumber: 0xa1,  // 161 ? used - from Device 1.4.9
      // TimeOffset:   0x02,
      // [ _.CommandCode.TimeOffset,  0x01, 0x01, 0x01, 0x01] 
    },
    TimeOffset: new Uint8Array(  [ 0x02 ,  0x00 ] ),
    completed: 10,
    UserID: null,
    TestUID: "xTRr4hjFRvXeyR8PDO9oumMhJ2ru1",//"NiiV6frkTfbujQaGOFXBiNtuy0F3",
    bluetoothDevice: null,
    pairingService: null,
    receivedPassWord: false,
    receivedRandomNumber: false,
    randomNumberReceived: [],
    verificationCode: [],
    pendingDeviceInfo: true, 
    providedDeviceNotifications: false,
    retreivedDeviceInformation: false,
    pairingEventListenerCounter: 0,
    DevicePassword: [], // getUserDevicePW() // [167, 47, 79, 47];
    DeviceInformation: {},
    readingService: null,
    allScaleReadings: [],
    connectionCount: 0,
    receivedScaleReadings: false,
    lastScaleRead: 0,
    notifiedPairing: false,
    Pairing: false
} 

export const onScaleDeviceButtonClick = (uid,deviceType,isStandard,devicePW) => {
    // _.bluetoothDevice = null;

    if (!/(iPhone.*Bluefy|Netscape.*iPhone|^(?:(?!iPhone).)+$)/.test(browserTypeVersion()) ) {
      alert('For Bluetooth, please use "SmartViewMD", "WebBLE" or "Bluefy" app on iPhone for SmartViewMD.')
    }

    // if ( isStandard) {
    //   processStandardDevice( uid ,deviceType,devicePW)
    // } else {
      processWelchDevice( uid ,deviceType,devicePW)
    //}
}

function processWelchDevice( uid ,deviceType,devicePW){

    _.UserID = uid;
    _.lastScaleRead = 0
    console.log("0000. devicePW",devicePW)
    if ( devicePW != null && devicePW.length > 3 )  {
      _.DevicePassword=devicePW;
    } else {
      _.Pairing=true
      log('a08. Pairing',_.DevicePassword,_.Pairing)
    }

    if (_.bluetoothDevice === null) {
      //_.bluetoothDevice=restoreBluetoothDevice()
      if (_.bluetoothDevice == null) {
          requestDeviceConnection(deviceType,devicePW)
  
      } else {
          log('a09.  Restored Bluetooth Device connection',_.bluetoothDevice.name)
  
          connect();
      }
    } else {
      log('a10.  Strange already had Bluetooth Device connection !!! unexected',_.bluetoothDevice.name)
      const divID = "blueToothReadingsDivscale";
      document.getElementById(divID).innerHTML = "ᛒluetooth"
      _.receivedRandomNumber = false;
      _.randomNumberReceived = []
      _.receivedRandomNumberScale = false;
      _.randomNumberReceivedScale = []
      _.allScaleReadings= []
      _.connectionCount= 0
      _.receivedScaleReadings= false
      _.lastScaleRead= 0
       _.completed=1
       localStorage.setItem('completed_scale', 1)

      connect();
  
    }
  }


function browserTypeVersion() {
    return [navigator?.userAgent,navigator?.appName,navigator?.appVersion].join(' ')
}

function requestDeviceConnection(deviceType,origDevicePW) {

    log('000. Requesting any Bluetooth Device...',_.bluetoothDevice );

    let filter = {}

    if ( _.Pairing  ) { // && !/iPhone/.test(browserTypeVersion() )
      filter = { 
          //acceptAllDevices: true,
          filters: [
            {
              services: [   _.UUID.Service ]
            },
          ],
          optionalServices: [  _.UUID.Service],
        }
    } else {
      filter = { 
        filters: [
          {
            services: [ _.UUID.Service ]
          },
        ],
      }
    }
    if (  _.UserID === _.TestUID ) {
      alert( JSON.stringify(filter) )
      alert( browserTypeVersion() )
      alert( `test if iPhone: ${/iPhone/.test(browserTypeVersion())}`)
    }

    log('000a. device filter',filter)
    navigator.bluetooth.requestDevice( filter)
    .then(device => {
      _.bluetoothDevice = device;
      //const sounds = document.getElementsByTagName('audio');
      //for(let i=0; i<sounds.length; i++) sounds[i].pause()
      //new Audio('/audio/BluetoothConnected.mp3').play()
      //playAudio('/audio/BluetoothConnected.mp3')

      if ( _.completed < 100) localStorage.setItem('completed_scale', _.completed++) 
      
      if (_.Pairing) {
        device.addEventListener('gattserverdisconnected', onDisconnectedPairing);        
      } else {
        device.addEventListener('gattserverdisconnected', onDisconnectedReading); 
        //storeBluetoothDevice(device,deviceType)
      }
      connect();
    
    })
    .catch(error => {
      log('001. Argh! ' + error);
      // if (  _.UserID !== _.TestUID ) 
      //   window.location.reload(false); 
    });
}

function delayPromise(delay) {
  return new Promise(resolve => {
      setTimeout(resolve, delay);
  });
}

function pairBluetoothDevice(server) {

  if (!_.providedDeviceNotifications) {
    _.providedDeviceNotifications = true;
    server
      .getPrimaryService(_.UUID.Service) // 0x7809
      .then((service) => {
        log("005c. service: ", service);
        _.pairingService = service;
        return service.getCharacteristic(_.UUID.Indicate_Data);
      })
      .then((characteristic) => {
        log("005d. characteristic: ", characteristic);
        return characteristic.startNotifications()
      })
      .then((characteristic) => {
        log("005e. addEventListener! " , characteristic);
        return characteristic.addEventListener("characteristicvaluechanged",readingEventListener);
      })
      .then(() => {
        log("005f. service: ", _.pairingService);
        return _.pairingService.getCharacteristic(_.UUID.Indicate_Info);
      })
      .then((characteristic) => {
        log("005g. characteristic: ", characteristic);
        return characteristic.startNotifications()
      })
      .then((characteristic) => {
        log("005h. addEventListener! " , characteristic);
        characteristic.addEventListener("characteristicvaluechanged",pairingEventListener);
      })
      .then(() => {
        log(
          "005i. characteristic enabled for pairingEventListener of Password & Random_Number  ") //.readValue();
                //delayPromise(20)
      })
      .catch((error) => {
        log("007. Argh! " + error);
        //if (  _.UserID !== _.TestUID ) 
          //window.location.reload(false); 
      });
  } else {

    if (!_.retreivedDeviceInformation) {
      log("006c0. ERROR did not to getDeviceInformation");

    } else {
      log("006c1. ERROR already retreivedDeviceInformation");
      // maybe save to fireBase?
    }
  }

    // log('005b. into pairBlueetoothDevice',_.bluetoothDevice.name ,server)
    // if (!server.connected){
    //     connect()
    // }
    // return server.getPrimaryService(_.UUID.Service)  // 0x7809
    // .then((service)=>{
    //   log("005c. service: ", service);
    //   _.pairingService = service;
    //   return _.pairingService.getCharacteristic(_.UUID.Indicate_Info); // Listen for AccountID   
    // })    
    // .catch(error => {
    //     log('005d. Argh! ' + error);
    //     return null
    // });

}

function pairingEventListener(event) {
    log(
      _.pairingEventListenerCounter++,
      "005.7a. EVENT:",
      event.target.value,
      "\n",
      event,
      event.target.value.byteLength
    );
    let imuData = event.target.value;
    
    if (parseInt(event.target.value.getUint8(0)) === 160) {
        _.receivedPassWord = true;
        _.DevicePassword = [
          event.target.value.getUint8(1),
          event.target.value.getUint8(2),
          event.target.value.getUint8(3),
          event.target.value.getUint8(4),
        ];
    }
    if (parseInt(event.target.value.getUint8(0)) >= 161) {
      _.receivedRandomNumber = true;
  
      _.randomNumberReceived = [
        event.target.value.getUint8(1),
        event.target.value.getUint8(2),
        event.target.value.getUint8(3),
        event.target.value.getUint8(4),
      ];
  
      for (var i = 0; i < _.DevicePassword.length; i++) {
        _.verificationCode.push(_.DevicePassword[i] ^ _.randomNumberReceived[i]);
      }
    }
    log({
      "005.7b. receivedRandomNumber": _.receivedRandomNumber,
      "005.7c. receivedPassWord": _.receivedPassWord,
      "005.7d. pendingDeviceInfo": _.pendingDeviceInfo,
    });
  
    if (_.receivedRandomNumber && _.receivedPassWord && _.pendingDeviceInfo) {
      //
      _.pendingDeviceInfo = false;

      setUserDevicePW(
        _.UserID,
        "scale",
        _.DevicePassword,
        {manufacturer_name_string:"TBD",model_number_string:"PENDING"}
      )

      log(
        `005.8a. _.DevicePassword = ${_.DevicePassword}`,
        `\n005.8b. randomNumberReceived = `,
        _.randomNumberReceived,
        '\n005.8c. verificationCode = ',
        _.verificationCode
      );
  
      log(
        `005.8d. Finally got all info (randonNumber & passwd) needed Event: ${event.target.value.getUint8(0)}\nEvent:`,
        event
      )

      log(
          "006a. started Notifiction ... going back to sendDeviceNotifications"
      )

      if (!_.retreivedDeviceInformation) {
        _.retreivedDeviceInformation = true;   
        log("006bb. proceeding to getDeviceInformation");
        getDeviceInformation(_.bluetoothDevice);
      }

    } else {
      delayPromise(10)
      .then(()=>{

        if (_.receivedRandomNumber && _.receivedPassWord) {
          // && ! pendingDeviceInfo
          // done
          log(
              `005.8f. Already received receivedRandomNumber & receivedPassWord & : ${event.target.value.getUint8(0)}\nEvent:`,
              event
            );        
          //onDisconnectedPairing();
  
        } else {
          log(
            `005.8g. Awaiting more Verfication Codes: ${event.target.value.getUint8(0)}\nEvent:`,
            event
          );
          sendDeviceNotifications(_.verificationCode, _.pairingService)
          .then(()=>{
            if (!_.retreivedDeviceInformation) {
              _.retreivedDeviceInformation = true;   
              log("006b. proceeding to getDeviceInformation");
              getDeviceInformation(_.bluetoothDevice);
            }
          })
          .catch((e)=>{
            if (!_.retreivedDeviceInformation) {
              _.retreivedDeviceInformation = true;   
              log(`006bbb. proceeding to getDeviceInformation, in spite of ERROR ${JSON.stringify(e)}`);
              getDeviceInformation(_.bluetoothDevice);
            }
          })
        }

      })
      
    }
  
    return imuData;
}

// function sendAccountID(pairingService) {
//     let data = new Uint8Array([_.CommandCode.AccountID, 0x01, 0x02, 0x03, 0x04]);

//     pairingService
//       .getCharacteristic(_.UUID.Write)
//       .then((characteristic) => {
//         characteristic
//           .writeValue(data)
//           .then((response) => {
//             log("005r. Sent Account ID 01 02 03 04 -- response: ", response);
//           })
//           .catch((err) => log("005s. Error when writing value! ", err));
//       })
//       .then((resultsOfWrite) => {
//         return resultsOfWrite;
//       })
//       .catch((err) =>
//         log("005t. Error when connecting characteristic to write value! ", err)
//       );
// }
  
function connect() {
  exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
    async function toTry() {
      time(`002. Connecting to Bluetooth Device... ${_.connectionCount++}`);
      const serverConnected = await _.bluetoothDevice.gatt.connect();
      return serverConnected
    },
    function success(server) {
      log(`003. > Bluetooth Device (re)connected. ${_.connectionCount}`,_.bluetoothDevice );
      if ( ! _.Pairing && ! _.receivedScaleReadings && _.DevicePassword.length === 4 ) {
          log('004. Getting Data',_.bluetoothDevice.name )
          // _.serverConnected = server
          getScaleReadings(server)
      } else {
        if (_.Pairing) {
            log('005. Pairing Device',_.bluetoothDevice.name )
            pairBluetoothDevice(server)

        } else {

            log('008. WARNING !!! un accounted _.bluetoothDevice.name response',_.bluetoothDevice)
        }

      }
    },
    function fail() {
      time('010. Failed to reconnect.');
    });
}

const sendDeviceNotification = (service,code) => {
  const message = new Uint8Array([code]);
  service
    .getCharacteristic(_.UUID.Write)
    .then((characteristic) => {
      log(`s3... sendDeviceNotification ${code.toString(16)} [${message}] characteristic: `, characteristic);


      characteristic
        .writeValue(message)
        .then((response) => {
          log(`88. Sent message 0x${code.toString(16)} [${message}] -- response: `, response);
        })
        .then(() => {});
    })
    .catch((err) => log(`88x. Error when sending message ${code} [${message}] ! `, err));
};

function sendDeviceNotifications(verificationCodeCommand, pairingService) {

    // sendAccountID(pairingService);

    return pairingService.getCharacteristic(_.UUID.Write).then((characteristic) => {

        log("006.7. about to send Account ID 01 02 03 04 -- to characteristic: ", characteristic);
        characteristic
            .writeValue(new Uint8Array([_.CommandCode.AccountID, 0x01, 0x02, 0x03, 0x04]))
            .then((response) => {
                log("006.8 Sent Account ID 01 02 03 04 -- response: ", response);

                log("006.9... App Sending Device Verfication Code: ", verificationCodeCommand);


                //onConnected()
                characteristic
                .writeValue(new Uint8Array([_.CommandCode.Verification,...verificationCodeCommand]))
                .then((r) => {
                    log("006.10. EUREKA !!! App Sent Verification Code to Device ", r);
            
                    // const timeOffset = [_.CommandCode.TimeOffset]
                    //   .concat(parseInt((Date.now() - Date.parse("2010-01-01")) / 1000))
                    //   .toString(16)
                    //   .match(/../gi)
                    //   .map((n) => parseInt(n, 16));
                    //   // .toString(16).match(/../gi).map(n=>parseInt(n,16))
            
                    // //onConnected()
                    // const ta = [
                    //     timeOffset[0],
                    //     timeOffset[4],
                    //     timeOffset[3],
                    //     timeOffset[2],
                    //     timeOffset[1],
                    // ];
                    // log("006.1x1. timeOffset to get Scale readings = ", timeOffset, ta);
                    //const timeOffset = [ _.CommandCode.TimeOffset, 0x04 , 0x03, 0x02, 0x01 ]
                    // const millisDiff=Date.now() - Date.parse("2010-01-01")
                    // const timeOffset = [ _.CommandCode.TimeOffset ].concat(Math.floor(millisDiff/1000))
                })                    
                .then(() => {
                  log('006.11. adding Delay for iOS')
                  delayPromise(20)
                })
                .then(() => {
                  characteristic
                    .writeValue( _.TimeOffset) // ta
                    .then((rr) => {
                        log(
                        "006.12. OMG - Device Accepted timeOffset to almost get Device readings = ",
                        _.TimeOffset ,
                        rr
                        );
            
                        const enableDisconect = [_.CommandCode.Acknowledge];
            
                        //onConnected()
                        characteristic
                        .writeValue(new Uint8Array(enableDisconect))
                        .then(() => {

                            log(
                            "006.13. UNREAL - Device Accepted enableDisconect to get Device readings = ",
                            enableDisconect
                            ); //finalReading
                            delayPromise(10)

                            //onDisconnectedPairing()
                            // ... sendAck();  <-- I doubt this is needed
                            // if ( ! receivedScaleReadings )
                            //    getScaleReadings(verificationCodeCommand, passWordReceivedSaved)
                        })
                        .catch((err) => {
                            log(
                            "006.13e. ERROR Device did NOT accepted enableDisconect to get Device readings ",
                            err
                            );
                        });
                    })
                    .catch((err) => {
                        log(
                        "006.12. ERROR Device did NOT accepted timeOffset to get Device readings ",
                        err
                        );
                    });
                        
                    // characteristic.writeValue( new Uint8Array([  0xa1] ) )
                    // .then((r)=>{
                    //     log('xxWrote Command 0xa1 to get RandNum: ',r)
                    //  })
                });
            });
        })
        .catch((errorSendingAccountID)=>{
            log('007.7e. Error sendingAccount ID',errorSendingAccountID)
        });
}

function getDeviceInformation(devicePaired) {
    let service;
    devicePaired.gatt.connect()
    .then((server)=>{
      log("001a. server reConnected", server);
      server.getPrimaryService("device_information")
      .then((deviceService) => {
        service = deviceService
        return fetchCharacteristicInfo( service,"manufacturer_name_string")
      })
      .then(()=>{
        return fetchCharacteristicInfo( service,"model_number_string");
      })
      .then(()=>{
        return fetchCharacteristicInfo( service, "firmware_revision_string");
      })
      .then(()=>{
        return fetchCharacteristicInfo( service, "hardware_revision_string");
      })
      .then(()=>{
        return fetchCharacteristicInfo( service, "software_revision_string");
      })
      .then(()=>{
        
        if (_.DevicePassword.length !== 4) delayPromise(20)
      })
      .then(()=>{
              
          // consider exponential backoff
          setUserDevicePW(
              _.UserID,
              "scale",
              _.DevicePassword,
            _.DeviceInformation
          ).then((response)=>{
              log('101f setUserDevicePW response',response)
              // if (response === "COMPLETED") {
              //     _.retreivedDeviceInformation=true
              // }
              return devicePaired.gatt.disconnect();

          }); // Surely DeviceInfo is completed
          log("101c. setUserDevicePW launched ",_.UserID,_.DevicePassword, _.DeviceInformation);
          return 'COMPLETED'
      })
      .catch((errorEstablishingDeviceInfoConnection)=>{
          log('001be. Error [device_information] errorEstablishingDeviceInfoConnection',errorEstablishingDeviceInfoConnection)
      });
      log('101d. _.DeviceInformation',_.DeviceInformation)
    })
}

function fetchCharacteristicInfo(service, memberName) {
    let decoder = new TextDecoder("utf-8");
    log('001c. processing ',memberName)
    service.getCharacteristic(memberName)
    .then((characteristic)=>{
        log('001d. processing characteristic for',memberName,characteristic)
        return characteristic.readValue()
    })
    .then((value)=>{
        _.DeviceInformation[memberName] = decoder.decode(value);
        log('001e. set value', _.DeviceInformation[memberName])
    })
    .catch((err) => {
        log("001f. Argh! could not set value or ger characteristic for",memberName,err);
    });
    // })
    // .catch((err) => {
    //     log("001f. Argh! could not ger characteristic for ",memberName,err);
    // });
    return 'completed_scale'
}

function onDisconnectedPairing(device) {
  log('020. > Bluetooth Device disconnected');
  //delayPromise(0)
  //.then(()=>{
    if (!_.notifiedPairing) {
      _.notifiedPairing=true
      if ( _.pendingDeviceInfo) {
        new Audio('/audio/PairingFailed.mp3').play()
        .then(()=>{
          delayPromise(20)
        })
        .then(()=>{
          //if (  _.UserID !== _.TestUID ) 
            //window.location.reload(false); 
        })
      } else {
        _.completed = 100
        localStorage.setItem('completed_scale', _.completed)  
        playAudio('/audio/DevicePaired.mp3')
        .then(()=>{
          if (  _.UserID !== _.TestUID ) {
            alert("Completed Bluetooth Device Pairing!");
            //window.location.reload(false); 
          }
        })
      }
    }

  //})
  //.then(()=>{
    connect();
  //})

}

function getMeasurementData() {
  return _.readingService.getCharacteristic(_.UUID.Indicate_Data)
  .then(characteristic => characteristic.startNotifications())
  .then((characteristic) => {
    log(
      `123a. got characteristic to add readingEventListenerData for ${_.UUID.Indicate_Data}   . . .`
    ); // Scale sendAck()
    //alert(`2nd ${_.DevicePassword}`)

    return characteristic.addEventListener(
      "characteristicvaluechanged",
      (event) => {
        readingEventListenerData(event, _.DevicePassword);
      }
    );

  })
  .then(() => {
    log(`123b. added readingEventListenerData for ${_.UUID.Indicate_Data}   . . . with PW `, _.DevicePassword); // Scale sendAck()

    //delayPromise(10)
  })
  .then((_r) => {
      log(
        `123c. > ${_.UUID.Indicate_Data} Scale Notifications started ... a MIRACLE !!!`,
        _r
      );

     // sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge);
  })
  .catch((error) => {
      log(`123e. > ${_.UUID.Indicate_Data} Scale Notifications FAILED ... a BUMMER !!!`,  error);
    //sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge)
  });
}

function getScaleReadings(server) {
  // (verificationCodeCommand, passWordReceivedSaved)

  log('119. entered getScaleReadings(server) ',server)
  //alert('_.DevicePassword')

  server.getPrimaryService(_.UUID.Service) // 0x7809
    .then((service) => {
      log("119a. service: ", service);
      _.readingService = service;
      return service.getCharacteristic(_.UUID.Indicate_Data);
    })
    .then((characteristic) => {
      log("119b. characteristic: ", characteristic);
      return characteristic.startNotifications()
    })
    .then((characteristic) => {
      log("119c. addEventListener! " , characteristic);
      return characteristic.addEventListener("characteristicvaluechanged",readingEventListener);
    })
    .then(() => {
      log("120... service: ",  _.readingService);
      return _.readingService .getCharacteristic(_.UUID.Indicate_Info); //  1.5.5 Enable Characteristics to get listen for reading
    })
    .then((characteristic) => {
      return characteristic
      .startNotifications(`_.UUID.Indicate_Info001`)
    })
    .then((characteristic) => {
      log(
        `121... listen characteristic ${_.UUID.Indicate_Info} to get Scale readings:  `,
        characteristic
      ); 
      log("121d... somehow already had device PW ", _.DevicePassword);

      return characteristic.addEventListener("characteristicvaluechanged",readingEventListener);

    })
    // .then(() => {
    //  //delayPromise(10) 
    // })
    .then((_r) => {
            log("122. > _.UUID.Indicate_Info Scale Notifications started", _r);

    })          
    .catch((error) => {
      log(`122e. > ${_.UUID.Indicate_Info} Scale Notifications FAILED ... a BUMMER !!!`,  error);
    });

    //  }
    //   return characteristic
    // })
    // .then((characteristic) => {

    //   return "onConnected()";
    // })
    // .catch((error) => {
    //   log("22. Argh! " + error);
    // });

  //sendAccountID()

  log("23. started Notifiction to get Scale readings");

};


function readingEventListenerData(event, pwReceived) {

  if (
    // _.receivedRandomNumberScale &&
    // _.receivedPassWord &&
    //parseInt(event.target.value.getUint8(0)) < 160 &&
    event.target.value?.byteLength === 11
  ) {
    // && ! pendingDeviceInfo
    // done
    log(
      "26b. WE ARE HERE !!! ",
      event.target.value.getUint8(0),
      " -- byteLen: ",
      event.target.value?.byteLength,
      "\n",
      event
    );

    // document.getElementById("bloodPressureReadings").innerHTML = reportNotifications(event);
    // document.getElementById("systolic").innerHTML = event.target.value.getUint8(1);
    // document.getElementById("diastolic").innerHTML = event.target.value.getUint8(3)
    // document.getElementById("heartRate").innerHTML = event.target.value.getUint8(11)
    //var offset = new Date().getTimezoneOffset();
    // const ts = event.target.value.getUint8(7) | (event.target.value.getUint8(8) << 8) | (event.target.value.getUint8(9) << 16) | (event.target.value.getUint8(10) << 24);
    // log({ts:ts})
    // const tsn = event.target.value.getUint8(7) | (event.target.value.getUint8(8) << 10) | (event.target.value.getUint8(9) << 100) | (event.target.value.getUint8(10) << 1000);
    const tsc = parseInt(
      `${event.target.value
          .getUint8(8)
            .toString(16)}${event.target.value
          .getUint8(7)
            .toString(16)}${event.target.value
          .getUint8(6)
            .toString(16)}${event.target.value
          .getUint8(5)
            .toString(16)}`,
        16
    );
    //log({tsc:tsc})
    if (tsc > _.lastScaleRead) _.lastScaleRead = tsc;

    const weight = 2.2046226218 * `0x${event.target.value
                        .getUint8(3).toString(16)}${event.target.value
                        .getUint8(2).toString(16)}${event.target.value
                        .getUint8(1).toString(16)}`  
            * ( 1 ** ( -1 * (`0x${event.target.value.getUint8(1).toString(16)}` + 1 ) ) ) / 10
    const dataArray = [weight.toFixed(1),tsc];
    _.allScaleReadings.push(dataArray);
    if (_.writeCharacteristic) writeDevice(_.writeCharacteristic,_.CommandCode.Acknowledge,0)
    //event.target.value.Uint8Array
    //sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge);

    //onConnected();
  } else {
    //sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge);
    log(
      "27. Awaiting more Verfication Codes: ",
      event.target.value.getUint8(0),
      "\n",
      event
    );
  }
}

Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
      m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

function readingEventListener(event) {
  log(
    `24. Finally getting to readingEventListener Event[0]: ${event.target.value.getUint8(0)}\n24b. Event: `, event
  );

  // 1.5.6 get new RandomNumber

  if (parseInt(event.target.value.getUint8(0)) >= 160) {
    _.receivedRandomNumberScale = true;
    _.receivedPassWord = true;
    _.randomNumberReceivedScale = [
      event.target.value.getUint8(1),
      event.target.value.getUint8(2),
      event.target.value.getUint8(3),
      event.target.value.getUint8(4),
    ];

    _.verificationCodeScale = [_.CommandCode.Verification];

    // 1.5.7 calculate/send VerificationCode = PW (XOR) RN

    for (var i = 0; i < _.DevicePassword.length; i++) {
      _.verificationCodeScale.push(_.DevicePassword[i] ^ _.randomNumberReceivedScale[i]);
    }
  }
  log({
    count: _.readingEventListenerCount++,
    receivedRandomNumberScale: _.receivedRandomNumberScale,
    receivedPassWord: _.receivedPassWord,
    tv: event.target.value,
  });
  if (
    !_.handledScalemeasurementUDataChangedOnce &&
    _.receivedRandomNumberScale &&
    _.receivedPassWord &&
    parseInt(event.target.value.getUint8(0)) >= 160
  ) {
    // && pendingDeviceInfo ... pendingDeviceInfo = false
    _.handledScalemeasurementUDataChangedOnce = true // true;
    log(
      "25. _.DevicePassword = ",
      _.DevicePassword,
      "\nrandomNumberReceivedScale = ",
      _.randomNumberReceivedScale,
      "\nverificationCodeScale = ",
      _.verificationCodeScale
    );

    log(
      "26. Finally to readingEventListener Event: \n",
      event.target.value.getUint8(0),
      "\n",
      event
    );

    getMeasurementData()
    .then(()=>{
      handleScaleMeasurement(_.verificationCodeScale, _.DevicePassword);
    })
    .then(()=>{
      sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge)
    })
    .catch((error)=>{
      log('991. Argh! ' + error);
    })


  } else {
    log('999. Not exexpted to be here',event)
    // sendDeviceNotification(_.readingService,_.CommandCode.Acknowledge);

    delayPromise(20)
  }

  // 1.5.10 get Scale reading then loop 1.5.11 ACK (0x22)

  let imuData = event.target.value;
  log("28. readingEventListener data: ", imuData);
  return imuData;
}

function onDisconnectedReading() {
  if (process.env.REACT_APP_DEBUGx) {
    alert(
      `DEBUG: onDisconnectedReading: ${_.onDisconnectedReading++}\n_.allScaleReadings.length: ${
        _.allScaleReadings.length
      }`
    );
  }
  // document.querySelector('.connect-button').classList.remove('hidden');
  // document.querySelector('.color-buttons').classList.add('hidden');
  // document.querySelector('.mic-button').classList.add('hidden');
  //document.querySelector('.power-button').classList.add('hidden');
  if (_.allScaleReadings.length > 0) {
    _.receivedScaleReadings = true;

    if (process.env.REACT_APP_DEBUGx) {
      alert(
        `DEBUG: onDisconnectedReading= ${
          _.onDisconnectedReading
        }\n_.allScaleReadings: ${JSON.stringify(
          _.allScaleReadings,
          null,
          2
        )}`
      );
    }
    log("102. All Scale readings: ", _.allScaleReadings);
    const labelsArray = [
      "Weight",
      "Date Time",
    ];
    const dateNow = Date.now();
    _.allScaleReadings.forEach((element, index) => {
      const readingDateTime = new Date(
        dateNow - (_.lastScaleRead - element[1]) * 1000
      );
      element[1] = readingDateTime.toLocaleString();
      createTable(labelsArray, element, `table${index}`);
      addUserReading({
        uid: _.UserID,
        add: {
          devices: {
            scale: {
              time: readingDateTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }),
              note: `Bluetooth Welch Allyn scale ᛒ`,
              date: readingDateTime
                .toLocaleDateString()
                .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
              reading: {
                Weight: element[0],
              },
              device: {
                manufacturer: "Welch Allyn",
                model: "SC100",
              },
            },
          },
        },
      });
      //log({addUserReadingx:addUserReadingx})
    });
  } else {
    log("NO scale readings: ");
    //if (_.disconnectedEarly) {
      _.receivedRandomNumberScale = false;
      _.handledScalemeasurementUDataChangedOnce = false;
      new Audio('/audio/TryAgain.mp3').play()
      connect()
    //}
  }
}

function writeDevice (characteristic, code, count) {

  if ( count < 1) {
    log(`76a. Sending count ${count} -- code 0x${code.toString(16)} to characteristic`, characteristic)

    return characteristic
    .writeValue(new Uint8Array([ code]))
    .then(() => {
      log('77b. adding Delay')
      delayPromise(200000)
    })
    .then((response) => {
      writeDevice(characteristic,code, count + 1 )
      log(`77a.  Sent code 0x${code.toString(16)}`, response)
    })
    .catch((err)=>{
      log("77e. ERROR Acknow", err )
    })
  } else {
    
    log(`76b. !! NOT sending count ${count} -- code 0x${code.toString(16)} to characteristic`, characteristic)
  }

}

function handleScaleMeasurement(verificationCodeCommandScale,  passWordReceivedSaved) {

  log("38.0 verificationCodeCommandScale: ", verificationCodeCommandScale);
  log("38.1 passWordReceivedSaved: ", passWordReceivedSaved); // ? redundant
  log("38.2 _.DevicePassword: ", _.DevicePassword);

  //document.getElementById("bloodPressureReadings").innerHTML = 'pending ...';
  //delayPromise(20)
  //.then(()=>{

    _.readingService
    .getCharacteristic(_.UUID.Write) // 0x8a81 to Write Info trans from App to Device Table 4 p 10
    .then((characteristicN) => {
      // 1.5.8 ensure if still connected

      characteristicN
      .writeValue(new Uint8Array([_.CommandCode.AccountID, 0x01, 0x02, 0x03, 0x04]))
      .then((response) => {
        log("39a. Sent Account ID 01 02 03 04 -- response: ", response);

        log(
          "39b... App Sending Device Verfication Code: ",
          characteristicN
        );

        //onConnected()
        characteristicN
          .writeValue(new Uint8Array(verificationCodeCommandScale))
          .then((r) => {
            log("40. EUREKA !!! App Sent Verification Code to Device ", r);
          })
          .then(() => {
            log('41a. adding Delay for iOS')
            delayPromise(20)
          })
          .then(() => {

            log(`41. timeOffset to get Scale readings = ", ${JSON.stringify(_.TimeOffset)}` );
          })
          .then(() => {
            //onConnected()

            characteristicN
              .writeValue( _.TimeOffset )
              .then((rr) => {
                log(
                  "42. OMG - Device Accepted timeOffset to almost get Scale readings = ",
                  _.TimeOffset ,
                  rr
                );
                _.writeCharacteristic = characteristicN
                //return writeDevice(characteristicN, _.CommandCode.Acknowledge,0)
              })
              .then((rr) => {
                delayPromise(20)
              })
              .catch((err) => {
                log(
                  `45. ERROR Device did NOT accepted timeOffset to get Scale readings ${JSON.stringify(err)}`
                );
                alert(
                  `45. ERROR Device did NOT accepted timeOffset to get Scale readings ${JSON.stringify(err)}`
                );
              });
          })
          .catch((err) => {
            log("39aa. ERROR Device did NOT accept verfication code ", err);
            _.disconnectedEarly=true
          });
      });
    })
    .catch((error)=>{
      log('991. Argh! ' + error);
    })
  .catch((error)=>{
      log('992. Argh! ' + error);
  })
  //})



}

const createTable = (labelArray, colDataArray, tableClassName) => {
  const divID = "blueToothReadingsDivscale";
  if (document.getElementById(divID).innerHTML === "ᛒluetooth") {
    document.getElementById(divID).innerHTML = "";
    _.completed=100;
    localStorage.setItem('completed_scale', _.completed)
    new Audio('/audio/ReadingAccepted.mp3').play()
  }

  let table = document.createElement("table"),
    thead = document.createElement("thead"),
    tbody = document.createElement("tbody"),
    th = {},
    tr = {},
    td = {};

  th = document.createElement("th");
  th.innerHTML = "ᛒluetooth";
  thead.appendChild(th);

  th = document.createElement("th");
  th.innerHTML = "Reading";
  thead.appendChild(th);

  table.setAttribute("class", tableClassName);
  table.appendChild(thead);
  table.appendChild(tbody);

  //document.body.appendChild(table);
  document.getElementById(divID).appendChild(table);

  for (let i = 0; i < colDataArray.length; i++) {
    tr = document.createElement("tr");

    //for label
    td = document.createElement("td");
    td.innerHTML = labelArray[i];
    tr.appendChild(td);

    //for data
    td = document.createElement("td");
    td.innerHTML = colDataArray[i];
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
};

/* Utils */

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
function exponentialBackoff(max, delay, toTry, success, fail) {
  toTry().then(result => success(result))
  .catch(_ => {
    if (max === 0) {
      return fail();
    }
    time('Retrying in ' + delay + 's... (' + max + ' tries left)');
    setTimeout(function() {
      exponentialBackoff(--max, delay * 2, toTry, success, fail);
    }, delay * 1000);
  });
}

function time(text) {
  log('026. [' + new Date().toJSON().substr(11, 8) + '] ' + text);
}

function log() {
  if ( _.completed < 100) localStorage.setItem('completed_scale', _.completed++)

    if (process.env.REACT_APP_DEBUG) {
        console.log(...arguments);
    }
};
