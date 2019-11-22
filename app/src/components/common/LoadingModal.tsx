import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import CenterSpinner from './CenterSpinner';

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
        <CenterSpinner/>
      </Modal.Body>
    </Modal>
  );
};

export default LoadingModal;
