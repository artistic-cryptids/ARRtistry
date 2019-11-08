import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const ProposalView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return (
    <ModeratorOnly contracts={contracts!!} accounts={getAccounts(user)}>
      <ProposalList contracts={contracts!!} accounts={getAccounts(user)}/>
    </ModeratorOnly>
  );
};

export default ProposalView;
