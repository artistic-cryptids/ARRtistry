import * as React from 'react';
import ARRItem from './ARRItem';
import CardColumns from 'react-bootstrap/CardColumns';

interface ARRListProps {
  contracts: any;
  accounts: Array<string>;
}

interface ARRListState {
  ids: string[];
}

class ARRList extends React.Component<ARRListProps, ARRListState> {
  constructor (props: ARRListProps) {
    super(props);
    this.state = { ids: [] };
  }

  componentDidMount (): void {
    this.loadARRs();
  }

  shouldComponentUpdate (): boolean {
    this.loadARRs();
    return true;
  }

  async loadARRs (): Promise<void> {
    const len = await this.props.contracts.Governance.getARRLength();

    const ids = [];
    for (let i = 0; i < len; i++) {
      ids.push(i.toString());
    }
    if (!this.state || this.state.ids !== ids) {
      this.setState({ ids: ids });
    }
  }

  render (): React.ReactNode {
    const listItems = this.state.ids.map((id: any) =>
      <ARRItem
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

export default ARRList;
