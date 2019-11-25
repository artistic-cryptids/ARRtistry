import * as React from 'react';

import Main from '../components/Main';
import RegisterArtifact from '../components/RegisterArtifact';

const RegisterView: React.FC = () => {
  return (
    <Main page="Register a Piece" parents={['Artifacts']}>
      <RegisterArtifact/>
    </Main>
  );
};

export default RegisterView;
