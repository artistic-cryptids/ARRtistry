import * as React from 'react';
import ArtworkItem from './ArtworkItem';
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

    governance.getPastEvents('RecordARR', {
      filter: { from: currentAccount },
    }, function (error: any, events: any) {
      if (error) {

      }
      console.log(events.length);
    },
    );
    this.shouldComponentUpdate();
  }

  shouldComponentUpdate (): boolean {
    // artifactRegistry.balanceOf(currentAccount)
    //   .then((balanceObj: any) => {
    //     const balance = balanceObj.words[0];
    //     if (!this.state || this.state.balance !== balance) {
    //       this.setState({ balance: balance });
    //       const tokenIds: Array<number> = [];
    //       this.setState({ tokenIds: tokenIds });
    //       for (let i = 0; i < balance; i++) {
    //         artifactRegistry.tokenOfOwnerByIndex(currentAccount, i)
    //           .then((tokenIdObj: any) => {
    //             const tokenId = tokenIdObj.words[0];
    //             tokenIds.push(tokenId);
    //             this.setState({ tokenIds: tokenIds });
    //           })
    //           .catch((err: any) => { console.log(err); });
    //       }
    //     }
    //   })
    //   .catch((err: any) => { console.log(err); });

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
      <ArtworkItem
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        tokenId={tokenId}
        key={tokenId}
        isOwnedArtifact={true}
      />,
    );

    return (
      <CardColumns>{listItems}</CardColumns>
    );
  }
}

export default SoldArtworkList;
