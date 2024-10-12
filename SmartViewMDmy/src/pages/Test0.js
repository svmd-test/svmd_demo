import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
// import { useParams,Link } from "react-router-dom";
import { Table } from "semantic-ui-react";
import SideMenu from "../SideMenu";
import {siteCode,siteLogoSmall} from "../components/Doctors"
import { overrideUserDocument } from '../firebase/user';
import { useParams } from 'react-router-dom';
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

const UpdateProfiles = () => {

  const [users, setUsers] = useState([]);
  //const { user } = useSession();
//  const params = useParams();
  const [userDocument, setUserDocument] = useState('');

  useEffect(() => {
    const usersRef = firestore.collection('users')
      .where('doctor', '!=', '')
    const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data());
      users.forEach((users, index) => { users.serial = index + 1; });
      setUsers(users);
    });
    return unsubscribe;
  }, []);

  const handleItemChanged = event => {
    try {
      //setLoading(true);
      setUserDocument(event.target.value);
      //console.log('Passwd...: ',state)
      console.log('uid: ',1,'\nDataChanged: ',event.target.value)
      //await overrideUserDocument({ uid: params.id, ...data });

    } catch (error) {
      console.log(error);
    } finally {
      //(false);
    }
  };

  const handleItemUpdated = async (data,uid) => {
    try {
      //setLoading(true);
      setUserDocument(data.target.value);
      //console.log('Passwd...: ',state)
      console.log('uid: ',uid,'\nDataUpdated: ',data.target.value)
      //await overrideUserDocument({ uid: params.id, ...data });

    } catch (error) {
      console.log(error);
    } finally {
      //(false);
    }
  };

  return (
    
    <div>
      <SideMenu id="0" report />
      <Table className="ui selectable celled table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell key="th">
              <h2>
                <img src={siteLogoSmall} alt={siteCode} height="40" /> 
                Overide Patient Profile 
              </h2>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell key="td">
                <Table
                  unstackable
                  compact
                  striped
                  className="ui selectable celled table"
                  key="1"
                >
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Patient</Table.HeaderCell>
                      <Table.HeaderCell>DOB</Table.HeaderCell>
                      <Table.HeaderCell>Age</Table.HeaderCell>
                      <Table.HeaderCell>Age Group</Table.HeaderCell>
                      <Table.HeaderCell>Gender</Table.HeaderCell>
                      <Table.HeaderCell>Registered</Table.HeaderCell>
                      <Table.HeaderCell>Doctor</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>   
                    <Table.Body key={1}>
                        {users.map((user) => {
                            const age = user.dob ? calculateAge(user.dob) : "No DOB"
                            const ageGroup = user.dob ? calculateAgeGroup(age) : "No DOB"
                            const gender = user.gender ? user.gender : "Not selected"
                            const dateRegistered=user.created?user.created.toDate().toLocaleString():''
                            return ( 
                            <Table.Row>
                                <Table.Cell>{user.name}</Table.Cell>
                                <Table.Cell>
                                    <input
                                        type="text"
                                        name="user.dob"
                                        value={user.dob}
                                        onChange={handleItemChanged}
                                    />{user.dob}
                                </Table.Cell>
                                <Table.Cell>{age}</Table.Cell>
                                <Table.Cell>{ageGroup}</Table.Cell>
                                <Table.Cell>{user.gender}</Table.Cell>
                                <Table.Cell>{dateRegistered}</Table.Cell>
                                <Table.Cell>{user.doctor} </Table.Cell>
                            </Table.Row>
                            )
                        })}
                    </Table.Body>
                    <button
                    type="submit"
                    className="ui submit large grey button right floated"
                  >
                    Submit
                  </button>
                </Table>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}

export default UpdateProfiles;
