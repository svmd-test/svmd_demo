import React ,  { useState, useEffect }  from 'react';
import { useSession } from '../firebase/UserProvider';
import { ExportJsonCsv } from 'react-export-json-csv';
import { useForm } from 'react-hook-form';
import { useParams } from "react-router-dom";
import { firestore } from "../firebase/config";
//import { getDoc } from "../firebase/config";

const roundDate = (timeStamp, interval) => {
    const xDay = 24 * 60 * 60 * 1000
    timeStamp -= timeStamp % (interval * xDay);//subtract amount of time since midnight
    //timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
    return new Date(timeStamp+xDay);
  }

//const today = Date.now();

const headers = [
    {
        key:  "id",
        name: "SmartViewMD Reading ID"
    },{
        key:  "pid",
        name: "SmartViewMD Patient ID"
    },{
        key:  "dateTimesubmitted",
        name: "Date Time submitted"
    },{
        key:  "reading",
        name: "Reading"
    },{
        key:  "readingType",
        name: "Reading Type"
    },{
        key:  "uniqDevice",
        name: "Device"
    },{
        key:  "dateSelected",
        name: "Date Selected"
    },{
        key:  "timeSelected",
        name: "Time Selected"
    },{
        key:  "doctor",
        name: "Doctor"
    },{
        key:  "note",
        name: "Note"
    }
]


