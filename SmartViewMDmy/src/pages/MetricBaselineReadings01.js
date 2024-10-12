import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import { Line } from "react-chartjs-2";
import Collapsible from "../components/Collapsible"
import {siteCode,siteLogoSmall} from "../components/Doctors"

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

function roundDate(timeStamp, interval){
  const xDay = 24 * 60 * 60 * 1000
  timeStamp -= timeStamp % (interval * xDay);//subtract amount of time since midnight
  //timeStamp += new Date().getTimezoneOffset() * 60 * 1000;//add on the timezone offset
  return new Date(timeStamp+xDay);
}

let _Readings = {}
function getUser(userReference,divID,nameID) {
  // [START get_document]
  // [START firestore_data_get_as_map]

  const results = userReference.get().then( user=>{
        //const name = user.data().name
        //console.log('User data:',divID, name );
        if (document.getElementById(divID))
          document.getElementById(divID).innerHTML = `<a  href="/patient/${user.data().uid}">${user.data().name}</a>`
          /* user.data().name */
        _Readings[nameID]=user.data().name
  })
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

  const [readings, setReadings] = useState([]);

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

  let labels = [];
  let _devices = [];
  let __devices = {};
  let data = {};
  let _reading = ''

  useEffect(() => {
    const usersReadings = firestore
      .collectionGroup('readings')
      .where('created','>',lastWeek)
      .orderBy('created','desc' )
    const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
      //const userRef = querySnapshot.docs.map((doc) => doc.ref.parent.parent);
      // const user = userRef.forEach((user,i)=>{
      //   user.get().then(u=>{

      //       //console.log(`USER [${i}]: `,u.data().name)
      //       return u.data()
        
      //   })
      // })
      // const user = userRef.get().then(user=>{
      // })
      const readings = querySnapshot.docs.map((doc) => {
        //return doc  ,name:doc.ref.parent.parent.get()
        return doc
      }); // .data()
      //console.log("READINGS ",readings.devices)
      //const xreadings = readings.where('devices.continuousGlucoseMonitor.reading.Glucose','>','1' )

      setReadings(readings);
    });
    return unsubscribe;
  }, [params.id]);

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
              {readings
                .map((reading) =>
                  Object.entries(reading.data().devices).map((device) => device[0])
                )
                .flat()
                .filter(distinct)
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
                        {readings.map(  (readingRef) => {
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
                          //const userRef = readingRef.ref.parent.parent
                          //const user =  userRef.get()
                          //console.log("USER:",user.data())
                          const userRef = readingRef.ref.parent.parent;
                          getUser(userRef,`divID_${++rowCounter}`,`nameID_${rowCounter}`)
                          //const table = userRef.get().then(doc=> {
                            //const user = doc.data()
                            //console.log("USER:",user)
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
                                              {(_Readings[`readingID_${device[0]}_${rowCounter}`]={
                                                  readingCreated:readingCreated,
                                                  intervalCreated: intervalCreated
                                                })?'':''}
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
                                            <Table.Cell>{reading.name}<div id={`divID_${rowCounter}`}></div></Table.Cell>
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
                          //})

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
                      {JSON.stringify(_Readings,null,2)}
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
                })}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default Report;
