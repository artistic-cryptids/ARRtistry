import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import { ContractProps } from '../helper/eth';
import Form from 'react-bootstrap/Form';
import AddressField from './common/AddressField';
import PlaintextField from './common/PlaintextField';

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
      <ArtworkInfo
        contracts={this.props.contracts}
        accounts={this.props.accounts}
        artwork={this.state.artwork}
        id={this.props.tokenId}
      >
        <Form>
          <AddressField label='Sold to' address={this.props.soldTo} />
          <PlaintextField label='Sold for' value={'€ ' + (this.props.soldFor / 100).toString()}/>
        </Form>
      </ArtworkInfo>
    );
  }
}

export default SoldArtworkItem;
