import * as React from 'react';
import ARRItem from './ARRItem';
import CardColumns from 'react-bootstrap/CardColumns';

interface ARRListProps {
  drizzle: any;
  drizzleState: any;
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
    const len = await this.props.drizzle.contracts.Governance.methods.getARRLength().call();

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

export default ARRList;
