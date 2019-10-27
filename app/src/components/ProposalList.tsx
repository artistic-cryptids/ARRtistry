import * as React from 'react';
import ProposalItem from './ProposalItem';
import CardColumns from 'react-bootstrap/CardColumns';

interface ProposalListProps {
  drizzle: any;
  drizzleState: any;
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
    const ids = await this.props.drizzle.contracts.Governance.methods.getProposals().call();
    if (!this.state || this.state.ids !== ids) {
      this.setState({ ids: ids });
    }
  }

  render (): React.ReactNode {
    const listItems = this.state.ids.map((id: any) =>
      <ProposalItem
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
