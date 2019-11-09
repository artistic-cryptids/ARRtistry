import * as React from 'react';
import ClientArtifacts from '../components/ClientArtifacts';
import { ContractProps } from '../helper/eth';

const ClientArtifactView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <ClientArtifacts contracts={contracts} accounts={accounts}/>;
};

export default ClientArtifactView;
