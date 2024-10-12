import { playAudio} from '../components/playAudio'

import {
    addUserReading,
    setUserDevicePW,
  } from "../firebase/user";

let _ = { 
    server: {},
    connectionCount:0
}
const __ = { 
  divID: "blueToothReadingsDiv",
  blueTooth: "ᛒluetooth"
};

export const processStandardDevice = (uid,deviceType,devicePW) => {
    //_.device = device
    _.deviceType = deviceType
    _.UserID = uid

    // console.log('00a. device.name',device.name)
    // _.deviceName = device.name
    // _.deviceId = device.id
    console.log('00b. devicePW', devicePW )

    localStorage.setItem('completed', 10)

    if ( ! devicePW || devicePW.length === 0 ) {
      gatherInfo()
    } else {
      gatherReadings()
    }
  }

  function gatherInfo() {

    const filter = { 
      //acceptAllDevices: true,
      filters: [
        {
          services: [  'blood_pressure' ]
        },
      ],
      optionalServices: [ 'device_information' ],
    }

    console.log('01a. gatherInfo', filter)

    localStorage.setItem('completed', 20)

    let manufacturer_name_string, model_number_string,firmware_revision_string,hardware_revision_string,software_revision_string,manufacturer_identifier,organizationally_unique_identifier;

    navigator.bluetooth.requestDevice( filter)
    .then(device => {
      log('01c. device',device);
      //_.device=device
      _.deviceName=device.name
      _.deviceId=device.id
      device.addEventListener('gattserverdisconnected', onDisconnectedPairing); 
      return device.gatt.connect() 
    })
    .then(server => {
      new Audio('/audio/BluetoothConnected.mp3').play()
      console.log('01b. server',server)
      log('01b1. server')

      return server.getPrimaryService('device_information')
    })
    .then(service => {
      log('Getting Device Information Characteristics...');
      return service.getCharacteristics();
    })
    .then(characteristics => {
      let queue = Promise.resolve();
      let decoder = new TextDecoder('utf-8');
      characteristics.forEach(characteristic => {
        switch (characteristic.uuid) {
  
          case '00002a29-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> Manufacturer Name String: ' + decoder.decode(value));
              manufacturer_name_string=decoder.decode(value)
            });
            break;
  
          case '00002a24-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> Model Number String: ' + decoder.decode(value));
              model_number_string=decoder.decode(value)
            });
            break;
  
          case '00002a26-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> Hardware Revision String: ' + decoder.decode(value));
              hardware_revision_string=decoder.decode(value)
            });
            break;
  
          case '00002a27-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> Firmware Revision String: ' + decoder.decode(value));
              firmware_revision_string=decoder.decode(value)
            });
            break;
  
          case '00002a28-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> Software Revision String: ' + decoder.decode(value));
              software_revision_string=decoder.decode(value)
            });
            break;
  
          case '00002a23-0000-1000-8000-00805f9b34fb':
            queue = queue.then(_ => characteristic.readValue()).then(value => {
              log('> System ID: ');

              manufacturer_identifier = 
                padHex(value.getUint8(4)) + padHex(value.getUint8(3)) +
                padHex(value.getUint8(2)) + padHex(value.getUint8(1)) +
                padHex(value.getUint8(0))

              log('  > Manufacturer Identifier: ' + manufacturer_identifier );

              organizationally_unique_identifier = 
                padHex(value.getUint8(7)) + padHex(value.getUint8(6)) +
                padHex(value.getUint8(5))

              log('  > Organizationally Unique Identifier: ' +
                organizationally_unique_identifier );
            });
            break;
  
          default: log('> Unknown Characteristic: ' + characteristic.uuid);
        }
      });
      return queue;
    })
    .then(()=>{
      setUserDevicePW(
          _.UserID,
          _.deviceType,
          _.deviceName,
          { 
            manufacturer_name_string : manufacturer_name_string , 
            model_number_string      : model_number_string      , 
            hardware_revision_string : hardware_revision_string ,
            firmware_revision_string : firmware_revision_string ,
            software_revision_string : software_revision_string ,
            manufacturer_identifier  : manufacturer_identifier  ,
            organizationally_unique_identifier : organizationally_unique_identifier ,
            id                       : _.deviceId 
          }
      )
      localStorage.setItem('completed', 80)
    })
    .catch(error => {
      log('5b0. Argh! ' + error);
    });

  }

  function gatherReadings() {

    const filter = { 
            // acceptAllDevices: true,

      filters: [
        {
          services: [ '00001810-0000-1000-8000-00805f9b34fb'] // blood_pressure
        },
      ],
      optionalServices: [ '0000180a-0000-1000-8000-00805f9b34fb' ],
    }

    log('01b. gatherReadings from device',filter)

    localStorage.setItem('completed', 15)

    navigator.bluetooth.requestDevice(filter)
    .then(device => {
      log('01c0. device',device);
      _.deviceName = device.name
      _.deviceId = device.id
      device.addEventListener('gattserverdisconnected', onDisconnectedReading); 
      return device.gatt.connect()
    })
    .then(server => {
      //new Audio('/audio/BluetoothConnected.mp3').play()
      log('02a. server',server);
      localStorage.setItem('completed', 20)
      return server.getPrimaryService('blood_pressure')
    })
    .then(service => {
      log('02b. service',service);
      localStorage.setItem('completed', 25)
      return service.getCharacteristic('blood_pressure_measurement');
    })
    .then( characteristic => {
      characteristic.addEventListener('characteristicvaluechanged',handleBloodPressure); // characteristicvaluechanged
   


      ///characteristic.addEventListener('characteristicvaluechanged',handleBloodPressure); // characteristicvaluechanged
      //characteristic.addEventListener('oncharacteristicvaluechanged',handleBloodPressure); // characteristicvaluechanged
     _.characteristics = characteristic
      return characteristic.startNotifications()
      .then( char=>{
        localStorage.setItem('completed', 31)

        log('02c. startNotifications() characteristic',char);
        _.characteristics.startNotifications()
        .then(char2=>{
          log('02c0. startNotifications() _.characteristics',char2);
          return _.characteristic.addEventListener('characteristicvaluechanged',handleBloodPressure);
        })
        .catch(error => {
          log('5b0. Argh! ' + error);
        });
        // char.getDescriptor('gatt.client_characteristic_configuration') // '00002902-0000-1000-8000-00805f9b34fb'
        // .then(descriptor => {

        //   let queue = Promise.resolve();

        //   localStorage.setItem('completed', 35)
        //   //let encoder = new TextEncoder('utf-8');
        //   queue = queue.then(_ => descriptor.readValue())
        //   .then(value => {
        //     let decoder = new TextDecoder('utf-8');
        //     log('> Characteristic User Description: ' , decoder.decode(value).length, `[${decoder.decode(value)}]`);
        //   })
        //   //descriptor.writeValue(encoder.encode(0x02))
        //   return queue // descriptor.readValue();
        // })
        // .then(value => {
        //   let decoder = new TextDecoder('utf-8');
        //   log('q> Characteristic User Description: ' , decoder.decode(value), decoder.decode(value).length, `[${decoder.decode(value)}]`);
        // })
        // .catch(error => {
        //   log('5b0. Argh! ' + error);
        // });

        //await char.startNotifications()

        
        // char.startNotifications().then(char2=> {
            
        //     char2.addEventListener('characteristicvaluechanged', handleBloodPressure);      
        //     characteristic.getDescriptor('gatt.client_characteristic_configuration') // '00002902-0000-1000-8000-00805f9b34fb'
        //     .then(descriptor => {
        //       log('02c1. Reading Descriptor...');
        //       return descriptor.readValue() // .then(()=>)  ; readValue() 
        //       //return descriptor.writeValue(new Uint8Array( [ 0x01 ] )) // ; readValue() 
        //     })
        //     .then(value => {
        //       let decoder = new TextDecoder('utf-8');
        //       log('02c2. > Client Characteristic Configuration: ' + decoder.decode(value)); // value )
        //     })
        //     .catch(error => {
        //       log('5b0. Argh! ' + error);
        //     });
        // })
        //char.addEventListener('characteristicvaluechanged', handleBloodPressure);
        //characteristic.addEventListener('characteristicvaluechanged', handleBloodPressure);
      });
    })
    // .then(characteristic => {
    //   characteristic.startNotifications().then(char=>{
    //     char.addEventListener('characteristicvaluechanged', handleBloodPressure);
    //     characteristic.addEventListener('characteristicvaluechanged', handleBloodPressure);
    //   });
    //   localStorage.setItem('completed', 36) 
      //characteristic.addEventListener('characteristicvaluechanged',handleBloodPressure); // characteristicvaluechanged
      //characteristic.addEventListener('oncharacteristicvaluechanged',handleBloodPressure); // characteristicvaluechanged
      //characteristic.addEventListener('onCharacteristicChanged',handleBloodPressure); // characteristicvaluechanged
      //log('02d. writeValue() characteristic',characteristic);
      //return 
      // https://gist.github.com/sam016/4abe921b5a9ee27f67b3686910293026
      // return characteristic.getDescriptor('gatt.characteristic_user_description')
      //return characteristic.writeValue(new Uint8Array( [ 0x22 ] ))
      // https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html
    //})
    //.then((response) => {
    //  log('02g. writeValue() response ?? ',response);
    // })
    .then((response) => {
     log('02g. completed 2nd responses !! ',response);
    })
    .catch(error => {
      log('5b1. Argh! ' + error);
    });
  }

  // function gatherReadings00(device) {
  //   exponentialBackoff(3 /* max retries */, 2 /* seconds delay */,
  //     async function toTry() {
  //       time(`002. Connecting to Bluetooth Device... ${_.connectionCount++}`);
  //       const serverConnected = await device.gatt.connect();
  //       log(`002a. Connected to Bluetooth Device... ${_.connectionCount}`,device);
  //       return serverConnected
  //     },
  //     function success(server) {
  //       log(`003. > Bluetooth Device (re)connected. ${_.connectionCount}`,server );
  //       log('004. Getting Data',device.name )
  //       getBloodPressureReadings(server)
  //     },
  //     function fail() {
  //       time('010. Failed to reconnect.');
  //     });
  // }
  
  // async function getBloodPressureReadings(server) {
  //   log('01b. gatherReadings',server)

  //   let bloodPressureMeasurementCharacteristic 

  //   try {

  //     log('01c1. Getting Service...')
  //     const service = await server.getPrimaryService('blood_pressure')

  //     log('01d. Getting Characteristic...')
  //     bloodPressureMeasurementCharacteristic = await service.getCharacteristic('blood_pressure_measurement')

  //     await bloodPressureMeasurementCharacteristic.startNotifications()
  //     alert('you')

  //     bloodPressureMeasurementCharacteristic.addEventListener('characteristicvaluechanged', function(event) {
  //       alert('yo')
  //       handleBloodPressure(event)
  //     })
  //     //await bloodPressureMeasurementCharacteristic.readValue()
  //     alert('there')

  //     log('01e. > Notifications started',bloodPressureMeasurementCharacteristic);


  //   } catch(error) {
  //       log('5a. Argh! ',error);
  //   }
  
  // }

      //alert('READ data')

      // return Promise.all([
      //       service.getCharacteristic('blood_pressure_measurement'),
      //       service.getCharacteristic('blood_pressure_feature'    )
      //   ])
    //})//, bloodPressureFeatureCharacteristic;
    // .then((characteristics) => {
    //   _.characteristics=characteristics
    //   delayPromise(10) 
    //  })
    // .then(characteristics => {

    //     [bloodPressureMeasurementCharacteristic,bloodPressureFeatureCharacteristic] = characteristics;

    //     console.log('02. bloodPressureMeasurementCharacteristic',bloodPressureMeasurementCharacteristic)

    // })  
    //.then(bloodPressureMeasurementCharacteristic => bloodPressureMeasurementCharacteristic.startNotifications())
    //{
        //console.log('3a. bloodPressureMeasurementCharacteristic.startNotifications',bloodPressureMeasurementCharacteristic)

        //return bloodPressureMeasurementCharacteristic.startNotifications(_.deviceId,'blood_pressure','blood_pressure_measurement')) // 
        //return 
    //})
    //.then(bloodPressureMeasurementCharacteristic =>)
    //{
        //console.log('3b. bloodPressureMeasurementCharacteristic.addEventListener',bloodPressureMeasurementCharacteristic)
        //return 
    //})
    // .then(_n => {
    //   console.log('4a. bloodPressureFeatureCharacteristic.readValue()',_n)

    //   return bloodPressureFeatureCharacteristic.readValue()
    // })
    // .then(_n => {
    //   console.log('4b. bloodPressureFeatureCharacteristic.readValue()',_n)
    //   //handleBloodPressure()
    //   return bloodPressureFeatureCharacteristic.readValue()
    // })
    // .then(() => {
    //   delayPromise(20) 
    //  })
    // .then(_n => {
    //   console.log('5a. bloodPressureMeasurementCharacteristic.stopNotifications',_n)

    //   return bloodPressureMeasurementCharacteristic.stopNotifications() // _.deviceId,'blood_pressure','blood_pressure_measurement'
    // })
    // .then(_n => {
    //     console.log('5b. bloodPressureMeasurementCharacteristic.removeEventListener',_n)
    //     return bloodPressureMeasurementCharacteristic.removeEventListener('characteristicvaluechanged', handleBloodPressure)
    // })



