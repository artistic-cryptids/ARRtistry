import * as React from 'react';
import Container from 'react-bootstrap/Container';

interface GovernanceProps {
  children: React.ReactNode | React.ReactNode[];
  contracts: any;
  accounts: Array<string>;
}

type GovernanceState = {
  isGovernor: false;
}

class Governance extends React.Component<GovernanceProps, GovernanceState> {
  componentDidMount (): void {
    this.props.contracts.Governance.isGovernor(this.props.accounts[0])
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
