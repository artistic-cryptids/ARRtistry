import * as React from 'react';

import Fade from 'react-bootstrap/Fade';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ArtworkItem from '../ArtworkItem';
import { TransactionModal } from './index';
import { FlexSeparator } from './FlexSeparator';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TransactionSuccessProps extends TransactionModal {
  tokenId?: number;
}

const TransactionSuccess: React.FC<TransactionSuccessProps> = ({
  visible,
  handleClose,
  tokenId,
}) => {
  return (
    <Fade in={visible}>
      <Modal
        show={visible}
        size="lg"
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header className="border-top-success w-100">
          <Modal.Title className="w-100">
            <FlexSeparator>
              <span className="text-success">
                <FontAwesomeIcon icon={faCheckCircle} />
              </span>
              <h4 className="mb-0">Transfer Finished!</h4>
              <Button variant="link" onClick={handleClose}>
                <FontAwesomeIcon icon={faTimes} />
              </Button>
            </FlexSeparator>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-5">
          <div className="text-center">
            Perfect! They should have the Artwork in their wallet.
          </div>
          {tokenId && <ArtworkItem tokenId={tokenId} className="w-50 mx-auto my-4" />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>Done</Button>
        </Modal.Footer>
      </Modal>
    </Fade>
  );
};

export default TransactionSuccess;
