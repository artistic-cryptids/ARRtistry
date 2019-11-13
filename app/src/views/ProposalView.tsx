import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const ProposalView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="Artifact Requests" parents={['Management']}>
      <ModeratorOnly contracts={contracts} accounts={accounts}>
        <ProposalList contracts={contracts} accounts={accounts}/>
      </ModeratorOnly>
    </Main>
  );
};

export default ProposalView;
