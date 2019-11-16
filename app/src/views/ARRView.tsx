import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const ARRView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts, ens } = props;
  return (
    <Main page="ARR" parents={['Management']}>
      <ModeratorOnly contracts={contracts} accounts={accounts} ens={ens}>
        <ARRList contracts={contracts} accounts={accounts} ens={ens}/>
      </ModeratorOnly>
    </Main>
  );
};

export default ARRView;
