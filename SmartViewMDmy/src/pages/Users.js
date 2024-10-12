import React, { useState, useEffect , useMemo} from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase/config';
import { Link } from 'react-router-dom';
import { ProfileImageDisplay } from '../ProfileImageDisplay';
import Table from "./UsersTable";
import userReadings from "../components/userReadings";
// https://codesandbox.io/s/3x51yzollq?file=/index.js - to filter old table
// https://stackoverflow.com/questions/35582978/best-way-to-filter-table-in-react/35586891

const today = Date.now();
const lastWeek= today - 7 * 24 * 60 * 60 * 1000;



const Users = () => {
  const [users, setUsers] = useState([]);
  const params = useParams();


  useEffect(() => {
    const usersRef = firestore.collection('users');
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data());
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
            Header: 'OK?',
            accessor: 'receiveEmail',
          },
          {
            Header: 'ᛒ        ..',
            accessor: 'blueTooth',
          },
          {
            Header: 'DOB',
            accessor: 'dob',
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
                
        <table className="ui selectable celled table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Readings {"<"}ᛒ{">"}</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>DOB</th>
              <th>blueTooth</th>
              <th>firebaseToken</th>
              <th>Doctor</th>
              <th>Specialty</th>
              <th>Device</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>
                  <Link to={`/profile/${user.uid}`}>{user.name}</Link>
                  <div style={{ width: '200px' }}><ProfileImageDisplay id={user.uid} /></div>
                </td>
                <td><div id={user.uid}>{userReadings(user.uid,firestore,lastWeek,today,true)}</div></td>
                <td>              <input
                        type="checkbox"
                        name="receiveEmail"
                        disabled
                        checked={user.receiveEmail}
                      />{" "}{user.email}</td>
                <td>
                  {user.address} {user.city}, {user.state} {user.zip}
                </td>
                <td>{user.phone}</td>
                <td>{user.dob}</td>
                <td>{user.blueTooth}</td>
                <td style={{backgroundColor:user.firebaseToken?'yellow':'none'}}>{user.firebaseToken?'*':''}{user.firebaseToken?.created?new Date(user.firebaseToken.created).toISOString():''}</td>
                <td>{user.doctor}</td>
                <td>{user.specialty}</td>
                <td>{user?.deviceInfo?.bloodPressureMonitor?.manufacturer_name_string} {user?.deviceInfo?.bloodPressureMonitor?.paired ? new Date(user?.deviceInfo?.bloodPressureMonitor?.paired).toLocaleString() : ''}</td> {/* devices. manufacturer_name_string*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Users;
