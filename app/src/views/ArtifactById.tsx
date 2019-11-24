import * as React from 'react';
import Main from '../components/Main';
import ArtworkItem from '../components/ArtworkItem';

interface ArtifactViewProps {
  id: number;
}

const ArtifactView: React.FC<ArtifactViewProps> = ({ id }) => {
  return (
    <Main page={`#${id}`} parents={['Artifacts', 'Owned']}>
      <ArtworkItem
        tokenId={id}
        ownedArtifact
        fullscreen
      />
    </Main>
  );
};

export default ArtifactView;
