import * as React from 'react';
import SoldArtworkList from '../components/SoldArtworkList';
import Main from '../components/Main';

const SoldArtifactView: React.FC = () => {
  return (
    <Main page="Sold Artifacts" parents={['Artifacts']}>
      <SoldArtworkList/>
    </Main>
  );
};

export default SoldArtifactView;
