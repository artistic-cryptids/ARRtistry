import * as React from 'react';
import Container from 'react-bootstrap/Container';
import { ContractProps } from '../helper/eth';

interface GovernanceProps extends ContractProps {
  children: React.ReactNode | React.ReactNode[];
}

type GovernanceState = {
  isGovernor: false;
}

class Governance extends React.Component<GovernanceProps, GovernanceState> {
  componentDidMount (): void {
    this.props.contracts.Governance.isGovernor(this.props.accounts[0])
      .then((isGovernor: any) => this.setState({ isGovernor: isGovernor }))
      .catch(console.log);
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
