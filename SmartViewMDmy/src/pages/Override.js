import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
// import { useParams,Link } from "react-router-dom";
import { Table } from "semantic-ui-react";
import MatrixTable from "../components/matrixTable"
import MatrixEditableCell from "../components/matrixEditableCell"
import MatrixDropDown from "../components/matrixDropDown"

import SideMenu from "../SideMenu";
import {siteCode,siteLogoSmall} from "../components/Doctors"
import { overrideUserDocument } from '../firebase/user';
import { useParams } from 'react-router-dom';
import { FaLessThanEqual } from "react-icons/fa";
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

const UpdateProfiles = () => {
  
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [rowdata, setRowData] = useState([])

  const updateMyData = (rowIndex, columnId, value) => {

    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
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
        }
        return row;
      })
    );
  };
  
    
  const onAddRowClick = () => {
    setRowData(
      rowdata.concat({ name: "", dob: "", age: "", ageGroup: "", gender: "", registered: "", doctor: ""})
    )
  }
  
  const columns = [
    {
      Header: "Patient",
      accessor: "name",
    },
    {
      Header: "Gender",
      accessor: "gender",
      Cell: ({
        value: initialValue,
        row: { index },
        column: { id },
        updateMyData,
      }) => {
        const onItemClick = value => {
          console.log("value", value)
          updateMyData(index, id, value)
        }
        return (
          <MatrixDropDown
            options={[
              { label: "Female", value: "female" },
              { label: "Male", value: "male" },
              { label: "Select", value: "" },
            ]}
            title={"Select"}
            selectedValue={initialValue}
            onItemClick={onItemClick}
          />
        )
      },
    },
    {
      Header: "DOB",
      accessor: "dob",
      Cell: MatrixEditableCell,
    },
    {
      Header: "Overide DOB",
      accessor: "override.dob",
    },
    {
      Header: "Overide Gender",
      accessor: "override.gender",
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
      accessor: "created.toDate().toLocaleString()",
    },
    {
      Header: "Doctor",
      accessor: "doctor",
    }
  ]

  const [filteredData, setFilteredData] = useState([]);

  const [users, setUsers] = useState([]);
  const [override, setOverride] = useState({});
  //const { user } = useSession();
//  const params = useParams();
  const [userDocument, setUserDocument] = useState('');

  // const getOverrideDataX = ( async (uid) => {

  //   const getOD =  firestore
  //           .collection('users_override')
  //           .where( 'uid', '==', uid )

  //   const unsubscribe = await getOD.onSnapshot((querySnapshot) => {
  //     const override = querySnapshot.docs.map( (doc) => doc.data());
  //     override.forEach( async (user, index) => { 
  //         console.log("ODD:", uid, user)
  //         return user
  //       })
  //     setOverride(override);

  //   })
  //   return unsubscribe
  // })

  // const getOverrideData = ( async (uid) => {
  //   let stash=[]
  //   const getOD = await firestore
  //     .collection('users_override')
  //     .where( 'uid', '==', uid )
  //     .get()
  //     .then((querySnapshot) => { 
  //         //if (querySnapshot.exists)
  //           stash.push( querySnapshot.docs.map( (doc) => doc.data())[0] )
  //         // const or = querySnapshot.docs.map( (doc) => doc.data());
  //         // const out = or.forEach((doc) => {
  //         //     // doc.data() is never undefined for query doc snapshots
  //         //     console.log(doc.uid, " => ", doc);
  //         //     //setOverride(doc.data())
  //         //     stash.push(doc)
  //         // });
  //         //console.log('stash.len: ',stash.length)
           
  //         return stash[0] ? stash[0] : ''
  //     })
  //     .catch((error) => {
  //         console.log("Error getting documents: ", error);
  //     });
  //     return getOD
  // })

  useEffect(() => {
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
        const age = user.dob ? calculateAge(user.dob) : "No DOB"
        const ageGroup = user.dob ? calculateAgeGroup(age) : "No DOB"
        user.age = age
        user.ageGroup = ageGroup
        
        // const userOverride = await getOverrideData(user.uid)
        // if ( userOverride.dob ){
        //   user.override = userOverride
        //   user.overrideDOB = userOverride.dob
        //   console.log('UOD:', index, user.uid ,user.override.dob)
        // }
          
      });

      setUsers(users);
    });
    return unsubscribe;
  }, []);

  return (
    
    <div>
      <SideMenu id="0" report />
              <h4>
                <img src={siteLogoSmall} alt={siteCode} height="40" /> 
                Override Patient Profile (Gender, DOB)
              </h4>
              <div>
                <hr/>
              </div>
                <div className="container mx-auto">
                  {/* <button
                    onClick={onAddRowClick}
                    className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                  >
                    Add Row
                  </button> */}
                  <div className="flex justify-center mt-8">
                    <MatrixTable columns={columns} data={users} updateMyData={updateMyData} skipPageReset={skipPageReset} />
                  </div>
                </div>
                {/* <pre>{'USERS: '+ JSON.stringify(users,null,2)}</pre> */}
              </div>

  );
}

export default UpdateProfiles;
