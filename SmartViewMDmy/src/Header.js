import React from 'react';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLocation } from 'react-router-dom'
import { ReactComponent as Logo } from "./SmartViewMD.com.svg";
import { useSession } from './firebase/UserProvider';
import { logout } from './firebase/auth';

function Header() {
  const { isAdmin, isDoctor, navBar,user } = useSession();  
  const location = useLocation();
  // console.log('location',location)
  const demo = process.env.REACT_APP_PROJECT_ID === "svmd-d007"?
    <Nav.Item className="active"><Nav.Link>Demo</Nav.Link></Nav.Item >
    : ''
  const divider =  process.env.REACT_APP_PROJECT_ID !== "svmd-d007"? <NavDropdown.Divider/> : ''
 
  const demoDropdown = process.env.REACT_APP_PROJECT_ID !== "svmd-d007"?
      <NavDropdown.Item href="https://demo.SmartViewMD.com/login">Demo</NavDropdown.Item>
    : '' 
  const help =     
    <NavDropdown title="Help" id="collasible-nav-dropdown">
       <NavDropdown.Item href="https://SmartViewMD.com/video">Videos</NavDropdown.Item>
       <NavDropdown.Item href="https://SmartViewMD.com/#contact">Contact-Us</NavDropdown.Item>
       {divider}{demoDropdown}
    </NavDropdown> 
  const users = !isAdmin ? '': <Nav.Link href={`/users`}>Users</Nav.Link> 
  const login = user||location?.pathname === "/login" ? '': <Nav.Link href={`/login`} className={location?.pathname === "/login"?"active":''}>Login</Nav.Link>
  const signup = user||location?.pathname === "/signup" ? '': <Nav.Link href={`/signup`} className={location?.pathname === "/signup"?"active":''}>Sign-Up</Nav.Link>
  const resetPassword = user||location?.pathname === "/resetpw" ? '': <Nav.Link href={`/resetpw`} className={location?.pathname === "/resetpw"?"active":''}>Reset-Password</Nav.Link>
  
  const patient = (isAdmin||isDoctor)&&location?.pathname?.match(/(\/patient\/|\/readings|\/reports)/) ?
    <NavDropdown title="Patient" id="collasible-nav-dropdown">
        <NavDropdown.Item href={location?.pathname?.replace(/(patient|reports)/,"readings")}>Readings</NavDropdown.Item>
        <NavDropdown.Item href={location?.pathname?.replace(/(patient|readings)/,"reports")}>Reports</NavDropdown.Item>
    </NavDropdown> : '' 
  //<Nav.Link href={`/patients`} className={location?.pathname?.includes("/patient/")?"active":''}>Patient</Nav.Link>
  const admin = (!isDoctor&&!isAdmin) ? 
  '':     
    <NavDropdown title="Admin" id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/override`} className={location?.pathname === "/override"}>Override Patient Profiles</NavDropdown.Item>
        <NavDropdown.Item href={`/exportReadings`} className={location?.pathname === "/exportReadings"}>Export Patient Readings (CSV)</NavDropdown.Item>
        <NavDropdown.Item href={`/pprofile/${user.uid}`} className={location?.pathname?.includes("/pprofile/")?"active":''}>Update My Profile</NavDropdown.Item>

    </NavDropdown>
      
  const patients = !isDoctor ? 
    '':     
      <NavDropdown title="Reports" id="collasible-nav-dropdown">
        <NavDropdown.Item href={`/patients`} className={location?.pathname === "/patients" ?"active":''}>My Patients</NavDropdown.Item>
        <NavDropdown.Item href={`/patients/sort`} className={location?.pathname === "/patients/sort" ?"active":''}>Sort/Search My Patients</NavDropdown.Item>
        <NavDropdown.Item href={`/doctors/patients`} className={location?.pathname === "/doctors/patients" ?"active":''}>List All Patients (grouped by doctor)</NavDropdown.Item>
        <NavDropdown.Item href={`/doctors/patients/sort`} className={location?.pathname === "/doctors/patients/sort" ?"active":''}>Sort/Search All Patients</NavDropdown.Item>
        <NavDropdown.Item href={`/genderReport`} className={location?.pathname === "/genderReport"}>Gender Chart</NavDropdown.Item>
        <NavDropdown.Item href={`/genderAgeReport`} className={location?.pathname === "/genderAgeReport"}>Age/Gender Chart</NavDropdown.Item>
        <NavDropdown.Item href={`/listRegistrations`} className={location?.pathname === "/listRegistrations"}>All patients (by date registered)</NavDropdown.Item>
        <NavDropdown.Item href={`/avgReads/7/60`} className={location?.pathname === "/avgReads/7/60"}>Chart readings</NavDropdown.Item>
        <NavDropdown.Item href={`/baselineReads/7/60`} className={location?.pathname === "/abaselineReads/7/60"}>Avg BP readings</NavDropdown.Item>
      </NavDropdown>
  const profile = isDoctor||!user ? '': <Nav.Link href={`/profile/${user.uid}`} className={location?.pathname?.includes("/profile/")?"active":''}>Profile</Nav.Link>
  const reading = isDoctor||!user ? '': <Nav.Link href={`/reading/${user.uid}`} className={location?.pathname?.includes("/reading/")?"active":''}>Reading</Nav.Link>
  const list    = isDoctor||!user ? '': <Nav.Link href={`/readings/${user.uid}`} className={location?.pathname?.includes("/readings/")?"active":''}>List</Nav.Link>
  const report  = isDoctor||!user ? '': <Nav.Link href={`/reports/${user.uid}`} className={location?.pathname?.includes("/reports/")?"active":''}>Report</Nav.Link>
  const sample  = isDoctor||!user ? '': <Nav.Link href={`/samples/${user.uid}`} className={location?.pathname?.includes("/samples/")?"active":''}>Example Charts</Nav.Link>

  const leave = !user ? '':<Nav.Link onClick={logout} href={'/'}>Logout</Nav.Link>

  // axios commands to get navigation bar setting it newpage state onClick={logoutUser(history)} className="active" 
  


  //const history = useHistory();
  //const { user } = useSession();

  // const logoutUser = async () => {
  //   await logout();
  //   history.push('/login');
  // };
  // <img src="/BelleIT_SmartViewMD.com.png" height="45" style={{ verticalAlign: 'top' }}/>
  //<div className="center">x</div>
  //<FaFileMedicalAlt className="mr-1"/><FaUsers className="mr-1"/><FaLaptopMedical/>
//       <h2><img src="/SmartViewMD.com.svg" height="35" style={{ verticalAlign: 'text-top' }}/> {/*<font className="center">SmartViewMD <FaFileMedicalAlt className="mr-1"/><FaUsers className="mr-1"/><FaLaptopMedical/></font>*/}</h2> 

  return (
    <header>
      <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: '#0099ff' , paddingTop: '1px' ,paddingBottom: '1px' }} variant="dark">
        <Navbar.Brand href="/">
          <Logo
            alt="SmartViewMD.com"
            width="35"
            height="35"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto"/>
          <Nav className="text-white h4">
            {demo}            
            {login}
            {signup}
            {resetPassword}
            {users}
            {patient}
            {patients}
            {admin}
            {profile}
            {reading}
            {list}
            {report}
            {sample}
            {leave}
            {help}
          </Nav>
        </Navbar.Collapse>  
     </Navbar>
    </header>
  );
}

export default Header;
