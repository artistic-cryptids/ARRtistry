import * as React from 'react';

import ClientArtifacts from '../components/ClientArtifacts';
import { CommonProps } from 'interfaces';

const ClientArtifactView: React.FC<CommonProps> = (props) => {
  const { contracts, accounts } = props;
  return <ClientArtifacts contracts={contracts} accounts={accounts}/>;
};

export default ClientArtifactView;
