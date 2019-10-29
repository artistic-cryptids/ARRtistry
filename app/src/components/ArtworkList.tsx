import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import ListGroup from 'react-bootstrap/ListGroup';

interface ArtworkListProps {
  drizzle: any;
  drizzleState: any;
}

interface ArtworkListState {
  balance: number;
  tokenIds: Array<number>;
}

class ArtworkList extends React.Component<ArtworkListProps, ArtworkListState> {
  constructor (props: ArtworkListProps) {
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
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    const currentAccount = this.props.drizzleState.accounts[0];

    // TODO: Replace with a contract function that returns an array of
    //       owned token ids to avoid nested promises.
    artifactRegistry.methods.balanceOf(currentAccount).call()
      .then((balance: number) => {
        console.log('balance is', balance);
        if (!this.state || this.state.balance !== balance) {
          this.setState({ balance: balance });
          const tokenIds: Array<number> = [];
          this.setState({
            tokenIds: tokenIds,
          });
          for (let i = 0; i < balance; i++) {
            artifactRegistry.methods.tokenOfOwnerByIndex(currentAccount, i)
              .call()
              .then((tokenId: any) => {
                tokenIds.push(tokenId);
                this.setState({
                  tokenIds: tokenIds,
                });
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
        drizzle={this.props.drizzle}
        drizzleState={this.props.drizzleState}
        tokenId={tokenId}
        key={tokenId}
      />,
    );

    return (
      <ListGroup>{listItems}</ListGroup>
    );
  }
}

export default ArtworkList;
