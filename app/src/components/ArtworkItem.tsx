import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import ListGroup from 'react-bootstrap/ListGroup';
import TransferArtifact from './TransferArtifact';
import ConsignArtifact from './ConsignArtifact';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

interface ArtworkItemProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
  isOwnedArtifact: boolean;
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
          metaUri: artworkData[1],
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
        <ArtworkInfo
          artwork={this.state.artwork}
          id={this.props.tokenId}
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        >
          <Row>
            <Col>
              <TransferArtifact
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                tokenId={this.props.tokenId}
                metaUri={this.state.artwork.metaUri}
              />
            </Col>
            {this.props.isOwnedArtifact
              ? <Col>
                <ConsignArtifact
                  drizzle={this.props.drizzle}
                  drizzleState={this.props.drizzleState}
                  tokenId={this.props.tokenId}
                />
              </Col>
              : null}
          </Row>
        </ArtworkInfo>
      </ListGroup.Item>
    );
  }
}

export default ArtworkItem;
