import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import Main from '../components/Main';

const RegisterArtistView: React.FC = () => {
  return (
    <Main page="New" parents={['Management', 'Artists']}>
      <RegisterArtist/>
    </Main>
  );
};

export default RegisterArtistView;
