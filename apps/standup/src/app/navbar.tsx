import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useHistory } from "react-router";

/* eslint-disable-next-line */
export interface NavbarProps {
  token: Boolean;
}


//rgb(98 76 209)
// rgb(146 97 210)
export function HomeNavbar(props: NavbarProps) {
  const history = useHistory();

  const style = {
    background: 'linear-gradient(148deg, rgba(146,97,210,1) 0%, rgba(98,76,209,1) 74%)',
  }

  const onClickLogout = () => {
    localStorage.clear();
    history.push('/')
  }
  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={style}>
      <Navbar.Brand>StandUp</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          {
              props.token ? <Nav.Link href="/goal">Create</Nav.Link> : ''
          }
        </Nav>
        <Nav>
          {
              props.token ? 
              <NavDropdown title="Account" id="collasible-nav-dropdown" alignRight>
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/admin">Admin</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onClickLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
              :
              <Nav.Link href="/">Login</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default HomeNavbar;
