import * as React from 'react';

import { ContractProps } from '../helper/eth';
import Main from '../components/Main';
import RegisterArtifact from '../components/RegisterArtifact';

const RegisterView: React.FC<ContractProps> = (props) => {
  return (
    <Main page="Register a Piece" parents={['Artifacts']}>
      <RegisterArtifact {...props} />
    </Main>
  );
};

export default RegisterView;
