import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import Main from '../components/Main';

const ArtifactView: React.FC = () => {
  return (
    <Main page="Owned" parents={['Artifacts']}>
      <ArtworkList/>
    </Main>
  );
};

export default ArtifactView;
