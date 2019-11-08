import * as React from 'react';
import ArtworkList from '../components/ArtworkList';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const ArtifactView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return <ArtworkList contracts={contracts!!} accounts={getAccounts(user)}/>;
};

export default ArtifactView;
