import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const ARRView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="ARR" parents={['Management']}>
      <ModeratorOnly contracts={contracts} accounts={accounts}>
        <ARRList contracts={contracts} accounts={accounts}/>
      </ModeratorOnly>
    </Main>
  );
};

export default ARRView;
