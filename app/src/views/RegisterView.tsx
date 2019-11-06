import * as React from 'react';

import Register from '../components/Register';
import { Drizzled } from 'drizzle';

const RegisterView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return <Register drizzle={drizzle} drizzleState={drizzleState}/>;
};

export default RegisterView;
