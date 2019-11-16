import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import Main from '../components/Main';
import { ContractProps } from '../helper/eth';

const RegisterArtistView: React.FC<ContractProps> = (props) => {
  const { contracts, accounts } = props;
  return (
    <Main page="New" parents={['Management', 'Artists']}>
      <RegisterArtist contracts={contracts} accounts={accounts}/>
    </Main>
  );
};

export default RegisterArtistView;
