import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import { CommonProps } from 'interfaces';

const ARRView: React.FC<CommonProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <ModeratorOnly contracts={contracts} accounts={accounts}>
      <ARRList contracts={contracts} accounts={accounts}/>
    </ModeratorOnly>
  );
};

export default ARRView;
