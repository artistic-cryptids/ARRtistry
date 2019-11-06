import {
  RegisterForm,
  DEFAULT_ERRORS,
  RegisterOnSubmit,
  TextFields,
  ErrorMessages,
  FilesContext,
  Document,
} from './register/RegisterForm';
import * as React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import FormSubmitButton from './register/FormSubmitButton';
import { ArtistProvider } from '../providers/ArtistProvider';
import { ContractProps } from '../helper/eth';
import ArtistSelection from './register/ArtistSelection';
import RegisterFields from './register/RegisterFields';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropZone from './register/DropZone';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';

const registerArtifact: RegisterOnSubmit = async ({ fields }, _event): Promise<void> => {
  console.log(fields);
};

const registerValidator: (textFields: TextFields) => ErrorMessages = (_fields) => {
  return DEFAULT_ERRORS;
};

const FileList: React.FC = () => {
  const { files } = React.useContext(FilesContext);
  return <ListGroup>
    {files.documents.map((document: Document, index: number) => {
      return <ListGroup.Item key={index}>
        <p>filename: {document.filename}</p>
      </ListGroup.Item>;
    })}
  </ListGroup>;
};

const RegisterFieldLayout: React.FC = () => {
  return <>
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Artifact Information
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <RegisterFields/>
            <ArtistSelection/>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <FormSubmitButton/>
  </>;
};

const ImageDropZone: React.FC = () => {
  const { files, setFiles } = React.useContext(FilesContext);
  return <DropZone popup callback={(hash: string) => {
    setFiles({ ...files, image: hash });
  }}/>;
};

const DocumentDropZone: React.FC = () => {
  const { files, setFiles } = React.useContext(FilesContext);

  const onDrop = (acceptedFiles: any): void => {
    const documents = files.documents;
    for (const file of acceptedFiles) {
      let newDoc = true;
      for (const doc of documents) {
        if (doc.filename === file.name) {
          newDoc = false;
          break;
        }
      }

      if (!newDoc) {
        continue;
      }

      documents.push({
        filename: file.name,
        data: file,
      });
    }

    setFiles({
      ...files,
      documents: documents,
    });
  };
  return <div style={{
    position: 'absolute',
    top: '75%',
    left: '50%',
    transform: 'translateX(-50%',
    boxShadow: '0 5px 30px 5px rgba(0, 0, 0, 0.2)',
  }}>
    <input
      className="btn"
      accept="image/*"
      id="image-upload-button"
      multiple
      type="file"
      style={{
        position: 'absolute',
        top: '0',
        left: '0',
        opacity: '0',
      }}
      onChange={(e): void => {
        e.stopPropagation();
        e.preventDefault();
        const files = e.target.files;
        if (files != null && files[0].size < 1000000) {
          // max file size of one megabyte
          onDrop(files);
        } else {
          // TODO: nicer way of alerting
          alert('Image cannot be greater than 1 MB!');
        }
      }}
    />
    <Button>
      Upload Documents
    </Button>
    <FileList/>
  </div>;
};

const RegisterArtifact: React.FC<ContractProps> = ({ contracts }) => {
  return (
    <ArtistProvider artistContract={contracts.Artists}>
      <RegisterForm validator={registerValidator} onSubmit={registerArtifact}>
        <Row>
          <Col sm={4}>
            <ImageDropZone/>
            <DocumentDropZone/>

          </Col>
          <Col sm={8}>
            <RegisterFieldLayout/>
          </Col>
        </Row>
      </RegisterForm>
    </ArtistProvider>
  );
};

export default RegisterArtifact;
