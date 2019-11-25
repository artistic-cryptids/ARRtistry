import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import Main from '../components/Main';

const ProposalView: React.FC = () => {
  return (
    <Main page="Artifact Requests" parents={['Management']}>
      <ModeratorOnly>
        <ProposalList/>
      </ModeratorOnly>
    </Main>
  );
};

export default ProposalView;
