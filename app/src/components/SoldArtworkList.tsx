import * as React from 'react';
import SoldArtworkItem from './SoldArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface SoldArtworkListState {
  balance: number;
  tokenIds: Array<number>;
  prices: Array<number>;
  newOwners: Array<string>;
}

class SoldArtworkList extends React.Component<ContractProps, SoldArtworkListState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      balance: 0,
      tokenIds: [],
      prices: [],
      newOwners: [],
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
    const tokensArray: any[] = [];
    const priceArray: any[] = [];
    const newOwnerArray: any[] = [];

    await governance.getPastEvents(
      'RecordARR',
      (errors: any, events: any) => {
        if (!errors) {
          for (let i = 0; i < events.length; i++) {
            if (events[i].returnValues.from === currentAccount) {
              eventsFound += 1;
              tokensArray.push(events[i].returnValues.tokenId);
              priceArray.push(events[i].returnValues.price);
              newOwnerArray.push(events[i].returnValues.to);
            }
          }
        }
      },
    );
    this.setState({
      balance: eventsFound,
      tokenIds: tokensArray,
      prices: priceArray,
      newOwners: newOwnerArray,
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

    const listItems = [];

    for (let i = 0; i < this.state.balance; i++) {
      listItems.push(
        <SoldArtworkItem
          contracts={this.props.contracts}
          accounts={this.props.accounts}
          soldFor={this.state.prices[i]}
          soldTo={this.state.newOwners[i]}
          tokenId={this.state.tokenIds[i]}
          key={this.state.tokenIds[i]}
        />,
      );
    }

    return (
      <CardColumns>{listItems}</CardColumns>
    );
  }
}

export default SoldArtworkList;
