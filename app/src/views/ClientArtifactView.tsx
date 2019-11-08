import * as React from 'react';
import ClientArtifacts from '../components/ClientArtifacts';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const ClientArtifactView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return <ClientArtifacts contracts={contracts!!} accounts={getAccounts(user)}/>;
};

export default ClientArtifactView;
