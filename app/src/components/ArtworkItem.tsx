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
  componentDidMount (): void {
    this.props.drizzle.contracts.ArtifactRegistry.methods.tokenOfOwnerByIndex(
      this.props.drizzleState.accounts[0], this.props.id)
      .call()
      .then((tokenId: any) => this.props.drizzle.contracts.ArtifactRegistry.methods.getArtifactForToken(tokenId).call())
      .then((artworkData: any) => {
        const artwork = {
          artistName: artworkData[1],
          artistNationality: artworkData[2],
          title: artworkData[3],
          createdDate: artworkData[4],
          medium: artworkData[5],
          size: artworkData[6],
          edition: artworkData[7]
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
