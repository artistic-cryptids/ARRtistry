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

class Documents extends React.Component<DocumentsProps, DocumentsState> {
  constructor (props: DocumentsProps) {
    super(props);
    this.state = {
      showDocuments: false,
    };
  }

  handleShow = (): void => {
    this.setState({
      showDocuments: true,
    });
  }

  handleClose = (): void => {
    this.setState({
      showDocuments: false,
    });
  }

  render (): React.ReactNode {
    const provenance = this.props.documents.map((document: DocumentInfo, index: number) =>
      <ListGroup.Item key={index}>
        <p>Filename: {document.filename}</p>
        <a href={document.metauri} target="_blank" rel="noopener noreferrer">Link</a>
      </ListGroup.Item>,
    );

    return (
      <div>
        <Button variant="primary" onClick={this.handleShow}>
          Documents
        </Button>
        <Modal show={this.state.showDocuments} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Documents</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup>
              {provenance}
            </ListGroup>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default Documents;
