// import React from 'react';
// import { useHistory } from 'react-router-dom';
// //import { slide as Menu } from 'react-burger-menu'
// import { useSession } from './firebase/UserProvider';
// import { logout } from './firebase/auth';
// import './SideMenu.css';
// import { Nav, Navbar } from "react-bootstrap";
// import { ReactComponent as Logo } from "./SmartViewMD.com.svg";

//https://codesandbox.io/s/react-bootstrap-hamburger-menu-example-rnud4?file=/src/App.js:592-1531
function SideMenu(props){
/*  const history = useHistory();
  const { isAdmin, isDoctor } = useSession();

  //console.log(props)


  const users = !isAdmin ? '': <Nav.Link href={`/users`}>Users</Nav.Link> // <a id="users" className="menu-item" href={`/users` }>Users</a> ;
  const patients = !isDoctor ? '': <Nav.Link href={`/patients`}>My Patients</Nav.Link> //<a id="patients" className="menu-item" href={`/patients` }>My Patients</a> ;
  const doctors = !isDoctor ? '': <Nav.Link href={`/doctors/patients`}>All Patients</Nav.Link> //<a id="doctors" className="menu-item" href={`/doctors/patients` }>All Patients</a> ;
  const profile = isDoctor||props.profile ? '': <Nav.Link href={`/profile/${props.id}` }>Profile</Nav.Link> //<a id="profile" className="menu-item" href={`/profile/${props.id}` }>Profile</a> ;
  const reading = isDoctor||props.reading ? '': <Nav.Link href={`/reading/${props.id}` }>Reading</Nav.Link> //<a id="reading" className="menu-item" href={`/reading/${props.id}` }>Reading</a> ;
  const list    = isDoctor||props.list    ? '': <Nav.Link href={`/readings/${props.id}`}>List</Nav.Link> //<a id="list"    className="menu-item" href={`/readings/${props.id}`}>List</a> ;
  const report  = isDoctor||props.report  ? '': <Nav.Link href={`/reports/${props.id}`}>Report</Nav.Link> //<a id="report"  className="menu-item" href={`/reports/${props.id}` }>Report</a> ;
  const sample  = !isDoctor||props.sample ? '': <Nav.Link href={`/samples/${props.id}`}>Example Charts</Nav.Link> //<a id="sample"  className="menu-item" href={`/samples/${props.id}` }>Example Charts</a> ;

  const logoutUser = async () => {
      await logout();
      history.push('/login')
  };
*/

return (
    null
/*
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <Logo
          alt=""
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        SmartViewMD
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            {users}
            {patients}
            {doctors}
            {profile}
            {reading}
            {list}
            {report}
            {sample}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
*/
  );
};

export default SideMenu;
