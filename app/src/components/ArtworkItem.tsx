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
  contracts: any;
  accounts: Array<string>;
}

type ArtworkItemState = {
  artwork: any;
}

class ArtworkItem extends React.Component<ArtworkItemProps, ArtworkItemState> {
  componentDidMount (): void {
    const registry = this.props.contracts.ArtifactRegistry;
    registry.getArtifactForToken(this.props.tokenId)
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
          contracts={this.props.contracts}
          accounts={this.props.accounts}
          artwork={this.state.artwork}
          id={this.props.tokenId}
          drizzle={this.props.drizzle}
          drizzleState={this.props.drizzleState}
        >
          <Row>
            <Col>
              <TransferArtifact
                contracts={this.props.contracts}
                accounts={this.props.accounts}
                drizzle={this.props.drizzle}
                drizzleState={this.props.drizzleState}
                tokenId={this.props.tokenId}
                metaUri={this.state.artwork.metaUri}
              />
            </Col>
            {this.props.isOwnedArtifact
              ? <Col>
                <ConsignArtifact
                  contracts={this.props.contracts}
                  accounts={this.props.accounts}
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
