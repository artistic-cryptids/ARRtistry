import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import { Drizzled } from 'drizzle';

const ARRView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return (
    <ModeratorOnly drizzle={drizzle} drizzleState={drizzleState}>
      <ARRList drizzle={drizzle} drizzleState={drizzleState}/>
    </ModeratorOnly>
  );
};

export default ARRView;
