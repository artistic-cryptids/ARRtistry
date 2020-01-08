import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';
import { MetadataArtworkCard } from './ArtworkCard';
import ArtworkItem from './ArtworkItem';

const DashboardArtifacts: React.FC = () => {
  const [numTokens, setNumTokens] = React.useState<number>(0);
  const { ArtifactRegistry } = useContractContext();

  React.useEffect(() => {
    if (ArtifactRegistry) {
      ArtifactRegistry.methods.getCurrentTokenId()
        .call()
        .then((tokenId: any) => {
          console.log('number of tokens:' + tokenId);
          setNumTokens(parseInt(tokenId));
        })
        .catch((err: string) => console.log('what is going on:' + err));
    }
  }, [ArtifactRegistry]);

  return (
    <CardColumns>
      {Array.from({ length: numTokens }, (_, key) => <ArtworkItem tokenId={key} key={key}/>)}
      <MetadataArtworkCard>
        <p>Explore More</p>
      </MetadataArtworkCard>
    </CardColumns>
  );
};

export default DashboardArtifacts;
