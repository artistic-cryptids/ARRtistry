import * as React from 'react';
import ArtworkInfo, { Artwork } from './ArtworkInfo';
import TransferArtifact from './TransferArtifact';
import ConsignArtifact from './ConsignArtifact';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ArtworkCard from './ArtworkCard';
import { useContractContext } from '../providers/ContractProvider';

interface ArtworkItemProps {
  tokenId: number;
  ownedArtifact?: true;
  fullscreen?: true;
}

const ArtworkItem: React.FC<ArtworkItemProps> = ({ tokenId, ownedArtifact, fullscreen }) => {
  const [artwork, setArtwork] = React.useState<Artwork>();
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
    return <ArtworkCard img='https://file.globalupload.io/HO8sN3I2nJ.png'/>;
  }

  console.log('Artwork', artwork);

  return (
    <ArtworkInfo
      artwork={artwork}
      id={tokenId}
      fullscreen={fullscreen}
    >
      <div className="text-center">
        <ButtonGroup>
          <TransferArtifact
            tokenId={tokenId}
            metaUri={artwork.metaUri}
          />
          {ownedArtifact && <ConsignArtifact
            tokenId={tokenId}
          />}
        </ButtonGroup>
      </div>
    </ArtworkInfo>
  );
};

export default ArtworkItem;
