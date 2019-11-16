import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const ProposalView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts, ens } = props;
  return (
    <Main page="Artifact Requests" parents={['Management']}>
      <ModeratorOnly contracts={contracts} accounts={accounts} ens={ens}>
        <ProposalList contracts={contracts} accounts={accounts} ens={ens}/>
      </ModeratorOnly>
    </Main>
  );
};

export default ProposalView;