function delayPromise(delay) {
  return new Promise(resolve => {
      setTimeout(resolve, delay);
  });
}

const labelsArray = [
  "Systolic",
  "Diastolic",
  "Heart Rate",
  "Date Time",
];
let index = 0

function handleBloodPressure(event) {
    console.log('10. handleBloodPressure',event?.target.value);
    if ( event?.target.value.byteLength === 19 ) {

        let readingArray=[]
        for (let i = 0; i < event.target.value.byteLength; i++) {
            readingArray.push(event.target.value.getUint8(i))
        }
        const readingDateTime = new Date( Date.now());
        const element = [
          event.target.value.getUint8(1), // systolicBP
          event.target.value.getUint8(3), // diastolicBP
          event.target.value.getUint8(14), // heartRate
          readingDateTime.toLocaleString()
        ]
        createTable(labelsArray, element, `table${index++}`);

        addUserReading({
            uid: _.UserID,
            add: {
              devices: {
                bloodPressureMonitor: {

                  time: readingDateTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                  date: readingDateTime
                    .toLocaleDateString()
                    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"),
                  note: `Bluetooth Standard ᛒ`,
                  reading: {
                    Upper: event.target.value.getUint8(1), // systolicBP
                    Lower: event.target.value.getUint8(3), // diastolicBP
                    Pulse: event.target.value.getUint8(14), // heartRate
                    //"MABP" :  ... 
                  },
                  device: {
                    manufacturer: "Standard",
                    model: "Bluetooth ᛒ",
                    name: _.deviceName,
                    id: _.deviceId,
                    type: _.deviceType,
                    reading: readingArray
                  },
                },
              },
            },
        });
        localStorage.setItem('completed', 100)
    }

}

