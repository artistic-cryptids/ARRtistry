import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import { ContractProps } from '../helper/eth';

const RegisterArtistView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return <RegisterArtist contracts={contracts} accounts={accounts}/>;
};

export default RegisterArtistView;
