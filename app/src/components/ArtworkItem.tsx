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
  }, [ArtifactRegistry.methods, tokenId]);

  if (!artwork) {
    return <ArtworkCard id={tokenId} img='https://file.globalupload.io/HO8sN3I2nJ.png'/>;
  }

  return (
    <ArtworkInfo
      artwork={artwork}
      id={tokenId}
      fullscreen={fullscreen}
    >
      {ownedArtifact && <div className="text-center">
        <ButtonGroup>
          <TransferArtifact
            tokenId={tokenId}
            metaUri={artwork.metaUri}
          />
          <ConsignArtifact
            tokenId={tokenId}
          />
        </ButtonGroup>
      </div>}
    </ArtworkInfo>
  );
};

export default ArtworkItem;
