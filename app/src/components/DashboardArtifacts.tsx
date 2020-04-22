import * as React from 'react';
import * as _ from 'lodash';
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
        .catch((err: string) => console.error('DashboardArtifacts::useEffect:', err));

      ArtifactRegistry.methods.getTokenIdsOfOwner(BURN_ACCOUNT).call()
        .then((tokenIds: number[]) => {
          setBurnt(tokenIds.map(x => +x));
        })
        .catch((err: string) => console.error('DashboardArtifacts::useEffect:', err));
    }
  }, [ArtifactRegistry]);

  const tokenList = _.range(numTokens);
  const displayTokens = tokenList.filter(x => !burntTokens.includes(x + 1));

  return (
    <CardColumns>
      {displayTokens.map(i =>
        <ArtworkItem tokenId={i + 1} key={i} ownedArtifact={undefined}/>)}
    </CardColumns>
  );
};

export default DashboardArtifacts;
