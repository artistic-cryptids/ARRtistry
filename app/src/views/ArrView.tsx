import * as React from 'react';

import ArrList from '../components/ArrList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';

const ArrView: React.FC = () => {
  return (
    <Main page="ARR" parents={['Management']}>
      <ModeratorOnly>
        <ArrList/>
      </ModeratorOnly>
    </Main>
  );
};

export default ArrView;
