import * as React from 'react';
import ProposalList from './ProposalList';
import ARRList from './ARRList';
import Container from 'react-bootstrap/Container';
import { Alert } from 'react-bootstrap';

interface GovernanceProps {
  drizzle: any;
  drizzleState: any;
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
          <h2> You are an approved moderator. </h2>
          <Alert variant = 'info'>Proposals List:</Alert>
          <ProposalList drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
          <Alert variant = 'info'>ARR List:</Alert>
          <ARRList drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
        </Container>
      );
    }

    return (
      <span>You are not an approved moderator</span>
    );
  }
}

export default Governance;
