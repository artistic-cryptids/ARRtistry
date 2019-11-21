import * as React from 'react';
import { ContractProps } from '../helper/eth';
import ArtworkCard from './ArtworkCard';

export interface Artwork {
  metaUri: string;
}

interface ArtworkInfoProps extends ContractProps {
  artwork: Artwork;
  id: number;
  fullscreen?: true;
}

export interface Artist {
  id: number;
  name: string;
  wallet: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
}

export interface ArtworkInfoFields {
  title: string;
  artistId: number;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
  imageIpfsHash: string;
  documents: any;
}

interface ArtworkInfoState {
  artist: Artist;
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
        description: '',
        edition: '',
        artifactCreationDate: '',
        medium: '',
        width: '',
        height: '',
        imageIpfsHash: '',
        documents: [],
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

  hashToArtist = async (hash: string): Promise<Artist> => {
    console.log(hash);
    const response = await fetch(hash);
    return response.json();
  };

  getArtistInfo = (): void => {
    if (!this.state.fields.artistId && this.state.retrievedData) {
      return;
    }

    this.props.contracts.Artists.getArtist(this.state.fields.artistId)
      .then((hash: string) => this.hashToArtist(hash))
      .then((artist: Artist) => this.setState({
        retrievedData: true,
        artist: artist,
      }))
      .catch((err: any) => console.log(err));
  };

  render (): React.ReactNode {
    const fields = this.state.fields;

    const imgSrc = fields.imageIpfsHash === ''
      ? 'https://file.globalupload.io/HO8sN3I2nJ.png'
      : 'https://ipfs.io/ipfs/' + fields.imageIpfsHash;

    if (this.state.retrievedData) {
      return (
        <ArtworkCard
          id={this.props.id}
          img={imgSrc}
          metaUri={this.props.artwork.metaUri}
          fields={this.state.fields}
          artist={this.state.artist}
          fullscreen={this.props.fullscreen}
        >
          {this.props.children}
        </ArtworkCard>
      );
    } else {
      return (
        <ArtworkCard img={imgSrc} fullscreen={this.props.fullscreen}>
          {this.props.children}
        </ArtworkCard>
      );
    }
  }
}

export default ArtworkInfo;
