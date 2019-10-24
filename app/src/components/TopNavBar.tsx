import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

class TopNavBar extends React.Component<{}, {}> {
  public render (): React.ReactNode {
    return (
      <Navbar bg="light">
        <Navbar.Collapse id="basic-navbar-nav">
          <Navbar.Brand href="#home">ARRtistry</Navbar.Brand>
          <Button variant="outline-success">Login</Button>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default TopNavBar;
