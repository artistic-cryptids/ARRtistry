import * as React from 'react';

import ProposalList from '../components/ProposalList';
import ModeratorOnly from '../components/ModeratorOnly';
import { Drizzled } from 'drizzle';

const ProposalView: React.FC<Drizzled> = (props) => {
  const { drizzle, drizzleState } = props;
  return (
    <ModeratorOnly drizzle={drizzle} drizzleState={drizzleState}>
      <ProposalList drizzle={drizzle} drizzleState={drizzleState}/>
    </ModeratorOnly>
  );
};

export default ProposalView;
