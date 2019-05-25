import * as React from "react";
import { connect } from 'react-redux';
import {
  Navbar,
  Nav,
  NavItem,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
const MyNavBar = () => {
  return (
    // <Navbar bg="dark" expand="lg" variant="dark">
    //     <Navbar.Brand>
    //       <a href="/">LasView Home</a>
    //     </Navbar.Brand>
    //     <Navbar.Toggle  aria-controls="basic-navbar-nav" />
    //   <Navbar.Collapse id="basic-navbar-nav">
    //     <Nav className="mr-auto">
    //       <Nav.Link href="/las">LAS Viewer</Nav.Link>
    //     </Nav>
    //     <Navbar.Text style={{ fontSize: '12px', marginRight: '10px' }}>
    //       {'Welcome'}
    //     </Navbar.Text>
    //   </Navbar.Collapse>
    // </Navbar>
    <Navbar inverse fluid collapseOnSelect style={{boxShadow: '2px 2px 10px black'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">LasView Home</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/las">
            <NavItem eventKey={1} > LAS Viewer </NavItem>
          </LinkContainer>
        </Nav>
        <Navbar.Text pullRight style={{ fontSize: '12px', marginRight: '10px' }}>
          {'Welcome'}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}
export type AppState = {}
const mapStateToProps = (state: AppState) => {
  return {
  };
}
//
/**
 * pure: false option in the connect method is required to let the navbar know the react router has changed routes
 * Basically, the default (true) runs a componentShouldUpdate test, and unless something it is relying on in state
 * has changed, it won't update. Setting it to false will allow it to update and pick up the new route, and hightlight
 * the active link/tab
 */
const connectedNavBar = connect(mapStateToProps, null, null, { pure: false })(MyNavBar);
export { connectedNavBar as MyNavBar };
