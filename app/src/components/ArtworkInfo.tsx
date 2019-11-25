import * as React from 'react';
import ArtworkCard from './ArtworkCard';
import { useContractContext } from '../providers/ContractProvider';

export interface Artwork {
  metaUri: string;
}

interface ArtworkInfoProps {
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

const ArtworkInfo: React.FC<ArtworkInfoProps> = ({ artwork, id, fullscreen, children }) => {
  const [artist, setArtist] = React.useState<Artist>({
    id: 0,
    name: '',
    wallet: '',
    nationality: '',
    birthYear: '',
    deathYear: '',
  });
  const [retrievedData, setRetrievedData] = React.useState<boolean>(false);
  const [fields, setFields] = React.useState<ArtworkInfoFields>({
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
  });

  const { Artists } = useContractContext();

  const hashToArtist = async (hash: string): Promise<Artist> => {
    const response = await fetch(hash);
    return response.json();
  };

  React.useEffect(() => {
    const getArtistInfo = (): void => {
      if (!fields.artistId && retrievedData) {
        return;
      }

      Artists.methods.getArtist(fields.artistId)
        .call()
        .then((hash: string) => hashToArtist(hash))
        .then((artist: Artist) => {
          setArtist(artist);
          setRetrievedData(true);
        })
        .catch(console.log);
    };

    const setInfoFromJson = async (): Promise<void> => {
      const metaUri = artwork.metaUri;

      const response = await fetch(metaUri);
      const infoJson = await response.json();
      console.log(infoJson);
      setFields(infoJson);

      getArtistInfo();
    };
    setInfoFromJson();
  }, [Artists, artwork.metaUri, fields, retrievedData]);

  const imgSrc = fields.imageIpfsHash === ''
    ? 'https://file.globalupload.io/HO8sN3I2nJ.png'
    : 'https://ipfs.io/ipfs/' + fields.imageIpfsHash;

  if (retrievedData) {
    return (
      <ArtworkCard
        id={id}
        img={imgSrc}
        metaUri={artwork.metaUri}
        fields={fields}
        artist={artist}
        fullscreen={fullscreen}
      >
        {children}
      </ArtworkCard>
    );
  }

  return (
    <ArtworkCard img={imgSrc} fullscreen={fullscreen}>
      {children}
    </ArtworkCard>
  );
};

export default ArtworkInfo;
