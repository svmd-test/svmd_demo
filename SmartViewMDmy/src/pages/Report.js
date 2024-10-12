import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import { useParams } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import { Line } from "react-chartjs-2";
import {siteCode,siteLogoSmall} from "../components/Doctors"

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

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
    scale: { Weight: 'lbs' },
  };

  const [readings, setReadings] = useState([]);

  const params = useParams();

  //const debug = false ; 
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  let t={}
  
  const fill = [true, false, false, false, false];
  const backgroundColor = ["rgba(75,192,192,0.2)", null, null, null, null];
  const borderColor = ["rgba(75,192,192,1)", "#742774", "red", "blue", "green"];
  
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
      .collection("users")
      .doc(params.id)
      .collection("readings")
      .orderBy("created", "asc");
    const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
      const readings = querySnapshot.docs.map((doc) => doc.data());
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
                Reports & Charts {params.name?`(${params.name})`:''}
              </h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell key="td">
              {readings
                .map((reading) =>
                  Object.entries(reading.devices).map((device) => device[0])
                )
                .flat()
                .filter(distinct)
                .map((uniqDevice) => {
                  labels.splice(0, labels.length);
                  return (
                    <p>
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
                            <Table.HeaderCell>Device</Table.HeaderCell>
                            <Table.HeaderCell>Reading [Running Avgs]</Table.HeaderCell>
                            <Table.HeaderCell>Date Time</Table.HeaderCell>
                            <Table.HeaderCell>Note</Table.HeaderCell>
                            <Table.HeaderCell>Doctor</Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        {readings.map((reading) => {
                          //console.log("LABELS ", labels);
                          //console.log("READING ", reading);
                          const readingCreated = new Date(reading.created).toLocaleString()
                          return (
                            <Table.Body key={reading.created}>
                              {Object.entries(reading.devices)
                                .filter((device) => device[0] === uniqDevice)
                                .sort()
                                .map((device) => {
                                  //console.log("DEVICE ", device);
                                  _devices = [];
                                  if (Object.values(device[1].reading).join('')!=="")
                                  return (
                                    <Table.Row key={device[0]}>
                                      <Table.Cell>
                                        {readingCreated}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {camel2title(device[0])}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {Object.keys(units[device[0]])
                                          .map((k,i) => {
                                            //if (i==0) t=0
                                              if (t[k]==null) {
                                                t[k]={}
                                                t[k]['total']=0
                                                t[k]['count']=0
                                                t[k]['avg']=0
                                              }
                                              if (device[1].reading[k]) {
                                                t[k]['total']=t[k]['total']+parseInt(device[1].reading[k])
                                                t[k]['avg']=t[k]['total']/++t[k]['count']
                                                _reading = device[1].reading[k]
                                              } else {
                                                _reading ='NR'
                                              }
                                              _devices.push({
                                                  r: _reading,
                                                  l: k,
                                                  a: t[k]['avg'],
                                                });
                                            return [
                                                k,
                                                `${_reading} [${parseInt(t[k]['avg'])}] `, // t:${t[k]['total']} c:${t[k]['count']} a:
                                              ].join("=");

                                          })
                                          .join(" ; ")
                                        }
                                        {labels.push({
                                          dt: readingCreated, // (device[1].date && device[1].time) ? `${device[1].date} ${device[1].time}` : new Date(reading.created).toLocaleString(),
                                          d: _devices,
                                        })
                                          ? ""
                                          : ""}
                                      </Table.Cell>
                                      <Table.Cell>
                                        {device[1]?.date} {device[1]?.time}
                                      </Table.Cell>
                                      <Table.Cell>{device[1]?.note}</Table.Cell>
                                      <Table.Cell>
                                        {typeof reading.profile !== "undefined"
                                          ? reading.profile.doctor
                                          : ""}
                                      </Table.Cell>
                                    </Table.Row>
                                  );
                                })}
                            </Table.Body>
                          );
                        })}
                      </Table>
                      <pre>{/*JSON.stringify(labels,null,2)*/}</pre>
                      <h2>{camel2title(uniqDevice)} (Readings)</h2>
                      {(__devices = {}) ? "" : "Err"}
                      {(data = {
                          labels: labels.sort(compare).map((i, j) => {
                            if (j === 0) i.d.map((k) => (__devices[k.l] = []));
                            i.d.map((k) => __devices[k.l].push(k.r));
                            return i.dt;
                          }),
                        datasets: labels[0].d.map((k, l) => ({
                          label: k.l,
                          data: __devices[k.l],
                          fill: fill[l],
                          backgroundColor: backgroundColor[l],
                          borderColor: borderColor[l],
                        })),
                      })
                        ? ""
                        : "Err2"}
                      {/*JSON.stringify(data)*/}
                      <Line data={data} />
                      <br/><br/>
                      <h2>{camel2title(uniqDevice)} [Running Averages]</h2>
                      {(data = {
                          labels: labels.sort(compare).map((i, j) => {
                            if (j === 0) i.d.map((k) => (__devices[k.l] = []));
                            i.d.map((k) => __devices[k.l].push(k.a));
                            return i.dt;
                          }),
                        datasets: labels[0].d.map((k, l) => ({
                          label: k.l,
                          data: __devices[k.l],
                          fill: fill[l],
                          backgroundColor: backgroundColor[l],
                          borderColor: borderColor[l],
                        })),
                      })
                        ? ""
                        : "Err2"}
                      <Line data={data} />
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
