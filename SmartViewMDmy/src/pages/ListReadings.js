import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { useParams } from 'react-router-dom';
import { Table } from 'semantic-ui-react'
import SideMenu from '../SideMenu';
import {siteCode,siteLogoSmall} from "../components/Doctors"

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

function Readings(props){

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

  useEffect(() => {
    const usersReadings = firestore
      .collection("users")
      .doc(params.id)
      .collection("readings").orderBy('created','desc' );
    const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
      const readings = querySnapshot.docs.map((doc) => doc.data());
      setReadings(readings);
    });
    return unsubscribe;
  }, [params.id]);
  const camel2title = (camelCase) => camelCase
     .replace(/([A-Z])/g, (match) => ` ${match}`)
     .replace(/^./, (match) => match.toUpperCase());
  return (
    <div>
      <SideMenu id={params.id} list />
      <Table className="ui selectable celled table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="th">
              <h2>
                <img src={siteLogoSmall} alt={siteCode} height="40" /> Readings {params.name?`(${params.name})`:''}
              </h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell key="td">
              {" "}
              <Table
                unstackable
                compact
                striped
                className="ui selectable celled table"
              >
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Submitted</Table.HeaderCell>
                    <Table.HeaderCell>Device</Table.HeaderCell>
                    <Table.HeaderCell>Reading</Table.HeaderCell>
                    <Table.HeaderCell>Date Time</Table.HeaderCell>
                    <Table.HeaderCell>Note</Table.HeaderCell>
                    <Table.HeaderCell>Doctor</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {readings.map((reading) => (
                  <Table.Body key={reading.created}>
                    {Object.entries(reading.devices).map((device) => (
                      <Table.Row key={device}>
                        <Table.Cell>
                          {new Date(reading.created).toLocaleString()}
                        </Table.Cell>
                        <Table.Cell>{camel2title(device[0])}</Table.Cell>
                        <Table.Cell>
                          {/*Object.keys(device[1].reading)
                            .map(function (k) {
                              return device[1].reading[k];
                            })
                          .join(",")*/}
                          {Object.keys(units[device[0]])
                            .map((label) => {
                              const value = device[1].reading[label];
                              return <div>{`${label}: ${value} ${units[device[0]][label]}`}</div>;
                            })
                            }
                        </Table.Cell>
                        <Table.Cell>
                          {device[1].date} {device[1].time}
                        </Table.Cell>
                        <Table.Cell>{device[1].note}{reading?.createdBy?.name?`Entered by ${reading.createdBy.name}`:(reading?.createdBy?.email?`Entered by ${reading.createdBy.email}`:'')}</Table.Cell>
                        <Table.Cell>
                          {typeof reading.profile !== "undefined"
                            ? reading.profile.doctor
                            : ""}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                ))}
              </Table>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};

export default Readings;
