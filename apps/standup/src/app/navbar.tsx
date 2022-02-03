import React, { CSSProperties } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router";

/* eslint-disable-next-line */
export interface NavbarProps {
  token: Boolean;
}

import { environment } from '../environments/environment';

export function HomeNavbar(props: NavbarProps) {
  const history = useHistory();

  const style: CSSProperties = {
    background: 'linear-gradient(148deg, rgba(146,97,210,1) 0%, rgba(98,76,209,1) 74%)',
  }

  const onClickLogout = () => {
    localStorage.clear();
    history.push(`${environment.path}`)
  }
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={style} className="px-1">
      <Navbar.Brand>StandUp</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href={`${environment.path}home`}>Home</Nav.Link>
          {
              props.token ? <><Nav.Link href={`${environment.path}reward`}>Reward</Nav.Link></> : ''
          }
        </Nav>
        <Nav>
          {
              props.token ? 
              <NavDropdown title="Account" id="collasible-nav-dropdown" align="end" >
                <NavDropdown.Item href={`${environment.path}profile`}>Profile</NavDropdown.Item>
                <NavDropdown.Item href={`${environment.path}admin`}>Admin</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onClickLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
              :
              <Nav.Link href={`${environment.path}`}>Login</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default HomeNavbar;
