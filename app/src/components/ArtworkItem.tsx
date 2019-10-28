import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import ListGroup from 'react-bootstrap/ListGroup';
import TransferArtifact from './TransferArtifact';

interface ArtworkItemProps {
  drizzle: any;
  drizzleState: any;
  tokenId: any;
}

type ArtworkItemState = {
  artwork: any;
}

class ArtworkItem extends React.Component<ArtworkItemProps, ArtworkItemState> {
  componentDidMount (): void {
    const registry = this.props.drizzle.contracts.ArtifactRegistry;
    registry.methods.getArtifactForToken(this.props.tokenId).call()
      .then((artworkData: any) => {
        console.log(artworkData);
        const artwork = {
          title: artworkData[1],
          artistName: artworkData[2],
          artistNationality: artworkData[3],
          artistBirthYear: artworkData[4],
          createdDate: artworkData[5],
          medium: artworkData[6],
          size: artworkData[7],
          imageIpfsHash: artworkData[8],
          metaUri: artworkData[9],
        };
        this.setState({ artwork: artwork });
      })
      .catch((err: any) => { console.log(err); });
  }

  render (): React.ReactNode {
    if (!this.state) {
      return 'Loading...';
    }

    console.log('Artwork ' + JSON.stringify(this.state.artwork));

    return (
      <ListGroup.Item>
        <ArtworkInfo artwork={this.state.artwork} id={this.props.tokenId}>
          <TransferArtifact
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            tokenId={this.props.tokenId}
          />
        </ArtworkInfo>
      </ListGroup.Item>
    );
  }
}

export default ArtworkItem;
