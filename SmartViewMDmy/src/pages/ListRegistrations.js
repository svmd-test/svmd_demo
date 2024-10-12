import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import { useSession } from '../firebase/UserProvider';
import SideMenu from '../SideMenu';
//import admin from 'firebase-admin';

import { Link } from 'react-router-dom';
//import { ProfileImageDisplay } from '../ProfileImageDisplay';
import userReadings from "../components/userReadings";

const today = Date.now();
const lastWeek= today - 365 * 24 * 60 * 60 * 1000;

//const xx = JSON.stringify(usersReadings('9cyaY9cOvhaGKsCSLfeZbjjOh9a2'),null,2)

const ListRegistrations = () => {
  const { user } = useSession();
  const [users, setUsers] = useState([]);
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
    .orderBy('created','desc')
    //.where('doctor', '!=', '')
      //.where('name', '!=', 'Chance The Rapper');;
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data());

      const usersDocSelected = users.filter((doc) => doc.doctor != '' && doc.doctor != null )

      usersDocSelected.forEach((users, index) => { users.serial = index + 1; });
      setUsers(usersDocSelected);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      {user.displayName} - List doctors with registered patients<SideMenu id={user.uid} profile />
      <table className="ui selectable celled table">
        <thead>
          <tr>
            <th>#</th>
            <th>Registered</th>
            <th><Link to={'/doctors/patients'}>Doctor</Link></th>
            <th>Name</th>
            <th>DOB</th>
            <th>Recent Readings {"<"}ᛒ{">"} {"{"}days ago{"}"}</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid}>
              <td>{user.serial}</td>
              <td>{user.created.toDate().toLocaleString()}</td>
              <td>{user.doctor}</td>
              <td>
                <Link to={`/patient/${user.uid}`}>{user.name}</Link>
                {/*<div style={{ width: '200px' }}><ProfileImageDisplay id={user.uid} /></div>*/}
              </td>
              <td>{user.dob}</td>
              <td><div id={user.uid}>{userReadings(user.uid,firestore,lastWeek,today)}</div></td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRegistrations;
