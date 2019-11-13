import * as React from 'react';

import Register from '../components/Register';
import { ContractProps } from '../helper/eth';
import Main from '../components/Main';

const RegisterView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="Register a Piece" parents={['Artifacts']}>
      <Register contracts={contracts} accounts={accounts}/>
    </Main>
  );
};

export default RegisterView;
