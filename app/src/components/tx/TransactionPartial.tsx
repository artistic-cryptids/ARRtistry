import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { TransactionModal, ARRState } from './index';
import { FlexSeparator } from './FlexSeparator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TransactionPartialProps extends TransactionModal {
  arr: ARRState;
  payArr: VoidFunction;
}

const TransactionPartial: React.FC<TransactionPartialProps> = ({
  visible,
  handleClose,
  arr: {
    arrDue,
  },
  payArr,
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
        <Modal.Header className="border-top-warning w-100">
          <Modal.Title className="w-100">
            <FlexSeparator>
              <span className="text-warning">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </span>
              <h4 className="mb-0">ARR Due</h4>
              <Button variant="link" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </FlexSeparator>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="text-center">
          You are required to pay €{arrDue / 100} of ARR.
          You have the option to pay it now using a EURS stable coin.
          If you do not pay now, you will still be required to pay later.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Delay ARR</Button>
          <Button variant="primary" onClick={payArr}>Pay now</Button>
        </Modal.Footer>
      </Modal>
    </Fade>
  );
};

export default TransactionPartial;