const dataHeaders = [
   {  key: "uid"         ,  name:  "SmartViewMD Patient ID" },
   {  key: "name"        ,  name:  "Name"                   },
   {  key: "dob"         ,  name:  "DOB"                    },
   {  key: "doctor"      ,  name:  "Doctor"                 },
   {  key: "phone"       ,  name:  "Phone"                  },
   {  key: "email"       ,  name:  "Email"                  },
   {  key: "receiveEmail",  name:  "Receive Email"          },
   {  key: "address"     ,  name:  "Address"                },
   {  key: "city"        ,  name:  "City"                   },
   {  key: "state"       ,  name:  "State"                  },
   {  key: "zip"         ,  name:  "Zip"                    },
   {  key: "registered"  ,  name:  "Registered"             },
   {  key: "devices"     ,  name:  "Devices"                },
   {  key: "gender"      ,  name:  "Gender"                 },
   {  key: "height"      ,  name:  "Height"                 },
   {  key: "weight"      ,  name:  "Weight"                 },
]
const dataPatientReadingHeaders = [
  {  key: "pid"         ,  name:  "SmartViewMD Patient ID" },
  {  key: "name"        ,  name:  "Name"                   },
  {  key: "dob"         ,  name:  "DOB"                    },
  {  key: "doctor"      ,  name:  "Primary Doctor"         },
  {  key: "phone"       ,  name:  "Phone"                  },
  {  key: "email"       ,  name:  "Email"                  },
  {  key: "receiveEmail",  name:  "Receive Email"          },
  {  key: "address"     ,  name:  "Address"                },
  {  key: "city"        ,  name:  "City"                   },
  {  key: "state"       ,  name:  "State"                  },
  {  key: "zip"         ,  name:  "Zip"                    },
  {  key: "registered"  ,  name:  "Registered"             },
  {  key: "devices"     ,  name:  "Devices"                },
  {  key: "gender"      ,  name:  "Gender"                 },
  {  key: "height"      ,  name:  "Height"                 },
  {  key: "weight"      ,  name:  "Weight"                 },
  {  key: "id"                , name: "SmartViewMD Reading ID" },
  {  key: "Created"           ,  name:  "Reading Submitted"    },
  {  key: "Upper"             ,  name:  "BP Upper"             },
  {  key: "Lower"             ,  name:  "BP Lower"             },
  {  key: "Pulse"             ,  name:  "BP Pulse"             },
  {  key: "Glucose"           ,  name:  "Glucose"              },
  {  key: "Note"              ,  name:  "BP Note"              },
  {  key: "dateSelected"      ,  name:  "Date Selected"        },
  {  key: "timeSelected"      ,  name:  "Time Selected"        },
  {  key: "readingDoctor"     ,  name:  "Reading Doctor"       },
]
const ExportReadings = () => {

    let _userRef={}
    let _userData=[]
    let _userIDs=[]
    let _userReadings=[]
    let _UserDataMapped={}
    let _UserReadingMapped={}
    //let _userInfo=[]
    let x = {}
    let y = {}
    

    const pushPatientReadings =  ( patient, reading ) => {
      //const zpatient=await _userData[1]
      const xpatient= _UserDataMapped[patient]
      _userReadings.push({
        id: reading,
        pid: patient,
        ...xpatient,
        Created:  new Date(_UserReadingMapped[patient][reading]?.created).toLocaleString(),
        Note:  _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.note,
        Upper: _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.reading?.Upper,
        Lower: _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.reading?.Lower,
        Pulse: _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.reading?.Pulse,
        Glucose: _UserReadingMapped[patient][reading]?.devices?.bloodGlucoseMeter?.reading?.Glucose,
        dateSelected:  _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.date,
        timeSelected:  _UserReadingMapped[patient][reading]?.devices?.bloodPressureMonitor?.time,
        readingDoctor:  _UserReadingMapped[patient][reading]?.profile?.doctor,
      })
    }

    const getUser = async ( id ) => {
        const docRef = firestore.collection( "users").doc(id);
        try {

            docRef.get().then((doc) => {
                if (doc.exists) {
                    //console.log("Document data:", doc.data());
                    const data = doc.data()
                    const newData= { ...data, registered: data.created.toDate().toLocaleString() }
                    _userData.push( newData)
                    _UserDataMapped[id]=newData

                    Object.keys(_UserReadingMapped[id])
                      .forEach((reading) => {
                        pushPatientReadings(id,reading)
                    })

                    //console.log("_userData.push : ", _userData.length, _userData );

                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            
        
        } catch(error) {
            console.log(error)
        }
    }

    const { user } = useSession();
    const params = useParams();

    let register=''
    const today = Date.now();
    const interval = params.interval?params.interval:1
    let rowCounter=0

    const duration = params.duration?params.duration:32
    const lastMonth= today - duration * 24 * 60 * 60 * 1000;
    const date='MM/DD/YYYY'
    let _devices=[]

    const [startDate, setStartDate] = useState(new Date(lastMonth).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$1-$2"));
    const [endDate  , setEndDate  ] = useState(new Date(today).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'}).replace(/(\d+)\/(\d+)\/(\d+)/,"$3-$1-$2"));

    //let startDate= new Date(lastMonth).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'})
    //let endDate= new Date(today).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'})
// new Date(roundDate(reading.created,interval)).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'})
    const units = {
        continuousGlucoseMonitor: { Glucose: 'mg/DL' },
        bloodGlucoseMeter: { Glucose: 'mg/DL' },
        peakFlowMeter: { 'Peak Flow': 'I/min' },
        bloodPressureMonitor: {
            Upper: 'mm Hg (Systolic)',
            Lower: 'mm Hg (Diastolic)',
            Pulse: 'bpm (Pulse Rate)',
        },
        fingertipPulseOximeter: {
            SpO2: '% (Oxygen Saturation)',
            PR: 'bpm (Pulse Rate)',
            PI: '% (Perfusion Index)',
        },
        scale: { Weight: 'lbs' },
    };

    const [readings, setReadings] = useState([]);

    useEffect(() => {
        const offset = 300; //Timezone offset for EST in minutes.
        const sDate = Date.parse(startDate) + offset*60*1000
        const eDate = Date.parse(endDate)  + offset*60*1000 + (24*60*60*1000)
        console.log('sDate: ',sDate)
        const usersReadings = firestore
                                    .collectionGroup('readings')
                                    .where('created','>=',sDate)
                                    .where('created','<=',eDate)
                                   .orderBy('created','desc' )

        const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {

            const readings = querySnapshot.docs.map((doc) => doc); // .data()

            setReadings(readings);
        });
        return unsubscribe;
    }, [startDate,endDate,params.id]);

    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    };

    // const [userInfo, setUserInfo] = useState([]);

    // const getUserInfo =  ( idArray ) =>  {
    //   console.log ('idArray.len :', idArray.length ) 

    //   if ( idArray.length > 0 ) {

    //     const usersReadings = firestore
    //                               .collectionGroup('readings')
    //                               .where('uid','in',idArray)

    //     const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
    //       const users = querySnapshot.docs.map( (doc) => doc.data());

    //       users.forEach( async (user, index) => { 
    //         user.serial = index + 1; 

    //         //stash[user.gender] = ( stash[user.gender] || 0 ) + 1
    //         user.dateRegistered=user.created?user.created.toDate().toLocaleString():''  
    //         await _userInfo.push(user)
            
    //       });
    //       setUserInfo(users);
    //     });
    //     return unsubscribe;

    //   }

    // }

    return (
        <div className="add-form-container">
            <h4>Export All Patient Profiles & Readings</h4>
        {user.displayName}
            <table className="ui selectable celled table">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div className="field">
                                <input
                                    type="text"
                                    onFocus={(e) => {
                                        e.currentTarget.type = "date";
                                        e.currentTarget.focus();
                                    }}
                                    onChange={e => setStartDate(e.target.value)}
                                    placeholder={startDate}
                                    name={startDate}
                                />
                            </div>
                        </td>
                        <td>
                            <div className="field">
                                <input
                                    type="text"
                                    onFocus={(e) => {
                                        e.currentTarget.type = "date";
                                        e.currentTarget.focus();
                                    }}
                                    onChange={e => setEndDate(e.target.value)}
                                    placeholder={endDate}
                                    name={endDate}
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            {readings
                .map((reading) =>
                  Object.entries(reading.data().devices).map((device) => device[0])
                )
                .flat()
                .filter(distinct)
                .map((uniqDevice) => {

                    readings.map( async (readingRef) => {
                          // const user = userRef.forEach((user,i)=>{
                          //   user.get().then(u=>{
                    
                          //       console.log(`USER [${i}]: `,u.data().name)
                          //       //return u.data()
                            
                          //   })
                          // })
                          const reading=readingRef.data()
                          //console.log("LABELS ", labels);
                          //console.log("READING ", reading);
                          const readingCreated = new Date(reading.created).toLocaleString()
                          //console.log("readingCreated:",readingCreated)
                          const intervalCreated = new Date(roundDate(reading.created,interval)).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'})
                          //const userRef = reading.ref.parent.parent
                          //const user = {name:"x"} // = userRef.get().then(user => user)
                          const userRef = readingRef.ref.parent.parent;
                          const pid = readingRef.ref.parent.parent.id
                          if (_UserReadingMapped[pid]==null) {
                            _UserReadingMapped[pid]={}
                          }
                          _UserReadingMapped[pid][readingRef.id]=reading
                          if ( !( pid in _userRef ) ) {
                            _userRef[ pid]= 1
                            //console.log('pid: ', pid)
                          }
                        //   _userRef.push( { 
                        //       pid: readingRef.ref.parent.parent.id
                        //   } )
                        //   console.log('userRef: ',userRef)
                        //   userRef.get().then(  user=>{
                        //     const mname =  user.data().name

                        //     const muid =  user.data().uid
                        //     const gresults =  user.data()
                        //     if (user.exists) {
                        //         userRef.onSnapshot((doc) => {
                                    
                        //             console.log('User data:', ++rowCounter, mname , gresults);
                        //             // do stuff with the data

                        //             _userRef.push( {
                        //                 uid: muid,
                        //                 name: mname,
                        //                 doc: doc
                        //             })                                  
                        //         });
                        //     }

                        //   })

                          //getUser(userRef,`divID_${++rowCounter}`)
                          // const results = userRef.get().then(doc=> {
                          //   const user = doc.data()
                          //console.log("USER:",user)

                          // })

                          Object.entries(reading.devices)
                                .filter((device) => device[0] === uniqDevice)
                                .sort()
                                .map((device) => {

                                    Object.keys(units[device[0]])
                                              .map((i) => {

                                                _devices.push({
                                                    id: readingRef.id,
                                                    pid: userRef.id,
                                                    reading: reading,
                                                    dateSelected: device[1].date,
                                                    timeSelected: device[1].time,
                                                    dateTimesubmitted: readingCreated,
                                                    dateSubmitted: intervalCreated,
                                                    doctor: reading.profile.doctor,
                                                    readingType: i,
                                                    uniqDevice: uniqDevice,
                                                    reading: device[1].reading[i],
                                                    note: device[1].note?device[1].note:(reading?.createdBy?.name?`Entered by ${reading.createdBy.name}`:(reading?.createdBy?.email?`Entered by ${reading.createdBy.email}`:''))
                                                })
                                    })
                          })
                    }) 
                })
        }
        {/* <hr />
          <div className="fields">
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="bloodPressureMonitor"
                  ref={register}
                />
                Blood Pressure Monitor
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="bloodGlucoseMeter"
                  ref={register}
                />
                Blood Glucose Meter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="continuousGlucoseMonitor"
                  ref={register}
                />
                Continuous Glucose Monitor
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="peakFlowMeter"
                  ref={register}
                />
                Peak Flow Meter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="fingertipPulseOximeter"
                  ref={register}
                />
                Fingertip Pulse Oximeter
              </label>
            </div>
            <div className="three wide field">
              <label>
                <input
                  type="checkbox"
                  name="devices"
                  value="scale"
                  ref={register}
                />
                Scale
              </label>
            </div>
          </div>
          <hr /> */}
         <ExportJsonCsv className="ui submit tiny b blue button" headers={dataPatientReadingHeaders} items={_userReadings} fileTitle={`SmartViewMD_Patient_Readings_${startDate}_${endDate}`}>Export Patient Profiles & Device Readings [{startDate} ... {endDate}]</ExportJsonCsv>         
         <hr/>  
        <ExportJsonCsv className="ui submit tiny b blue button" headers={headers} items={_devices} fileTitle={`SmartViewMD_Readings_${startDate}_${endDate}`}>Export Device Readings [{startDate} ... {endDate}] </ExportJsonCsv> 

          {
              ( _userIDs.length==0) ? Object.keys(_userRef).map( (i) => _userIDs.push(i)?'':'' ) : []
          }

          {
            _userIDs.forEach((id) => {
              //console.log("for _userData processing id:", id) 
              getUser(id) 
            })
          }

          {/* <hr/> 
            <pre>_userData: {JSON.stringify( _userData ,null,2)}</pre>  */}
         <hr/> 
         <ExportJsonCsv className="ui submit tiny b blue button" headers={dataHeaders} items={_userData} fileTitle={`SmartViewMD_Patients_${startDate}_${endDate}`}>Export Patient Profiles [{startDate} ... {endDate}]</ExportJsonCsv> 

          {/* 
         <hr/> 
            <pre>_UserDataMapped: {JSON.stringify( _UserDataMapped ,null,2)}</pre> 
         <hr/> 
            <pre>_userReadings: {JSON.stringify( _userReadings,null,2) }</pre>           
          <hr/> 
            <pre>_UserReadingMapped: {JSON.stringify( _userReadings) }</pre>  
         <hr/> 
            <pre>_devices: {JSON.stringify( _devices ,null,2)}</pre>        
          <hr/> 
            <pre>USERS_IDs: {JSON.stringify( _userIDs ,null,2)}</pre> 
          <hr/> 
            <pre>_userData: {JSON.stringify( _userData ,null,2)}</pre> 

           ( _userIDs.length > 0 ) ?
           (

                    const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
          const users = querySnapshots.docs.map( (doc) => doc.data());

          users.forEach( async (user, index) => { 
            user.serial = index + 1; 

            //stash[user.gender] = ( stash[user.gender] || 0 ) + 1
            user.dateRegistered=user.created?user.created.toDate().toLocaleString():''  
            await _userInfo.push(user)
            
          });
          setUserInfo(users);
        });
             firestore
                .collectionGroup('readings')
                .where('uid','in',_userIDs)
                .onSnapshot((querySnapshot) => {
                  console.log ('internal Reading:', readings)
                      
                      const readings = querySnapshot.docs.map((doc) => doc); // .data()
                      setUserInfo(readings);
                })
            ) :'nada'
         */}

         {/*
         {
             _userInfo = ( _userIDs.length > 0 && _userInfo.length === 0 ) ? getUserInfo( _userIDs )  : []
         }
       
         <pre>_USERS_Info: {JSON.stringify( ( _userIDs.length > 0 ) ? getUserInfo( _userIDs )  : [] ,null,2)}</pre>  
         <hr/> 
         <pre>USERSinfo: {JSON.stringify( userInfo ,null,2)}</pre> 

        <hr/>
          <pre>DEVICES: {JSON.stringify(_devices ,null,2)}</pre> 

        {

                                    Object.keys(_userRef)
                                    .map((id) => { 
                                        //const gid =  getUser(id)
                       
                                        console.log("DataID: ", id, getUser(id))
                                        //return gid
                                    })
        }

        <hr/>
           <pre>DEVICES: {JSON.stringify(_userData ,null,2)}</pre>  
        */}

        </div>
    )
}

export default ExportReadings;
