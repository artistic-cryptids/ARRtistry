import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const ARRView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return (
    <ModeratorOnly contracts={contracts!!} accounts={getAccounts(user)}>
      <ARRList contracts={contracts!!} accounts={getAccounts(user)}/>
    </ModeratorOnly>
  );
};

export default ARRView;
