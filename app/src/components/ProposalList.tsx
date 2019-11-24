import * as React from 'react';
import ProposalItem from './ProposalItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface ProposalListState {
  ids: string[];
}

class ProposalList extends React.Component<ContractProps, ProposalListState> {
  constructor (props: ContractProps) {
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
    const idsAsObjects = await this.props.contracts.Governance.methods.getProposals().call();
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
