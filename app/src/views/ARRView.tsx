import * as React from 'react';

import ARRList from '../components/ARRList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';

const ARRView: React.FC = () => {
  return (
    <Main page="ARR" parents={['Management']}>
      <ModeratorOnly>
        <ARRList/>
      </ModeratorOnly>
    </Main>
  );
};

export default ARRView;
