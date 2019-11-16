import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';

interface ArtworkListState {
  balance: number;
  tokenIds: Array<number>;
}

class ArtworkList extends React.Component<ContractProps, ArtworkListState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      balance: 0,
      tokenIds: [],
    };
  }

  componentDidMount (): void {
    this.shouldComponentUpdate();
  }

  shouldComponentUpdate (): boolean {
    const artifactRegistry = this.props.contracts.ArtifactRegistry;
    const currentAccount = this.props.accounts[0];

    artifactRegistry.balanceOf(currentAccount)
      .then((balanceObj: any) => {
        const balance = balanceObj.toNumber();
        if (!this.state || this.state.balance !== balance) {
          this.setState({ balance: balance });
          const tokenIds: Array<number> = [];
          this.setState({ tokenIds: tokenIds });
          for (let i = 0; i < balance; i++) {
            artifactRegistry.tokenOfOwnerByIndex(currentAccount, i)
              .then((tokenIdObj: any) => {
                const tokenId = tokenIdObj.toNumber();
                tokenIds.push(tokenId);
                this.setState({ tokenIds: tokenIds });
              })
              .catch((err: any) => { console.log(err); });
          }
        }
      })
      .catch((err: any) => { console.log(err); });

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
        <span>No artworks to show, please register one below</span>
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

export default ArtworkList;
