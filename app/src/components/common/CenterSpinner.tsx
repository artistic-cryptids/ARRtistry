import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const CenterSpinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Spinner animation="grow" />
    </div>
  );
};

export default CenterSpinner;
