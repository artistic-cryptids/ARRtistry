import * as React from 'react';
import CardColumns from 'react-bootstrap/CardColumns';
import { useContractContext } from '../providers/ContractProvider';
import { BURN_ACCOUNT } from '../helper/eth';
import ArtworkItem from './ArtworkItem';

const DashboardArtifacts: React.FC = () => {
  const [numTokens, setNumTokens] = React.useState<number>(0);
  const [burntTokens, setBurnt] = React.useState<number[]>([]);
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

      ArtifactRegistry.methods.getTokenIdsOfOwner(BURN_ACCOUNT).call()
      .then((tokenIds: number[]) => {
        setBurnt(tokenIds.map(x=>+x))
      })
    }
  }, [ArtifactRegistry]);

  const tokenList = Array.from(Array(numTokens).keys());
  const displayTokens = tokenList.filter(x => !burntTokens.includes(x + 1));

  return (
    <CardColumns>
      {displayTokens.map(i =>
        <ArtworkItem tokenId={i + 1} key={i} ownedArtifact={undefined}/>)}
    </CardColumns>
  );
};

export default DashboardArtifacts;
