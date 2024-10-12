import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import { Line } from "react-chartjs-2";
import Collapsible from "../components/Collapsible"
import {siteCode,siteLogoSmall} from "../components/Doctors"
import Users from "./Users";

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

function roundDate(timeStamp, interval){
  const xDay = 24 * 60 * 60 * 1000
  timeStamp -= timeStamp % (interval * xDay);//subtract amount of time since midnight
  //timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
  return new Date(timeStamp+xDay);
}

function Report(props) {



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
  };

  // const [readings, setReadings] = useState([]);
  // const [users, setUsers] = useState([]);

  const params = useParams();

  //const debug = false ; 
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  let t={}
  let stash={}
  let rowCounter=0
  const fill = [true, false, false, false, false];
  const backgroundColor = ["rgba(75,192,192,0.2)", null, null, null, null];
  const borderColor = ["rgba(75,192,192,1)", "#742774", "red", "blue", "green"];
  const interval = params.interval?params.interval:1
  const duration = params.duration?params.duration:7
  const today = Date.now();
  const lastWeek= today - duration * 24 * 60 * 60 * 1000;
  const compare = (a, b) => {
    // Use toUpperCase() to ignore character casing
    //console.log("a: ", a.dt);
    //console.log("b: ", b.dt);
    const bandA = a.dt;
    const bandB = b.dt;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };
  let i = 0;
  let labels = [];
  let _devices = [];
  let __devices = {};
  let data = {};
  let _reading = ''
  let mergedReadings = []

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [readings, setReadings] = useState({});
  const [error, setError] = useState();

  async function selectUser(user) {
    //setSelectedUser(user);
    if (user.uid) {
      const readingsRef = firestore.collection('users').doc(user.uid).collection('readings').orderBy('created','asc' )
      const readings =  await readingsRef.get()

      if (!readings.empty){
        const allReadings = readings.docs.map(doc=>doc.data())
        console.log('READINGS',allReadings)
        return allReadings
        //setReadings(allReadings);
      }
      
    } 

  }

  async function fetchReadings(user) {
    //setSelectedUser(user);
    if (user.uid) {
      let fetchedReadingArray=[]
       await firestore
        .collection('users')
        .doc(user.uid)
        .collection('readings')
        .orderBy('created','asc' )
        .get()
        .then((readings)=>{
          readings.docs.forEach(reading => {
            const fetchedReading = {
              id: reading.id,
              ...reading.data(),
              user: user
            };
            fetchedReadingArray.push(fetchedReading);
          })
        })
      //console.log('fetchedReadingArray',fetchedReadingArray)
      return fetchedReadingArray
      //setReadings(allReadings);
    } 


  }


  useEffect(() => {
    let allReadings = []
    let j=0
    const usersRef = firestore.collection('users').where('doctor', '!=', '')
    const unsubscribe = usersRef.onSnapshot(async (querySnapshot) => {
      const readings = await querySnapshot.docs.map( async (user) => {
        const fetchedReadings = await fetchReadings(user.data())
        // if (readings.length>0)allReadings.push(...readings)
        //console.log('fetchedReadings',fetchedReadings)

        // return {...user.data(),readings: readings }
        //console.log('User:',user.data()) 

        return fetchedReadings
      })

      //console.log('USERS',users)
      // let allReadings = {}
      // users.forEach((user,i)=>{
      //   //console.log(i,user)
      //   allReadings[user.uid]=selectUser(user) 
      // })
      console.log('Final Readings0',readings)
      // readings.forEach( async i=>{
      //   //console.log('i',await i)
      //   const ii = await i
      //   ii.forEach(j=>{
      //     //console.log('j',j)
      //     mergedReadings.push(j)
      //   })
      // })
      //console.log(mergedReadings)
      //.\Array.prototype.concat(...readings)
      ///Array.prototype.concat.apply([], ...readings)
      //readings.reduce(function(a,b){ return a.concat(b) }, [])
      //.reduce(function(arr, e) {return arr.concat(e);})
      //.map(function(v) {return v[0];})
      //[...new Set([].concat(...readings.map((o) => o.myPropArray)))]
      //readings.reduce(function(a,b){ return a.concat(b) }, [])


      
      //const flatReads = readings.reduce(async function(a,b){ return a.concat(await b) }, [])

      const flatReads = []

      setTimeout(() => {  
        readings.forEach( async reading=>{
            const awaitReading = await reading
            return awaitReading.forEach(async(j)=> {
                const subRead = await j
                flatReads.push(subRead) 
            })
        })
    }, 2000);


    function awaitReading () {
      
    
      if (flatReads.length) {
        console.log('Final Readings',flatReads)
        setReadings(flatReads)
      } else {
        setTimeout(awaitReading, 3000); // try again in 3 seconds
      }
    }
    
    awaitReading();

      
      //const mergedReadings = flatReads.flat()


      
      //setUsers(users);

    });

    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   firestore.collection('users').where('doctor', '!=', '').get()
  //     .then(response => {
  //       const fetchedUsers = [];
  //       response.docs.forEach(document => {
  //         const fetchedUser = {
  //           id: document.id,
  //           ...document.data()
  //         };
  //         fetchedUsers.push(fetchedUser);
  //       });
  //       console.log(fetchedUsers)
  //       setUsers(fetchedUsers);
  //     })
  //     .catch(error => {
  //       setError(error);
  //     });
  // }, []);


  // const timestampToString = (timestamp) => {
  //   return Date(timestamp).toString();
  // }
  
  // function fetchReadings00(user) {
  //   if (user.uid) {
  //     //let storeReadings = []
  //     const readingsResponse=firestore
  //                             .collection("users")
  //                             .doc(user.uid)
  //                             .collection("readings")
  //                             .orderBy('created','asc' );
  //     const unsubscribe = readingsResponse.onSnapshot((querySnapshot)=>{
  //       const users =  querySnapshot.docs.map((reading) => {
  //         return {...reading,name: user.name}
  //       })
  //       //setReadings([...readings,users]);

  //             //setReadings([...readings,{...reading.data(),name: user.name}])
  //     })
  //     //console.log(getReadings)
  //     return unsubscribe
  //   }
  // }

  // function fetchReadings(user) {
  //   if (user.uid) {
  //     let saveUserReadings = []
  //     firestore
  //       .collection("users")
  //       .doc(user.uid)
  //       .collection("readings")
  //       .orderBy('created','asc' )
  //       .get()
  //       .then(userReadings => {
  //         userReadings.docs.forEach(doc => {
  //           const userReading = {id: doc.id, ...doc.data()}
  //           saveUserReadings.push(userReading)
  //         })
  //       })
  //       .then(()=>{
  //         setUsers(saveUserReadings)
  //       })
  //       return saveUserReadings
  //   }
  // }

  // useEffect(() => {
  //   const usersReadings=firestore
  //                         .collection("users")
  //                         .where('doctor', '!=', '')
  //   let savedReadings = []
  //   const unsubscribe = usersReadings.onSnapshot( (querySnapshot) => {

  //     const xreadings =  querySnapshot.docs.map((user) => {
  //       //console.log(user.data())
  //       return fetchReadings(user.data())


  //     }); // .data()
  //     //console.log(readings)
      
  //     savedReadings.push(xreadings)
  //     //setReadings(savedReadings);
  //   })
  //   // let allReadings = []
  //   // savedReadings.forEach(doc=> {
  //   //   doc.forEach(item=>{
  //   //     console.log(item)
  //   //     //allReadings.push(item)
  //   //   })
  //   // })
  //    console.log(savedReadings)
  //    return unsubscribe
  //   }, [])

  // const [readings, setGlossaryTerms] = useState([])
  // const [readingsx, setRelatedGlossaryTerms] = useState([])

  // useEffect000(() => {
  //   // get the glossary collection
  //   let tempGlossaryTerms = []
  //   let tempRelatedGlossaryTerms = []
  //   firestore
  //   .collection("users")
  //   .where('doctor', '!=', '').get().then(glossaries => {

  //     glossaries.forEach(doc => {
  //       const glossary = {id: doc.id, ...doc.data(), name: doc.data().name}
  //       //tempGlossaryTerms.push(glossary)

  //       // for each glossary get the related term
  //       firestore
  //         .collection("users")
  //         .doc(glossary.id)
  //         .collection('readings')
  //         .orderBy('created','asc' )
  //         .get().then(relatedTerms => {
  //           relatedTerms.docs.forEach(doc => {
  //             const relatedTerm = {id: doc.id, ...doc.data(), name: glossary.name}
  //             tempRelatedGlossaryTerms.push(relatedTerm)
  //             tempGlossaryTerms.push(relatedTerm)
  //           })
  //           setRelatedGlossaryTerms(tempRelatedGlossaryTerms)
  //           //setGlossaryTerms(tempGlossaryTerms)
  //         })

  //     })
  //   })
  //   setGlossaryTerms(tempGlossaryTerms)
  // }, [])



  const camel2title = (camelCase) =>
    camelCase
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());

  return (
    
    <div>
      <SideMenu id={params.id} report />
      <Table className="ui selectable celled table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="th">
              <h2>
                <img src={siteLogoSmall} alt={siteCode} height="40" /> 
                Custom Reports & Charts {params.name?`(${params.name})`:''}
              </h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell key="td">
              {console.log('mergedReadings',mergedReadings.length)?'':''}
              {
                (
                   readings.length>0 ?
                    (['bloodPressureMonitor']
                            .map((uniqDevice) => {
                              stash={}
                              labels.splice(0, labels.length);
                              return (
                                <p>
                                  <Collapsible title={`Click to hide/reveal Data for ${camel2title(uniqDevice)} chart (interval: ${interval}d, duraion: ${duration}d)`}>
                                  <div>
                                  <Table
                                    unstackable
                                    compact
                                    striped
                                    className="ui selectable celled table"
                                    key={uniqDevice}
                                  >
                                    <Table.Header>
                                      <Table.Row>
                                        <Table.HeaderCell>Submitted</Table.HeaderCell>
                                        <Table.HeaderCell>{interval} Day(s)</Table.HeaderCell>
                                        <Table.HeaderCell>Device</Table.HeaderCell>
                                        <Table.HeaderCell>Reading [Avg/interval]</Table.HeaderCell>
                                        <Table.HeaderCell>Date Time</Table.HeaderCell>
                                        <Table.HeaderCell>Note</Table.HeaderCell>
                                        <Table.HeaderCell>Patient</Table.HeaderCell>
                                        <Table.HeaderCell>Doctor</Table.HeaderCell>
                                      </Table.Row>
                                    </Table.Header>
                                    {readings.map( (readingRef) => {
                                        // const user = userRef.forEach((user,i)=>{
                                      //   user.get().then(u=>{
                                
                                      //       console.log(`USER [${i}]: `,u.data().name)
                                      //       //return u.data()
                                        
                                      //   })
                                      // })
                                      const reading=readingRef
                                      //console.log("LABELS ", labels);
                                      //console.log("READING ", reading);
                                      const readingCreated = new Date(reading.created).toLocaleString()
                                      //console.log("readingCreated:",readingCreated)
                                      const intervalCreated = new Date(roundDate(reading.created,interval)).toLocaleDateString('en-US',{year:  'numeric',month: '2-digit',day: '2-digit'})
                                      //const userRef = reading.ref.parent.parent
                                      //const user = {name:"x"} // = userRef.get().then(user => user)
                                      //const userRef = readingRef.ref.parent.parent;
                                      //getUser(userRef,`divID_${++rowCounter}`)
                                      // const results = userRef.get().then(doc=> {
                                      //   const user = doc.data()
                                      //console.log("USER:",user)
                      
                                      // })
                                      
                                      return (
                                        <Table.Body key={reading.created}>
                                          {Object.entries(reading.devices)
                                            .filter((device) => device[0] === uniqDevice)
                                            .sort()
                                            .map((device) => {
                                              //console.log("DEVICE ", device);
                                              _devices = [];
                      
                                              if (reading.profile.doctor&&Object.values(device[1].reading).join('')!=="")
                                              {
                                                  return (
                                                    <Table.Row key={device[0]}>
                                                      <Table.Cell>
                                                      {readingCreated}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {intervalCreated}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {camel2title(device[0])}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {Object.keys(units[device[0]])
                                                          .map((i) => {
                                                            //if (i==0) t=0
                                                              const k = i + intervalCreated
                                                              if (t[k]==null) {
                                                                t[k]={}
                                                                t[k]['total']=0
                                                                t[k]['count']=0
                                                                t[k]['avg']=0 
                                                                
                                                              }
                                                              if (device[1].reading[i]) {
                                                                t[k]['total']=t[k]['total']+parseInt(device[1].reading[i])
                                                                t[k]['avg']=t[k]['total']/++t[k]['count']
                                                                _reading = device[1].reading[i]
                                                              } else {
                                                                _reading ='NR'
                                                              }
                                                              _devices.push({
                                                                r: _reading,
                                                                l: i,
                                                                a: t[k]['avg'],
                                                              })
                                                            return [
                                                                i,
                                                                `${_reading} [${parseInt(t[k]['avg'])}] ${t[k]['count']}`, // t:${t[k]['total']} c:${t[k]['count']} a:
                                                              ].join("=");
                      
                                                          })
                                                          .join(" ; ")
                                                        }
                                                        {                                         
                                                        }
                                                        {/*stash[`a${intervalCreated}`]={}*/}
                                                        {(stash[intervalCreated]=_devices)?'':''}
                                                        {/*labels.push({
                                                          dt: intervalCreated , // readingCreated (device[1].date && device[1].time) ? `${device[1].date} ${device[1].time}` : new Date(reading.created).toLocaleString(),
                                                          d: _devices,
                                                        })
                                                          ? ""
                                                      : ""*/}
                                                      </Table.Cell>
                                                      <Table.Cell>
                                                        {device[1]?.date} {device[1]?.time}
                                                      </Table.Cell>
                                                      <Table.Cell>{device[1]?.note}</Table.Cell>
                                                      <Table.Cell>{reading.user.name}</Table.Cell>
                                                      <Table.Cell>
                                                        {typeof reading.profile !== "undefined"
                                                          ? reading.profile.doctor
                                                          : ""}
                                                      </Table.Cell>
                                                    </Table.Row>
                                                  );
                                                
                                              }
                      
                                            })}
                                        </Table.Body>
                                      );
                                      
                                    })}
                                  </Table>
                                  </div>
                                  </Collapsible>
                                  <pre>{/*JSON.stringify(stash,null,2)*/}</pre>
                                  {Object.entries(stash).map((entry)=>{
                                    //console.log(entry)
                                    labels.push({
                                      dt: entry[0],
                                      d: entry[1]
                                    })
                                  })
                                  }
                                  <pre>{/*JSON.stringify(labels,null,2)*/}</pre>
                            {/* 
                                  <h2>{camel2title(uniqDevice)} (Readings)</h2>
                            */}      
                                  {(__devices = {}) ? "" : "Err"}
                                  {(data = {
                                      labels: labels.sort(compare).map((i, j) => {
                                        if (j === 0) i.d.map((k) => (__devices[k.l] = []));
                                        i.d.map((k) => __devices[k.l].push(k.r));
                                        return i.dt;
                                      }),
                                    datasets: labels[0]?.d.map((k, l) => ({
                                      label: k.l,
                                      data: __devices[k.l],
                                      fill: fill[l],
                                      backgroundColor: backgroundColor[l],
                                      borderColor: borderColor[l],
                                    })),
                                  })
                                    ? ""
                                    : "Err2"}
                            {/**/}
                                  {/*JSON.stringify(data)*/}
                            {/* 
                                  <Line data={data} />
                                  <br/><br/>
                            */}
                                  {(data = {
                                    labels: labels.sort(compare).map((i, j) => {
                                      if (j === 0) i.d.map((k) => (__devices[k.l] = []));
                                      i.d.map((k) => __devices[k.l].push(k.a));
                                      return i.dt;
                                    }),
                                  datasets: labels[0]?.d.map((k, l) => ({
                                    label: k.l,
                                    data: __devices[k.l],
                                    fill: fill[l],
                                    backgroundColor: backgroundColor[l],
                                    borderColor: borderColor[l],
                                  })),
                                })
                                  ? ""
                                  : "Err2"}
                                  <h2>{camel2title(uniqDevice)} [Averages per {interval}d interval]</h2>
                                  {(labels.length>0)?(<div>
                                  <Line data={data} />
                                  </div>):'None for this time frame'}
                            
                            {/**/}
                                </p>
                      
                              );
                            })
                      
                    ) : `${i} NONE.`  
                )
              }
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default Report;
