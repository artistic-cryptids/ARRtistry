import * as React from 'react';
import ClientArtifacts from '../components/ClientArtifacts';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const ClientArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="Client Artifacts" parents={['Management']}>
      <ClientArtifacts contracts={contracts} accounts={accounts}/>
    </Main>
  );
};

export default ClientArtifactView;
