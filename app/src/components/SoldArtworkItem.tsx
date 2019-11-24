import * as React from 'react';
import ArtworkInfo from './ArtworkInfo';
import Form from 'react-bootstrap/Form';
import AddressField from './common/AddressField';
import PlaintextField from './common/PlaintextField';
import { useContractContext } from '../providers/ContractProvider';

interface SoldArtworkItemProps {
  soldFor: number;
  soldTo: string;
  tokenId: number;
}

const SoldArtworkItem: React.FC<SoldArtworkItemProps> = ({ soldFor, soldTo, tokenId }) => {
  const [artwork, setArtwork] = React.useState<any>();

  const { ArtifactRegistry } = useContractContext();

  React.useEffect(() => {
    ArtifactRegistry.methods.getArtifactForToken(tokenId)
      .call()
      .then((artworkData: any) => {
        console.log(artworkData);
        const artwork = {
          metaUri: artworkData[1],
        };
        setArtwork(artwork);
      })
      .catch(console.log);
  }, [ArtifactRegistry, tokenId]);

  if (!artwork) {
    return <p>Loading...</p>;
  }

  console.log('Artwork ' + JSON.stringify(artwork));

  return (
    <ArtworkInfo
      artwork={artwork}
      id={tokenId}
    >
      <Form>
        <AddressField label='Sold to' address={soldTo} />
        <PlaintextField label='Sold for' value={'€ ' + (soldFor / 100).toString()}/>
      </Form>
    </ArtworkInfo>
  );
};

export default SoldArtworkItem;
