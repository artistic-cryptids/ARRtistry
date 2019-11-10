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
    const governance = this.props.contracts.Governance;
    const currentAccount = this.props.accounts[0];
    let eventsFound = 0;
    let eventArray:any[] = [];
    let tokensArray = [];

    governance.getPastEvents('RecordARR', {
      filter: { from: currentAccount },
    }, function (error: any, events: any) {
      if (error) {

      }
      console.log(events.length);
      eventsFound = events.length;
      eventArray = events;
    },
    );
    for (let i = 0; i < eventsFound; i++) {
      tokensArray.push(eventArray[i][0][3]);
    }
    this.setState({
      balance: eventsFound,
      tokenIds: tokensArray,
    });
    this.shouldComponentUpdate();
  }

  shouldComponentUpdate (): boolean {
    return true;
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
