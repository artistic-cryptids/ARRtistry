import * as React from 'react';

import Register from '../components/Register';
import { ContractProps } from '../helper/eth';

const RegisterView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <Register contracts={contracts} accounts={accounts}/>;
};

export default RegisterView;
