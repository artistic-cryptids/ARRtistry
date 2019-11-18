import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import LoadingModal from './LoadingModal';

interface TransactionLoadingModalProps {
  submitted: boolean;
  title: string;
}

class TransactionLoadingModal extends React.Component<TransactionLoadingModalProps, {}> {
  render (): React.ReactNode {
    return (
      <Fade in={this.props.submitted}>
        <LoadingModal
          show={this.props.submitted}
          title={this.props.title}
        />
      </Fade>
    );
  }
}

export default TransactionLoadingModal;
