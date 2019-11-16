import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import { ContractProps } from '../helper/eth';
import ENSName from './common/ENSName';

interface SoldArtworkItemProps extends ContractProps {
  soldFor: number;
  soldTo: string;
  tokenId: number;
}

type SoldArtworkItemState = {
  artwork: any;
}

class SoldArtworkItem extends React.Component<SoldArtworkItemProps, SoldArtworkItemState> {
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
        >
          <Row>
            <span className="text-muted text-capitalize">Sold To:</span>
            <ENSName
              address={this.props.soldTo}
              contracts={this.props.contracts}
              accounts={this.props.accounts}
            />
            <br/>
            <span className="text-muted text-capitalize">Sold For: &euro;</span>{this.props.soldFor / 100}
            <br/>
          </Row>
        </ArtworkInfo>
      </ListGroup.Item>
    );
  }
}

export default SoldArtworkItem;
