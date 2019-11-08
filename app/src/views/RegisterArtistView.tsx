import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import { useArrtistryContext } from '../providers/ArrtistryProvider';
import { getAccounts } from '../helpers/user';

const RegisterArtistView: React.FC = () => {
  const { contracts, user } = useArrtistryContext();
  return <RegisterArtist contracts={contracts!!} accounts={getAccounts(user)}/>;
};

export default RegisterArtistView;
