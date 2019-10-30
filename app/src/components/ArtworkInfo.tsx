import * as React from 'react';
import Card from 'react-bootstrap/Card';

interface Artwork {
  metaUri: string;
}

interface ArtworkInfoProps {
  drizzle: any;
  drizzleState: any;
  artwork: Artwork;
  id: number;
}

interface Artist {
  id: number
  name: string;
  wallet: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
}

interface ArtworkInfoFields {
  title: string;
  artistId: number;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  size: string;
  imageIpfsHash: string;
}

interface ArtworkInfoState {
  artist: Artist
  metaUri: string;
  retrievedData: boolean;
  fields: ArtworkInfoFields;
}

class ArtworkInfo extends React.Component<ArtworkInfoProps, ArtworkInfoState> {
  constructor (props: any) {
    super(props);

    this.state = {
      artist: {
        id: 0,
        name: '',
        wallet: '',
        nationality: '',
        birthYear: '',
        deathYear: '',
      },
      metaUri: this.props.artwork.metaUri,
      retrievedData: false,
      fields: {
        title: '',
        artistId: 0,
        edition: '',
        artifactCreationDate: '',
        medium: '',
        size: '',
        imageIpfsHash: '',
      },
    };
  }

  componentDidMount (): void {
    this.setInfoFromJson();
  }

  async setInfoFromJson (): Promise<void> {
    const metaUri = this.props.artwork.metaUri;

    const response = await fetch(metaUri);
    const infoJson = await response.json();

    this.setState({
      fields: infoJson,
    });

    this.getArtistInfo();
  }

  infoToArtist = (id: number, info: string[]): Artist => {
    return {
      id: id,
      name: info[0],
      wallet: info[1],
      nationality: info[2],
      birthYear: info[3],
      deathYear: info[4],
    };
  };

  getArtistInfo = (): void => {
    if (!this.state.fields.artistId && this.state.retrievedData) {
      return;
    }

    this.props.drizzle.contracts.Artists.methods.getArtist(this.state.fields.artistId)
      .call()
      .then((info: string[]) => this.infoToArtist(this.state.fields.artistId, info))
      .then((artist: Artist) => this.setState({
        retrievedData: true,
        artist: artist,
      }));
  };

  render (): React.ReactNode {
    const fields = this.state.fields;
    const artist = this.state.artist;
    if (this.state.retrievedData) {
      return (
        <Card className="shadow">
          <Card.Body>
            <Card.Img variant="top" src={'https://ipfs.io/ipfs/' + fields.imageIpfsHash} />
            <Card.Title><span className="text-muted text-capitalize">#{this.props.id} </span>{fields.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{artist.name}</Card.Subtitle>
            <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card&apos;s content.
              {fields.artifactCreationDate}. {fields.medium}
            </Card.Text>
            {this.props.children}
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
      );
    } else {
      return (
        <Card className="shadow">
          <Card.Body>
            <Card.Title><span className="text-muted text-capitalize">#{this.props.id} </span>Loading...</Card.Title>
            <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
            <Card.Text>
              The piece&apos;s info has yet to be retrieved. If it was only just registered,
              it&apos;ll take thirty seconds or so. Otherwise, it should be near instant.
            </Card.Text>
            {this.props.children}
          </Card.Body>
          <Card.Footer>
            <small className="text-muted">Loading...</small>
          </Card.Footer>
        </Card>
      );
    }
  }
}

export default ArtworkInfo;
