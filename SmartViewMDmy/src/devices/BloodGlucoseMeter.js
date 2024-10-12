
import {
    addUserReading,
    setUserDeviceLastReading,
  } from "../firebase/user";
  
let _ = { 
    currentYear: new Date().getFullYear(),
    lastReading: 0,
    maxReading: 0,
    readings: [],
    deviceType: 'bloodGlucoseMeter'
}

// > Service: 00001808-0000-1000-8000-00805f9b34fb
// >> Characteristic: 00002a18-0000-1000-8000-00805f9b34fb [NOTIFY]          "Glucose Measurement"
// >> Characteristic: 00002a34-0000-1000-8000-00805f9b34fb [NOTIFY]          "Glucose Measurement Context"
// >> Characteristic: 00002a51-0000-1000-8000-00805f9b34fb [READ]            "Glucose Feature"
// >> Characteristic: 00002a52-0000-1000-8000-00805f9b34fb [WRITE, INDICATE] "Record Access Control Point"

export const onBloodGlucoseMeterDeviceButtonClick = (uid,deviceType,lastReading) => {
    //alert(lastReading)
    if (lastReading) {
        _.lastReading=lastReading
        _.maxReading=lastReading
    }
    _.deviceType=deviceType
    _.UserID = uid
    gatherReadings()
}

function gatherReadings() {
    //alert('incomplete')

    var glucoseMeasurementCharacteristic, racpCharacteristic, glucoseCharacteristic,glucoseContextCharacteristic;

    navigator.bluetooth.requestDevice({filters: [{services: ['glucose']}]})
    .then(device => device.gatt.connect())
    .then(server => server.getPrimaryService('glucose'))
    .then(service => {
        return Promise.all([
            service.getCharacteristic('glucose_measurement'),
            service.getCharacteristic('glucose_measurement_context'),
            service.getCharacteristic('record_access_control_point')
        ])
    })
    .then(characteristics => {

        [glucoseCharacteristic,glucoseContextCharacteristic,racpCharacteristic] = characteristics;

        console.log('0. glucoseCharacteristic',glucoseCharacteristic)
        console.log('1. glucoseContextCharacteristic',glucoseContextCharacteristic)
        console.log('2. racpCharacteristic',racpCharacteristic)

    })
    .then(_ => {
        console.log('3a. glucoseCharacteristic.startNotifications',_)

        return glucoseCharacteristic.startNotifications()
    })
    .then(_ => {
        console.log('3b. glucoseCharacteristic.addEventListener',_)
        return glucoseCharacteristic.addEventListener('characteristicvaluechanged', handleGlucose)
    })
    .then(_ => {
        console.log('4a. glucoseContextCharacteristic.startNotifications',_)

        return glucoseContextCharacteristic.startNotifications()
    })
    .then(_ => {
        console.log('4b. glucoseContextCharacteristic.addEventListener',_)
        return glucoseContextCharacteristic.addEventListener('characteristicvaluechanged', handleGlucoseContext)
    })
    .then(_ => {
        console.log('5. racpCharacteristic.startNotifications',_)
        return racpCharacteristic.startNotifications()
    })
    .then(_ => {
        console.log('6. racpCharacteristic.addEventListener',_)
        return racpCharacteristic.addEventListener('characteristicvaluechanged', handleRacp)
    })
    .then(_ => {
        console.log('7. racpCharacteristic.writeValue',_)
        //return null
        return racpCharacteristic.writeValue(new Uint8Array([1, 1]))
    })
    .catch(error => {
        console.log('8. requestDevice ERROR',error);
    });


}

function handleGlucose(event) {
    console.log('10. handleGlucose',event.target.value);
    if ( event.target.value.byteLength == 13 && event.target.value.getUint8(1) > _.lastReading ) {

        if ( event.target.value.getUint8(1) > _.maxReading ) {
            _.maxReading = event.target.value.getUint8(1)
        }
        let readingArray=[]
        for (let i = 0; i < 13; i++) {
            readingArray.push(event.target.value.getUint8(i))
        }
        addUserReading({
            uid: _.UserID,
            add: {
              devices: {
                bloodGlucoseMeter: {
                  time: `${event.target.value.getUint8(7)}:${event.target.value.getUint8(8)}`,
                  note: `True Metrix Air ᛒ`,
                  date: `${_.currentYear}-${event.target.value.getUint8(5)}-${event.target.value.getUint8(6)}`,
                  reading: {
                    Glucose: event.target.value.getUint8(10)
                  },
                  device: {
                    manufacturer: "Trividia Health",
                    model: "True Metrix Air ᛒ",
                    type: _.deviceType,
                    reading: readingArray
                  },
                },
              },
            },
        });
        
        let reading=`${event.target.value.getUint8(1)} ${_.currentYear}-${event.target.value.getUint8(5).toLocaleString('en-US',{minimumIntegerDigits: 2})}-${event.target.value.getUint8(6).toLocaleString('en-US',{minimumIntegerDigits: 2})} ${event.target.value.getUint8(7).toLocaleString('en-US',{minimumIntegerDigits: 2})}:${event.target.value.getUint8(8).toLocaleString('en-US',{minimumIntegerDigits: 2})} [${event.target.value.getUint8(10)}]`
        _.readings.push(reading)
        console.log('10a. handleGlucose dateTime:',reading);
    }

}

function handleGlucoseContext(event) {
    console.log('20. handleGlucoseContext',event.target.value);
}

function handleRacp(event) {
    setUserDeviceLastReading(_.UserID, _.deviceType,_.maxReading,_.maxReading-_.lastReading,_.readings)
    new Audio('/audio/ReadingAccepted.mp3').play()
    console.log('30. handleRacp',event.target.value);
}

