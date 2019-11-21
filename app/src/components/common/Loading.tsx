import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Loading: React.FC = () => {
  return (
    <div className="text-center">
      <Spinner animation="grow"/>
    </div>
  );
};

export default Loading;
