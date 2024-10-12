import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { useParams } from 'react-router-dom';
import { Table } from 'semantic-ui-react'
import SideMenu from '../SideMenu';
import { Line } from "react-chartjs-2";

// import "./Report.css"; // For Reporting

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

function Report(props){

  const [reports, setReports] = useState([]);

  const params = useParams();

  useEffect(() => {
    const usersReadings = firestore
      .collection("users")
      .doc(params.id)
      .collection("readings").orderBy('created','desc' );
    const unsubscribe = usersReadings.onSnapshot((querySnapshot) => {
      const reports = querySnapshot.docs.map((doc) => doc.data());
      console.log("iREPORTS: ",reports)

      let labels = [];
      let doctors = [];
      let devices = [];
      let data = {};

      reports.map((reading) => (
        labels.push(reading.created),
        doctors.push(reading.profile.doctor),

        Object.entries(reading.devices).map((device) => (
          devices.push(camel2title(device[0])),
          Object.keys(device[1].reading).map(
            (k) => {
              if (typeof data[k] === "undefined" )  
                 data[k] = [ device[1].reading[k] ]
             else 
                 data[k] = [ data[k], ...device[1].reading[k] ]
            }
          ))
        )
          
      ))
      // const labels = reports.map((reading) => (
      //   reading.created
      // )) 

      // reports.map((reading) = (
      //     labels: 
      // ))
      console.log("chartData: ",labels, doctors,devices, data)
      setReports(reports);
    });
    return unsubscribe;
  }, [params.id]);

  const camel2title = (camelCase) => camelCase
     .replace(/([A-Z])/g, (match) => ` ${match}`)
     .replace(/^./, (match) => match.toUpperCase());

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "First dataset",
        data: [33, 53, 85, 41, 44, 65],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)"
      },
      {
        label: "Second dataset",
        data: [33, 25, 35, 51, 54, 76],
        fill: false,
        borderColor: "#742774"
      }
    ]
  };
  // const rep = {
  //   labels: reports.map("")
  // }
  //console.log("REPORTS: ",reports)
  return (
    <div>
      <SideMenu id={params.id} report/>
      <Line data={data} />

    </div>
  );
};

export default Report;