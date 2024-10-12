import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
// import { useParams,Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import { Doughnut } from "react-chartjs-2";
import Collapsible from "../components/Collapsible"
import {siteCode,siteLogoSmall} from "../components/Doctors"
// import { Link } from 'react-router-dom';
// import { ProfileImage } from '../ProfileImage';
import MatrixTable from "../components/matrixTable"
import MatrixEditableCell from "../components/matrixEditableCell"
import MatrixDropDown from "../components/matrixDropDown"
import { overrideUserDocument } from '../firebase/user';

const calculateAge = (dob) => {
  var today = new Date();
  var birthDate = new Date(dob);
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
  {
      age_now--;
  }
  //console.log(age_now);
  return age_now;
}

const calculateAgeGroup = (ageIn) => {
  let ageText='TBD'
  if (ageIn < 0)
    ageText = "ERROR"
  else if(ageIn <= 17)
    ageText = "0 - 17"
  else if(ageIn <= 29)
    ageText = "18 - 29"
  else if (ageIn <= 49)
    ageText = "30 - 49"
  else if (ageIn <= 64)
    ageText = "50 - 64"
  else
    ageText = "65+";
  return ageText;
}

const Report = () => {

  const [filteredData, setFilteredData] = useState([]);
  const [override, setOverride] = useState({});
  const [userDocument, setUserDocument] = useState('');
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [rowdata, setRowData] = useState([])
  const [stash, setStash] = useState({});

  // let stash={}
  // let rowCounter=0
  // const fill = [true, false, false, false, false];
  // const backgroundColor = ["rgba(75,192,192,0.2)", null, null, null, null];
  // const borderColor = ["rgba(75,192,192,1)", "#742774", "red", "blue", "green"];
  // const interval = params.interval?params.interval:1
  // const duration = params.duration?params.duration:7
  // const today = Date.now();
  // const lastWeek= today - duration * 24 * 60 * 60 * 1000;
  // let labels = [];

  let data = {};
  const history = useHistory();
  const handleOnSubmit = () => {
    history.push(`/override`);
  };
  const updateMyData = (rowIndex, columnId, value) => {

    // We also turn on the flag to not reset the page
    //setSkipPageReset(true);
    //setStash({})
    setUsers((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          let newAge={}
          let newRow={}
          if ( columnId === 'dob' ) {
            console.log('colID:', index,columnId,row[columnId],value,row['uid'])
            const age = value ? calculateAge(value) : "No DOB"
            const ageGroup = value ? calculateAgeGroup(age) : "No DOB"
            newAge = { 
              age: age,
              ageGroup: ageGroup
            }
            if ( row['override'] && row['override']['gender'] ) {
              newRow = { 'gender' : row['gender'] ,  [columnId]: value }
            } else {
              newRow = { [columnId]: value }
            }
            newRow = { 'gender' : row['gender'] ,  [columnId]: value }
          } else {
            if ( row['override'] && row['override']['dob'] ) {
              newRow = { 'dob' : row['dob'] ,  [columnId]: value }
            } else {
              newRow = { [columnId]: value }
            }
          }
          try {
            //setLoading(true);
            //setUserDocument(event.target.value);
            //console.log('Passwd...: ',state)
            //console.log('uid: ',1,'\nDataChanged: ',event.target.value)
            if ( value != old[columnId] ) {
              overrideUserDocument({ uid: row['uid'], ...newRow });
            }
      
          } catch (error) {
            console.log(error);
          } finally {
            //(false);
          }

          return {
            ...old[rowIndex],
            [columnId]: value,
            ...newAge
          };
        } else {
          // stash[row['gender']] = ( stash[row['gender']] || 0 ) + 1
        }

        return row;
      })
    );
    //setStash(stash);

  };
  
  const columns = [
    {
      Header: "#",
      accessor: "serial",
    },
    {
      Header: "Patient",
      accessor: "name",
    },
    {
      Header: "Gender",
      accessor: "gender",
      // Cell: ({
      //   value: initialValue,
      //   row: { index },
      //   column: { id },
      //   updateMyData,
      // }) => {
      //   const onItemClick = value => {
      //     console.log("value", value)
      //     updateMyData(index, id, value)
      //   }
      //   return (
      //     <MatrixDropDown
      //       options={[
      //         { label: "Female", value: "female" },
      //         { label: "Male", value: "male" },
      //         { label: "Select", value: "" },
      //       ]}
      //       title={"Select"}
      //       selectedValue={initialValue}
      //       onItemClick={onItemClick}
      //     />
      //   )
      // },
    },
    {
      Header: "DOB",
      accessor: "dob",
      // Cell: MatrixEditableCell,
    },
    {
      Header: "Age",
      accessor: "age",
    },
    {
      Header: "Age Group",
      accessor: "ageGroup",
    },
    {
      Header: "Registered",
      accessor: "dateRegistered",
    },
    {
      Header: "Doctor",
      accessor: "doctor",
    }
  ]

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setStash({})
    const usersRef = firestore.collection('users')
      .where('doctor', '!=', '')
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map( (doc) => doc.data());
      users.forEach( async (user, index) => { 
        user.serial = index + 1; 
        if ( user?.override?.dob ) {
          user.dob = user.override.dob
        }
        if ( user?.override?.gender ) {
          user.gender = user.override.gender
        }
        if ( ! user.gender) {
          user.gender = "Not selected"
        }
   
        stash[user.gender] = ( stash[user.gender] || 0 ) + 1
        user.dateRegistered=user.created?user.created.toDate().toLocaleString():''  
        const age = user.dob ? calculateAge(user.dob) : "No DOB"
        const ageGroup = user.dob ? calculateAgeGroup(age) : "No DOB"
        user.age = age
        user.ageGroup = ageGroup
        
      });
      setStash(stash);

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
                  <MatrixTable columns={columns} data={users} updateMyData={updateMyData} skipPageReset={skipPageReset} />
                </div>
                </Collapsible>
                <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '2vh'}}>
                    {'Total by Gender: '+JSON.stringify(stash)}
                </div>
                {/*Object.entries(stash).map((entry)=>{
                  //console.log(entry)
                  labels.push({
                    gender: entry[0],
                    count: entry[1]
                  })
                })
              */}
                <pre>{/*JSON.stringify(labels,null,2)*/}</pre>

                {(data = {
                    labels: Object.keys(stash),
                    datasets: [{
                      label: "Test Rainfall",
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
                  : "Err2"}
          {/**/}
                {/*JSON.stringify(data)*/}
          {/* 
                <Line data={data} />
                <br/><br/>
          */}

                {(data.labels.length>0)?(<div>
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
                </div>):'None for this time frame'}
          
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
