import React from 'react';
import { Button } from 'react-bootstrap';

class HomePageNoAccount extends React.Component<{}, {}> {
  render (): React.ReactNode {
    return (
      <div>
        <p>{'It doesn\'t look like you\'re logged in yet.'}</p>
        <p><Button>Log in</Button></p>
        <p><Button>Register</Button></p>
      </div>
    );
  }
}

export default HomePageNoAccount;
