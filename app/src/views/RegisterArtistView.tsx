import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import { CommonProps } from 'interfaces';

const RegisterArtistView: React.FC<CommonProps> = (props) => {
  const { contracts, accounts } = props;
  return <RegisterArtist contracts={contracts} accounts={accounts}/>;
};

export default RegisterArtistView;
