import React from 'react';
import { Button, Container } from 'react-bootstrap';

class HomePageNoAccount extends React.Component<{}, {}> {
  render (): React.ReactNode {
    return (
      <Container>
        <p>{'It doesn\'t look like you\'re logged in yet.'}</p>
        <p><Button>Log in</Button></p>
        <p><Button>Register</Button></p>
      </Container>
    );
  }
}

export default HomePageNoAccount;
