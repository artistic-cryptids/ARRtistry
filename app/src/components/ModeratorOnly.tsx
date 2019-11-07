import * as React from 'react';
import Container from 'react-bootstrap/Container';

interface GovernanceProps {
  drizzle: any;
  drizzleState: any;
<<<<<<< HEAD:app/src/components/ModeratorOnly.tsx
  children: React.ReactNode | React.ReactNode[];
=======
  contracts: any;
  accounts: Array<string>;
>>>>>>> Passed all contract abstractions and account details through all components. Also replaced Drizzle calls in Governance and ProposalList components:app/src/components/Governance.tsx
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
    const contracts = this.props.contracts;
    const accounts = this.props.accounts;
    if (!this.state || this.state.isGovernor) {
      return (
        <Container>
<<<<<<< HEAD:app/src/components/ModeratorOnly.tsx
          {this.props.children}
=======
          <h2> You are an approved moderator. </h2>
          <Alert variant = 'info'>Proposals List:</Alert>
          <ProposalList accounts={accounts} contracts={contracts} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
          <Alert variant = 'info'>ARR List:</Alert>
          <ARRList accounts={accounts} contracts={contracts} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState}/>
>>>>>>> Passed all contract abstractions and account details through all components. Also replaced Drizzle calls in Governance and ProposalList components:app/src/components/Governance.tsx
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
