import * as React from 'react';
import SoldArtworkItem from './SoldArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface SoldArtworkListState {
  balance: number;
  tokenIds: Array<number>;
}

class SoldArtworkList extends React.Component<ContractProps, SoldArtworkListState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      balance: 0,
      tokenIds: [],
    };
  }

  componentDidMount (): void {
    this.loadSales();
  }

  shouldComponentUpdate (): boolean {
    this.loadSales();
    return true;
  }

  async loadSales (): Promise<void> {
    const governance = this.props.contracts.Governance;
    const currentAccount = this.props.accounts[0];
    let eventsFound = 0;
    const eventArray: any[] = [];
    const tokensArray: any[] = [];

    await governance.getPastEvents(
      'RecordARR',
      (errors: any, events: any) => {
        if (!errors) {
          for (let i = 0; i < events.length; i++) {
            if (events[i].returnValues.from === currentAccount) {
              eventsFound += 1;
              eventArray.push(events[i]);
              tokensArray.push(eventArray[i].returnValues.tokenId);
            }
          }
        }
      },
    );
    this.setState({
      balance: eventsFound,
      tokenIds: tokensArray,
    });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return (
        <span>Loading artworks...</span>
      );
    }

    if (!this.state.balance) {
      return (
        <span>No sales to display</span>
      );
    }

    const listItems = this.state.tokenIds.map((tokenId: number) =>
      <SoldArtworkItem
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        tokenId={tokenId}
        key={tokenId}
      />,
    );

    return (
      <CardColumns>{listItems}</CardColumns>
    );
  }
}

export default SoldArtworkList;
