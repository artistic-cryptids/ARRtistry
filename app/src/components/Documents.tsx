import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';

interface DocumentInfo {
  filename: string;
  metauri: string;
}

interface DocumentsProps {
  documents: DocumentInfo[];
}

interface DocumentsState {
  showDocuments: boolean;
}

export const Documents: React.FC<DocumentsProps> = ({ documents }) => {
  const provenance = documents.map((document: DocumentInfo, index: number) =>
    <ListGroup.Item key={index}>
      <p>Filename: {document.filename}</p>
      <a href={document.metauri} target="_blank" rel="noopener noreferrer">Link</a>
    </ListGroup.Item>,
  );

  return (
    <ListGroup>
      {provenance}
    </ListGroup>
  );
};

export const DocumentsModal: React.FC<DocumentsProps> = (props) => {
  const [show, setShow] = React.useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Documents
      </Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Documents {...props}/>
        </Modal.Body>
      </Modal>
    </>
  );
};
