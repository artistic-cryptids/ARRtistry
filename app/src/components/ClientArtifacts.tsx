import * as React from 'react';
import ArtworkItem from './ArtworkItem';
import CardColumns from 'react-bootstrap/CardColumns';
import Container from 'react-bootstrap/Container';
import { ContractProps } from '../helper/eth';

interface ClientArtifactsState {
  numClientArtifacts: number;
  tokenIds: Array<number>;
}

class ClientArtifacts extends
  React.Component<ContractProps, ClientArtifactsState> {
  constructor (props: ContractProps) {
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
    const artifactRegistry = this.props.contracts.ArtifactRegistry;
    const currentAccount = this.props.accounts[0];

    artifactRegistry.methods.getOperatorTokenIds(currentAccount)
      .call()
      .then((tokenIdObjects: any) => {
        const tokenIds: number[] = [];
        tokenIdObjects.map((tid: any) => tokenIds.push(tid.toNumber()));
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
        <Container>
          <span>Loading artworks...</span>
        </Container>
      );
    }

    if (!this.state.numClientArtifacts) {
      return (
        <Container>
          <span>No artworks to show, please register one below</span>
        </Container>
      );
    }

    const listItems = this.state.tokenIds.map((tokenId: number) =>
      <ArtworkItem
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        tokenId={tokenId}
        key={tokenId}
      />,
    );

    return (
      <Container>
        <CardColumns>
          {listItems}
        </CardColumns>
      </Container>
    );
  }
}

export default ClientArtifacts;
