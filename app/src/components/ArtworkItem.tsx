import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import TransferArtifact from './TransferArtifact';
import ConsignArtifact from './ConsignArtifact';
import { ContractProps } from '../helper/eth';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

interface ArtworkItemProps extends ContractProps {
  tokenId: number;
  isOwnedArtifact: boolean;
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
      <ArtworkInfo
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        artwork={this.state.artwork}
        id={this.props.tokenId}
      >
        <div className="text-center">
          <ButtonGroup>
            <TransferArtifact
              contracts={this.props.contracts}
              accounts={this.props.accounts}
              tokenId={this.props.tokenId}
              metaUri={this.state.artwork.metaUri}
            />
            {this.props.isOwnedArtifact
              ? <ConsignArtifact
                contracts={this.props.contracts}
                accounts={this.props.accounts}
                tokenId={this.props.tokenId}
              />
              : null}
          </ButtonGroup>
        </div>
      </ArtworkInfo>
    );
  }
}

export default ArtworkItem;
