import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import { ContractProps } from '../helper/eth';

const ARRView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <ModeratorOnly contracts={contracts} accounts={accounts}>
      <ARRList contracts={contracts} accounts={accounts}/>
    </ModeratorOnly>
  );
};

export default ARRView;
