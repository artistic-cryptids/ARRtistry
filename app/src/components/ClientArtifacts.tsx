import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import ListGroup from 'react-bootstrap/ListGroup';

interface ClientArtifactsProps {
  drizzle: any;
  drizzleState: any;
}

interface ClientArtifactsState {
  numClientArtifacts: number;
  tokenIds: Array<number>;
}

class ClientArtifacts extends
  React.Component<ClientArtifactsProps, ClientArtifactsState> {
  constructor (props: ClientArtifactsProps) {
    super(props);
    this.state = {
      numClientArtifacts: 0,
      tokenIds: [],
    };
  }

  componentDidMount (): void {
    this.shouldComponentUpdate();
  }

  shouldComponentUpdate (): boolean {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;
    const currentAccount = this.props.drizzleState.accounts[0];

    artifactRegistry.methods.getOperatorTokenIds(currentAccount)
      .call()
      .then((tokenIds: any) => {
        if (tokenIds.length !== this.state.numClientArtifacts) {
          this.setState({
            numClientArtifacts: tokenIds.length,
            tokenIds: tokenIds,
          });
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

    if (!this.state.numClientArtifacts) {
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
        isOwnedArtifact={false}
      />,
    );

    return (
      <ListGroup>{listItems}</ListGroup>
    );
  }
}

export default ClientArtifacts;
