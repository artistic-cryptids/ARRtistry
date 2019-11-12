import * as React from 'react';
import SoldArtworkItem from './SoldArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface SoldInformation {
  tokenId: number;
  price: number;
  newOwner: string;
}

interface SoldArtworkListState {
  balance: number;
  soldInformationArray: Array<SoldInformation>;
}

class SoldArtworkList extends React.Component<ContractProps, SoldArtworkListState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      balance: 0,
      soldInformationArray: [],
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
    const soldInfoArray: any[] = [];

    await governance.getPastEvents(
      'RecordARR',
      (errors: any, events: any) => {
        if (!errors) {
          for (let i = 0; i < events.length; i++) {
            if (events[i].returnValues.from === currentAccount) {
              eventsFound += 1;
              const soldInfo: SoldInformation = {
                tokenId: events[i].returnValues.tokenId,
                price: events[i].returnValues.price,
                newOwner: events[i].returnValues.to,
              };
              soldInfoArray.push(soldInfo);
            }
          }
        }
      },
    );
    this.setState({
      balance: eventsFound,
      soldInformationArray: soldInfoArray,
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
          soldFor={this.state.soldInformationArray[i].price}
          soldTo={this.state.soldInformationArray[i].newOwner}
          tokenId={this.state.soldInformationArray[i].tokenId}
          key={this.state.soldInformationArray[i].tokenId}
        />,
      );
    }

    return (
      <CardColumns>{listItems}</CardColumns>
    );
  }
}

export default SoldArtworkList;
