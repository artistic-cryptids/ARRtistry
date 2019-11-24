import * as React from 'react';
import ArtworkInfo, { Artwork } from './ArtworkInfo';
import TransferArtifact from './TransferArtifact';
import ConsignArtifact from './ConsignArtifact';
import { ContractProps } from '../helper/eth';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ArtworkCard from './ArtworkCard';

interface ArtworkItemProps extends ContractProps {
  tokenId: number;
  ownedArtifact?: true;
  fullscreen?: true;
}

const ArtworkItem: React.FC<ArtworkItemProps> = ({ contracts, accounts, tokenId, ownedArtifact, fullscreen }) => {
  const [artwork, setArtwork] = React.useState<Artwork>();
  const registry = contracts.ArtifactRegistry;

  React.useEffect(() => {
    registry.methods.getArtifactForToken(tokenId)
      .call()
      .then((artworkData: any) => {
        console.log(artworkData);
        const artwork = {
          metaUri: artworkData[1],
        };
        setArtwork(artwork);
      })
      .catch((err: any) => { console.log(err); });
  }, [registry, tokenId]);

  if (!artwork) {
    return <ArtworkCard img='https://file.globalupload.io/HO8sN3I2nJ.png'/>;
  }

  console.log('Artwork', artwork);

  return (
    <ArtworkInfo
      contracts={contracts}
      accounts={accounts}
      artwork={artwork}
      id={tokenId}
      fullscreen={fullscreen}
    >
      <div className="text-center">
        <ButtonGroup>
          <TransferArtifact
            contracts={contracts}
            accounts={accounts}
            tokenId={tokenId}
            metaUri={artwork.metaUri}
          />
          {ownedArtifact && <ConsignArtifact
            contracts={contracts}
            accounts={accounts}
            tokenId={tokenId}
          />}
        </ButtonGroup>
      </div>
    </ArtworkInfo>
  );
};

export default ArtworkItem;
