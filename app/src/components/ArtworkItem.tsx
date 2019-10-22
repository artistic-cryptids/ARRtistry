import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ArtworkInfo from './ArtworkInfo';

interface ArtworkItemProps {
  drizzle: any;
  drizzleState: any;
  id: any;
}

type ArtworkItemState = {
  artwork: any;
}

class ArtworkItem extends React.Component<ArtworkItemProps, ArtworkItemState> {
  componentDidMount () {
    this.props.drizzle.contracts.ArtifactRegistry.methods.tokenOfOwnerByIndex(
      this.props.drizzleState.accounts[0], this.props.id)
      .call()
      .then((tokenId: any) => this.props.drizzle.contracts.ArtifactRegistry.methods.getArtifactForToken(tokenId).call())
      .then((artworkData: any) => {
        const artwork = {
          title: artworkData[1],
          medium: artworkData[2],
          edition: artworkData[3],
          created: artworkData[4],
          metaUri: artworkData[5],
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

    return <ListItem alignItems="flex-start" key={this.props.id}>
      <ArtworkInfo artwork={this.state.artwork} id={this.props.id}/>
    </ListItem>;
  }
}

export default ArtworkItem;
