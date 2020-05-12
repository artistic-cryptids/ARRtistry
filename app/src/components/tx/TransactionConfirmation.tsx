import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';
import CenterSpinner from '../common/CenterSpinner';
import { TransactionModal } from './index';
import { FlexSeparator } from './FlexSeparator';
import MetamaskIcon from './MetamaskIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const TransactionStarted: React.FC<TransactionModal> = ({
  visible,
  handleClose,
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
        <Modal.Header className="w-100">
          <Modal.Title className="w-100">
            <FlexSeparator>
              <MetamaskIcon/>
              <h4 className="mb-0">Confirm your purchase in [wallet]</h4>
              <Button variant="link" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </FlexSeparator>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="text-center">
            Double check the details here - your transfer cannot be undone.
          </div>
          <div className="pt-3 pb-4">
            <FlexSeparator className="px-3 py-4">
              <CenterSpinner/>
              <div className="d-flex flex-column align-items-end">
                <strong>Waiting for confirmation...</strong>
                <span className="text-muted">Don$apos;t see the MetaMask popup?</span>
              </div>
            </FlexSeparator>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Cancel transfer</Button>
        </Modal.Footer>
      </Modal>
    </Fade>
  );
};

export default TransactionStarted;
