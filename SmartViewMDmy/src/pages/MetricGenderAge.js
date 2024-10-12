import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import { useHistory } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import { Bar } from "react-chartjs-2";
import Collapsible from "../components/Collapsible"
import {siteCode,siteLogoSmall} from "../components/Doctors"

// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';

const calculateAge = (dob) => {
  var today = new Date();
  var birthDate = new Date(dob);
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
  {
      age_now--;
  }
  console.log(age_now);
  return age_now;
}
const calculateAgeGroup = (ageIn) => {
  let ageText='TBD'
  if (ageIn < 0)
    ageText = "ERROR";
  else if(ageIn <= 17)
    ageText = "0 - 17";
  else if(ageIn <= 29)
    ageText = "18 - 29";
  else if (ageIn <= 49)
    ageText = "30 - 49";
  else if (ageIn <= 64)
    ageText = "50 - 64";
  else
    ageText = "65+";
  return ageText;
}
const Report = () => {

  const [users, setUsers] = useState([]);

  let tBodyKey=0
  let t={}
  let stash={}
  let stashGroup={}
  let stashAgeGroup={}
  let ds=[]
  let rowCounter=0
  const backgroundColor = {
     male          : "#caf270",
     female        : "#45c490",
    'Not selected' : "#008d93"
  }

  // const fill = [true, false, false, false, false];
  // const borderColor = ["rgba(75,192,192,1)", "#742774", "red", "blue", "green"];
  // const interval = params.interval?params.interval:1
  // const duration = params.duration?params.duration:7
  // const today = Date.now();
  // const lastWeek= today - duration * 24 * 60 * 60 * 1000;

  let labels = [];
  let data = {};
  const history = useHistory();

  const handleOnSubmit = () => {
    history.push(`/override`);
  };
  useEffect(() => {
    const usersRef = firestore.collection('users')
      .where('doctor', '!=', '')
      //.where('name', '!=', 'Chance The Rapper');;
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data());
      users.forEach((users, index) => { users.serial = index + 1; });
      setUsers(users);
    });
    return unsubscribe;
  }, []);

  return (
    
    <div>
      <SideMenu id="0" report />
      <Table className="ui selectable celled table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="th">
              <h2>
                <img src={siteLogoSmall} alt={siteCode} height="40" /> 
                Custom Reports & Charts 
              </h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell key="td">
              <p>
                <Collapsible open="false" title={`Click to hide/reveal Patient Names and Gender `}>
                <div>
                  <button id="btn-push" className="ui submit mini grey button" onClick={handleOnSubmit}>Override/Update Patient Gender/Age</button>
                </div>
                <div>
                <Table
                  unstackable
                  compact
                  striped
                  className="ui selectable celled table"
                  key="1"
                >
                  <Table.Header>
                    <Table.Row>
                     <Table.HeaderCell>#</Table.HeaderCell>
                      <Table.HeaderCell>Patient</Table.HeaderCell>
                      <Table.HeaderCell>DOB</Table.HeaderCell>
                      <Table.HeaderCell>Age</Table.HeaderCell>
                      <Table.HeaderCell>Age Group</Table.HeaderCell>
                      <Table.HeaderCell>Gender</Table.HeaderCell>
                      <Table.HeaderCell>Registered</Table.HeaderCell>
                      <Table.HeaderCell>Doctor</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>                            
                  <Table.Body key={tBodyKey}>
                      {users.map((user) => {
                        const age = user.dob ? calculateAge(user.dob) : "No DOB"
                        const ageGroup = user.dob ? calculateAgeGroup(age) : "No DOB"
                        const gender = user.gender ? user.gender : "Not selected"
                        stash[gender] = ( stash[gender] || 0 ) + 1
                        stashGroup[ageGroup] = ( stashGroup[ageGroup] || 0 ) + 1
                        if (stashAgeGroup[gender]==null) {
                          stashAgeGroup[gender]={}
                        }
                        stashAgeGroup[gender][ageGroup] = ( stashAgeGroup[gender][ageGroup] || 0 ) + 1
                        const dateRegistered=user.created?user.created.toDate().toLocaleString():''
                        return ( 
                          <Table.Row>
                            <Table.Cell>{user.serial}</Table.Cell>
                            <Table.Cell>{user.name}</Table.Cell>
                            <Table.Cell>{user.dob}</Table.Cell>
                            <Table.Cell>{age}</Table.Cell>
                            <Table.Cell>{ageGroup}</Table.Cell>
                            <Table.Cell>{user.gender}</Table.Cell>
                            <Table.Cell>{dateRegistered}</Table.Cell>
                            <Table.Cell>{user.doctor} </Table.Cell>
                          </Table.Row>
                        )
                      })}
                  </Table.Body>
                </Table>
                </div>
                </Collapsible>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                  {'Total by Age Group: '+JSON.stringify(stashGroup)}
                </div>
                {/*
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                  {JSON.stringify(stashAgeGroup)}
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                  {JSON.stringify(Object.keys(stashAgeGroup))}
                </div>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                  {JSON.stringify(Object.values(stashAgeGroup))}
                </div>
                */}
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                  {'Total by Gender: '+JSON.stringify(stash)}
                </div>
                {
                  Object.entries(stashGroup).sort().map((entry)=>{
                    //console.log(entry)
                    labels.push(entry[0])
                  })
                }
                <pre>{/*JSON.stringify({'LABELS':labels},null,2)*/}</pre>
                
                {
                  Object.entries(stashAgeGroup).map((entry)=>{
                    //console.log(entry)
                    ds.push({
                      label: entry[0],
                      backgroundColor: backgroundColor[entry[0]],
                      data: Object.entries(stashGroup).sort().map((entryGroup)=>(
                         stashAgeGroup[entry[0]][entryGroup[0]]
                      ))
                    })
                  })
                }
                <pre>{/*JSON.stringify({'DS':ds},null,2)*/}</pre>

                {/*(data = {
                    labels: Object.keys(stash),
                    datasets: [{
                      label: "Total Enrolled by Gender/Age",
                      data: Object.values(stash),
                      backgroundColor:   [        
                        "#6800B4",
                        "#C9DE00",
                        "#00A6B4",
                      ],
                      hoverBackgroundColor: [
                        "#35014F",
                        "#4B5000",
                        "#003350",
                      ],
                    }],
                })
                  ? ""
                  : "Err2" */}
                  {
                    (  data = {
                        labels: labels,
                        datasets: ds
                      }
                    ) ? '' : ''
                  }
          {/**/}
                {/*JSON.stringify(data)*/}
          {/* 
                <Line data={data} />
                <br/><br/>
          */}
          {
            <Bar
                data={data}
                options={{
                  title: {
                    display: true,
                    text: "Stacked Bar example -- Group data. Total Enrolled by Age & Gender",
                    fontSize: 12,
                  },
                  legend: {
                    display: true,
                    position: "top",
                  },
                  tooltips: {
                    displayColors: true,
                    callbacks:{
                      mode: 'x',
                    },
                  },
                  scales: {
                    xAxes: [{
                      stacked: true,
                      gridLines: {
                        display: false,
                      }
                    }],
                    yAxes: [{
                      stacked: true,
                      ticks: {
                        beginAtZero: true,
                      },
                      type: 'linear',
                    }]
                  },
                  responsive: true,
                  maintainAspectRatio: true
                }}
            />
          }
                {/*(data.labels.length>0)?(<div>
                <Doughnut
                  data={data} 
                  options={{
                    title: {
                      display: true,
                      text: "Group data. Total Enrolled by Gender",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "top",
                    },
                    responsive: true,
                    animation:{
                        animateScale: true,
                    },
                    tooltips: {
                      callbacks: {
                        // label: function(tooltipItem, data) {
                        //   return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                        // }
                        label: function(tooltipItem, data) {
                          var dataset = data.datasets[tooltipItem.datasetIndex];
                          var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                          });
                          var currentValue = dataset.data[tooltipItem.index];
                          var precentage = Math.floor(((currentValue/total) * 100)+0.5);
                          return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + ' (=' + precentage + "%)";
                       }
                      }
                    }
                  }}
                />
                </div>):'None for this time frame'*/}
          
          {/**/}
              </p>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default Report;
