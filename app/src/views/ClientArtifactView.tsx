import * as React from 'react';
import ClientArtifacts from '../components/ClientArtifacts';
import Main from '../components/Main';

const ClientArtifactView: React.FC = () => {
  return (
    <Main page="Client Artifacts" parents={['Management']}>
      <ClientArtifacts/>
    </Main>
  );
};

export default ClientArtifactView;
