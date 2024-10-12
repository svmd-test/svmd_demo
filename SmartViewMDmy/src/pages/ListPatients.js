import React, { useState, useEffect , useMemo } from 'react';
import { firestore } from '../firebase/config';
import { useSession } from '../firebase/UserProvider';
import SideMenu from '../SideMenu';
import { useParams } from 'react-router-dom';
import Table from "./UsersTable";

import { Link } from 'react-router-dom';
//import { ProfileImageDisplay } from '../ProfileImageDisplay';
import userReadings from "../components/userReadings";

const today = Date.now();
const lastWeek= today - 365 * 24 * 60 * 60 * 1000;

//const xx = JSON.stringify(usersReadings('9cyaY9cOvhaGKsCSLfeZbjjOh9a2'),null,2)

const ListPatients = () => {
  const { user } = useSession();
  const [users, setUsers] = useState([]);
  const params = useParams();

  // const [patientData, setPatientData] = useState([]);

  //let patientData={};
  //let patientReadings={};

  // firestore.collectionGroup('readings')
  // .where('created','>',lastWeek).orderBy('created','desc' )
  // .get()
  // .then( async querySnapshot => {
  //   alert('hi')
  //   return querySnapshot
  // })

  // .then( async querySnapshot => {
  //   return querySnapshot.forEach(element => {
  //     return element.data().created
  //   });
  // })


  useEffect(() => {
    const usersRef = firestore.collection('users')
      .where('doctor', '==', user.displayName)
      //.where('name', '!=', 'Chance The Rapper');;
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data());
      users.forEach((user, index) => { 
        user.serial = index + 1; 
        if ( user?.override?.dob ) {
          user.overrideDOB = user.override.dob
        }
        if ( user?.override?.gender ) {
          user.overrideGender = user.override.gender
        }  
      });
      setUsers(users);
    });
    return unsubscribe;
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Full Name',
            accessor: 'name',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'EMAIL',
            accessor: 'email',
          },
          {
            Header: '<Acknowledged',
            accessor: 'receiveEmail',
          },
          // {
          //   Header: 'ᛒ        ..',
          //   accessor: 'blueTooth',
          // },
          {
            Header: 'DOB',
            accessor: 'dob',
          },
          {
            Header: 'Gender',
            accessor: 'gender',
          },
          {
            Header: 'Override DOB',
            accessor: 'overrideDOB',
          },
          {
            Header: 'Override Gender',
            accessor: 'overrideGender',
          },
          {
            Header: 'Phone',
            accessor: 'phone',
          }, 
          {
            Header: 'Doctor',
            accessor: 'doctor',
          },
        ],
      },
    ],
    []
  )
  if(params.type) {
    return (
      <div>
        <Table columns={columns} data={users} />
      </div>
    )
  } else {
    return (
      <div>
        {user.displayName} |
        <ul>
         <li><Link to={'/patients/sort'}> Sort/Filter My Patients</Link></li>
          <li><Link to={'/doctors/patients'}> List All Patients</Link></li>
          <li><Link to={'/doctors/patients/sort'}>Sort/Filter All Patients</Link></li>
          <li>List <Link to={'/listRegistrations'}> All patients by registration date</Link> </li>
          <li>Report Group data 
            <ul>
              <li><Link to={'/genderAgeReport'}>Total Enrolled by Age/Gender</Link> (Stacked Bar Chart)</li>
              <li><Link to={'/genderReport'}>Total Enrolled by Gender</Link> (Doughnut/Pie Chart)</li>
            </ul>
          </li>
          <li>Report/Chart Average All Patients 
            <ul>
              <li><Link to={'/avgReads/7/60'}>weekly over last 60 days</Link></li>
              <li><Link to={'/avgReads/30/365'}>monthly over last year</Link></li>
              <li><Link to={'/avgReads/91/730'}>quaterly over last 2 years</Link></li>
            </ul>
          </li>
          <li>Report <Link to={'/baselineReads/7/60'}> average starting Blood Pressure</Link> of All patients</li>
        </ul>
        <SideMenu id={user.uid} profile />
        <table className="ui selectable celled table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Recent Readings {"<"}ᛒ{">"} {"{"}days ago{"}"}</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th><Link to={'/listRegistrations'}>Registered</Link></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>{user.serial}</td>
                <td>
                  <Link to={`/patient/${user.uid}/${user.name}`}>{user.name}</Link>
                  {/*<div style={{ width: '200px' }}><ProfileImageDisplay id={user.uid} /></div>*/}
                </td>
                <td>{user.dob}</td>
                <td><div id={user.uid}>{userReadings(user.uid,firestore,lastWeek,today)}</div> <Link to={`/reading/${user.uid}`}>Add reading</Link></td>
                <td>{user.phone}</td>
                <td>
                <input
                        type="checkbox"
                        name="receiveEmail"
                        disabled
                        checked={user.receiveEmail}
                      />{" "}
                  {user.email}</td>
                <td>
                  {user.address} {user.city}, {user.state} {user.zip}
                </td>
                <td>{user.created.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
}
export default ListPatients;
