import * as React from 'react';

import Main from '../components/Main';
import DashboardArtifacts from '../components/DashboardArtifacts';

const DashboardView: React.FC = () => {
  return (
    <Main page='Featured Artifacts' parents={['Dashboards']}>
      <DashboardArtifacts/>
    </Main>
  );
};

export default DashboardView;
