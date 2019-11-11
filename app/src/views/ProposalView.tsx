import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import { ContractProps } from '../helper/eth';

const ProposalView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <ModeratorOnly contracts={contracts} accounts={accounts}>
      <ProposalList contracts={contracts} accounts={accounts}/>
    </ModeratorOnly>
  );
};

export default ProposalView;
