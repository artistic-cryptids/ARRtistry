import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

const LoadingModal = (props: {show: boolean; title: string}): JSX.Element => {
  return (
    <Modal
      {...props }
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Spinner animation="border" />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
