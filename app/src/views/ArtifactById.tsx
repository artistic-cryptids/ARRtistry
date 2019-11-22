import * as React from 'react';
import { ContractProps } from '../helper/eth';
import Main from '../components/Main';
import ArtworkItem from '../components/ArtworkItem';

interface ArtifactViewProps extends ContractProps {
  id: number;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ id, contracts, accounts }) => {
  return (
    <Main page={`#${id}`} parents={['Artifacts', 'Owned']}>
      <ArtworkItem
        contracts={contracts}
        accounts={accounts}
        tokenId={id}
        ownedArtifact
        fullscreen
      />
    </Main>
  );
};

export default ArtifactView;
