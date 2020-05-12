import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { TransactionModal, Transaction } from './index';
import { FlexSeparator } from './FlexSeparator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TransactionFailureProps extends TransactionModal {
  transaction: Transaction;
}

const TransactionFailure: React.FC<TransactionFailureProps> = ({
  visible,
  handleClose,
  transaction: {
    transactionHash,
  },
}) => {
  return (
    <Fade in={visible}>
      <Modal
        show={visible}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-top-danger w-100">
          <Modal.Title className="w-100">
            <FlexSeparator>
              <span className="text-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </span>
              <h4 className="mb-0">Transfer failed</h4>
              <Button variant="link" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </FlexSeparator>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="text-center">
            We could not confirm your transaction.
            Are you sure you have permissions to transfer this artifact.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" href={`https://rinkeby.etherscan.io/tx/${transactionHash}`}>
            View on Etherscan
          </Button>
          <Button variant="primary" onClick={handleClose}>Return</Button>
        </Modal.Footer>
      </Modal>
    </Fade>
  );
};

export default TransactionFailure;
