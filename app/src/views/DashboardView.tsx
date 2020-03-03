import * as React from 'react';

import Main from '../components/Main';
import DashboardArtifacts from '../components/DashboardArtifacts';
import {logTransactionData} from "../helper/arweave";

const DashboardView: React.FC = () => {

  logTransactionData('dsrNnlSnnlTo0t6dTjdUN-_gJbf4r1TeyMwJe2EN0P4');

  return (
    <Main page='Featured Artifacts' parents={['Dashboards']}>
      <DashboardArtifacts/>
    </Main>
  );
};

export default DashboardView;
