import * as React from 'react';

import Register from '../components/Register';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const RegisterView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return <Register contracts={contracts!!} accounts={getAccounts(user)}/>;
};

export default RegisterView;
