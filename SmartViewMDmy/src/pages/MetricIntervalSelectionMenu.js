import React from 'react';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useParams,useLocation } from 'react-router-dom'
//import { useSession } from './firebase/UserProvider';

function MetricIntervalSelectionMenu() {
  //const { isAdmin, isDoctor, navBar,user } = useSession();  
  const location = useLocation().pathname.split("/");
  const params = useParams();

  const interval =     
    <NavDropdown title="Interval" id="duration-nav-dropdown">
       <NavDropdown.Item href={`/${location[1]}/7/${params.duration}`}>7 days (weekly)</NavDropdown.Item>
       <NavDropdown.Item href={`/${location[1]}/30/${params.duration}`}>30 days (monthly)</NavDropdown.Item>
       <NavDropdown.Item href={`/${location[1]}/91/${params.duration}`}>91 days (quarterly)</NavDropdown.Item>
       <NavDropdown.Item href={`/${location[1]}/182/${params.duration}`}>182 days (semi-annually)</NavDropdown.Item>
       <NavDropdown.Item href={`/${location[1]}/365/${params.duration}`}>365 days (yearly)</NavDropdown.Item>
    </NavDropdown> 
  
  return (
    <div>
      <Navbar style={{ backgroundColor: '#00000' , paddingTop: '1px' ,paddingBottom: '1px' }} >
        <Navbar.Toggle aria-controls="duration-navbar-nav" />
        <Navbar.Collapse id="duration-navbar-nav" className="mr-auto">
          <Nav className="mr-auto"/>
          <Nav>
            {interval} <div className="nav-link" style={{ color: 'black' }} >{params.interval} days </div>
          </Nav>
        </Navbar.Collapse>  
     </Navbar>
    </div>
  );
}

export default MetricIntervalSelectionMenu;
