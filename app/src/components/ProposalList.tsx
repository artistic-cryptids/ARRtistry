import * as React from 'react';
import ProposalItem from './ProposalItem';
import CardColumns from 'react-bootstrap/CardColumns';

interface ProposalListProps {
  drizzle: any;
  drizzleState: any;
  contracts: any;
  accounts: Array<string>;
}

interface ProposalListState {
  ids: string[];
}

class ProposalList extends React.Component<ProposalListProps, ProposalListState> {
  constructor (props: ProposalListProps) {
    super(props);
    this.state = { ids: [] };
  }

  componentDidMount (): void {
    this.loadProposals();
  }

  shouldComponentUpdate (): boolean {
    this.loadProposals();
    return true;
  }

  async loadProposals (): Promise<void> {
<<<<<<< HEAD
    const idsAsObjects = await this.props.contracts.Governance.getProposals();
=======
    const idsAsObjects = await this.props.contracts.Governance.getProposals.call();
>>>>>>> Passed all contract abstractions and account details through all components. Also replaced Drizzle calls in Governance and ProposalList components
    const ids: string[] = [];
    idsAsObjects.map((val: any) => ids.push(val.toString()));
    if (!this.state || this.state.ids !== ids) {
      this.setState({ ids: ids });
    }
  }

  render (): React.ReactNode {
    const listItems = this.state.ids.map((id: any) =>
      <ProposalItem
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
        id={id}
        key={id}
      />,
    );

    return (
      <CardColumns>{listItems}</CardColumns>
    );
  }
}

export default ProposalList;
