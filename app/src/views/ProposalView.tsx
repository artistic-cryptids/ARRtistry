import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import { CommonProps } from '../helper/eth';

const ProposalView: React.FC<CommonProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <ModeratorOnly contracts={contracts} accounts={accounts}>
      <ProposalList contracts={contracts} accounts={accounts}/>
    </ModeratorOnly>
  );
};

export default ProposalView;
