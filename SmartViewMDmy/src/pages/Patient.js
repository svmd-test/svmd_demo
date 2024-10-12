import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firestore } from '../firebase/config';
import { ProfileImageDisplay } from '../ProfileImageDisplay';
import { useSession } from '../firebase/UserProvider';
import SideMenu from '../SideMenu';

function Patient(props){
  const params = useParams();
  const [patient,setPatient]  = useState([]);
  const { user } = useSession();

  useEffect(() => {
    const docRef = firestore.collection('users').doc(params.id);
    const unsubscribe = docRef.onSnapshot((doc) => {
      if (doc.exists) {
        setPatient(doc.data());
      }
    });
    return unsubscribe;
  }, [params.id]);

  return (
    <div>
      {user.displayName}<SideMenu id={params.id} profile />
      <ul>
        <li><Link to={`/patients`}>List all my patients</Link></li>
        <li>View below patient <Link to={`/readings/${patient.uid}/${patient.name}`}>Readings</Link> or <Link to={`/reports/${patient.uid}/${patient.name}`}> Reports</Link></li>
      </ul>
      <table className="ui selectable celled table">
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr key={patient.uid}>
            <td>{patient.name}
              <div style={{ width: '200px' }}><ProfileImageDisplay id={patient.uid} /></div>
            </td>
            <td>{patient.dob}</td>
            <td>{patient.phone}</td>
            <td><input
                      type="checkbox"
                      name="receiveEmail"
                      disabled
                      checked={patient.receiveEmail}
                    />{" "}{patient.email}</td>
            <td>
              {patient.address} {patient.city}, {patient.state} {patient.zip}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Patient;
