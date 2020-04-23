import * as React from 'react';
import ArtworkCard from './ArtworkCard';
import { useContractContext } from '../providers/ContractProvider';
import * as AgnosticArtworkRetriever from '../helper/agnostic';
export interface Artwork {
  proposer: string;
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

export interface ArtworkProvenance {
  price: string; // cents
  location: string;
  buysers: string[];
  seller: string;
  date: string;
}

export interface ArtworkInfoFields {
  name: string;
  artistId: number;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
  image: string;
  documents: any;
  previousSalePrice?: number;
  saleProvenance?: ArtworkProvenance[];
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
    name: '',
    artistId: 0,
    description: '',
    edition: '',
    artifactCreationDate: '',
    medium: '',
    width: '',
    height: '',
    image: '',
    documents: [],
  });

  const { Artists } = useContractContext();

  const hashToArtist = async (hash: string): Promise<Artist> => {
    const response = await fetch(hash);
    return response.json();
  };

  React.useEffect(() => {
    const getArtistInfo = async (): Promise<void> => {
      /* Do not try to get the artist info until the artist id has been retrieved */
      if (fields.artistId === 0) {
        return;
      }

      return Artists.methods.getArtist(fields.artistId)
        .call()
        .then((hash: string) => hashToArtist(hash))
        .then((artist: Artist) => {
          setArtist(artist);
          setRetrievedData(true);
        })
        .catch(console.log);
    };

    const setInfoFromJson = async (): Promise<void> => {
      if (retrievedData) {
        return;
      }

      const data = await AgnosticArtworkRetriever.getArtworkMetadata(artwork.metaUri);
      setFields(data);
      getArtistInfo();
    };
    setInfoFromJson();
  }, [Artists, artwork.metaUri, fields, retrievedData]);

  if (!retrievedData) {
    return (
      <ArtworkCard id={id} fullscreen={fullscreen} placeholder >
        {children}
      </ArtworkCard>
    );
  }
  return (
    <ArtworkCard
      id={id}
      img={fields.image}
      metaUri={artwork.metaUri}
      fields={fields}
      artist={artist}
      fullscreen={fullscreen}
    >
      {children}
    </ArtworkCard>
  );
};

export default ArtworkInfo;