const createTable = (labelArray, colDataArray, tableClassName) => {
  if (document.getElementById(__.divID).innerHTML === __.blueTooth) {
    document.getElementById(__.divID).innerHTML = "";
    localStorage.setItem('completed', 50 + localStorage.getItem('completed') / 2 )
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
  document.getElementById(__.divID).appendChild(table);

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

function onDisconnectedPairing (){
  localStorage.setItem('completed', 100 )  
  playAudio('/audio/DevicePaired.mp3')
  .then(()=>{
    alert("Completed Bluetooth Device Pairing!");
    //window.location.reload(false)
  })

} 

function onDisconnectedReading (){

  if ( document.getElementById(__.divID).innerHTML === __.blueTooth ) {
    playAudio('/audio/TryAgain.mp3')
    .then(()=>{
      alert(`Could not capture ${__.blueTooth} readings! Please try [Read] again.`);
      //window.location.reload(false)
    })
  } else {
    localStorage.setItem('completed', 100 )  
  }
} 

/* Utils */

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
// function exponentialBackoff(max, delay, toTry, success, fail) {
//   toTry().then(result => success(result))
//   .catch(_ => {
//     if (max === 0) {
//       return fail();
//     }
//     time('Retrying in ' + delay + 's... (' + max + ' tries left)');
//     setTimeout(function() {
//       exponentialBackoff(--max, delay * 2, toTry, success, fail);
//     }, delay * 1000);
//   });
// }


function padHex(value) {
  return ('00' + value.toString(16).toUpperCase()).slice(-2);
}


// function time(text) {
//   log('026. [' + new Date().toJSON().substr(11, 8) + '] ' + text);
// }

function log() {
  if ( _.completed < 100) localStorage.setItem('completed', _.completed++)

    if (process.env.REACT_APP_DEBUG) {
        console.log(...arguments);
    }
};
