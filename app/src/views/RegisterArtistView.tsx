import * as React from 'react';

import RegisterArtist from '../components/RegisterArtist';
import { Drizzled } from 'drizzle';

const RegisterArtistView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <RegisterArtist drizzle={drizzle} drizzleState={drizzleState}/>;
};

export default RegisterArtistView;
