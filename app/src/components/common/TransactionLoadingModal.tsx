import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import LoadingModal from './LoadingModal';

interface TransactionLoadingModalProps {
  drizzleState: any;
  onHide: () => void;
  submitted: boolean;
  title: string;
  transactionStackId: any;
}

class TransactionLoadingModal extends React.Component<TransactionLoadingModalProps, {}> {
  SUBMISSION_STARTED = 10;
  TRANSACTION_REGISTERED = 30;
  TRANSACTION_APPROVED = 60;
  SUBMISSION_FINISHED = 100;

  progress = (): number => {
    const { transactions, transactionStack } = this.props.drizzleState;

    if (this.props.transactionStackId == null && this.props.submitted) {
      return this.SUBMISSION_STARTED;
    }

    const transactionHash = transactionStack[this.props.transactionStackId];
    if (!transactionHash) {
      return this.TRANSACTION_REGISTERED;
    }

    if (!transactions[transactionHash]) {
      return this.TRANSACTION_APPROVED;
    }

    if (transactions[transactionHash].status === 'success') {
      return this.SUBMISSION_FINISHED;
    } else {
      return -1;
    }
  };

  render (): React.ReactNode {
    return (
      <Fade in={this.props.submitted}>
        <LoadingModal
          show={this.props.submitted}
          onHide={this.props.onHide}
          progress={this.progress()}
          title={this.props.title}
        />
      </Fade>
    );
  }
}

export default TransactionLoadingModal;
