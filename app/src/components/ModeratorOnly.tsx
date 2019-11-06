import * as React from 'react';
import Container from 'react-bootstrap/Container';

interface GovernanceProps {
  drizzle: any;
  drizzleState: any;
  children: React.ReactNode | React.ReactNode[];
}

type GovernanceState = {
  isGovernor: false;
}

class Governance extends React.Component<GovernanceProps, GovernanceState> {
  componentDidMount (): void {
    this.props.drizzle.contracts.Governance.methods.isGovernor(this.props.drizzleState.accounts[0]).call()
      .then((isGovernor: any) => this.setState({ isGovernor: isGovernor }))
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state || this.state.isGovernor) {
      return (
        <Container>
          {this.props.children}
        </Container>
      );
    }

    return (
      <Container>
        <h1>You are not an approved moderator</h1>
      </Container>
    );
  }
}

export default Governance;
