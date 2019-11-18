import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import { ContractProps } from '../helper/eth';
import BigNumber from 'bignumber.js';

interface ArtworkListState {
  tokenIds: Array<number>;
}

class ArtworkList extends React.Component<ContractProps, ArtworkListState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      tokenIds: [],
    };
  }

  componentDidMount (): void {
    this.shouldComponentUpdate();
  }

  shouldComponentUpdate (): boolean {
    const artifactRegistry = this.props.contracts.ArtifactRegistry;
    const currentAccount = this.props.accounts[0];

    artifactRegistry.getTokenIdsOfOwner(currentAccount)
      .then((tokenIds: Array<BigNumber>) => {
        this.setState({ tokenIds: tokenIds.map((tid: BigNumber) => tid.toNumber()) });
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
