import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import * as React from 'react';
import * as styles from './FileList.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { saveSingleToIPFS } from '../../helper/ipfs';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import { useFilesContext, IpfsDocument } from '../../providers/FileProvider';
import _ from 'lodash';

const FileUploadButton: React.FC = () => {
  const { files, setDocuments } = useFilesContext();

  const upload = (file: File): void => {
    const reader = new FileReader();

    const setHash = (hash: string): void => {
      const documents = _.map(files.documents, (document: IpfsDocument) => {
        if (document.filename === file.name) {
          document.metauri = hash;
        }
        return document;
      });

      setDocuments(documents);
    };

    reader.addEventListener('loadend', () => {
      saveSingleToIPFS(reader.result, setHash);
    });
    reader.readAsArrayBuffer(file);
  };

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
      upload(file);
    }

    setDocuments(documents);
  };

  return (
    <>
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
          if (files != null && files.length > 0 && files[0].size < 1000000) {
            onDrop(files);
          } else {
          // TODO: nicer way of alerting
            alert('Image cannot be greater than 1 MB!');
          }
        }}
      />
      <Button>
      Additional Documents
      </Button>
    </>);
};

const FileList: React.FC = () => {
  const { files, setDocuments } = useFilesContext();

  const removeFile = (index: number): void => {
    const documents = files.documents;
    documents.splice(index, 1);
    setDocuments(documents);
  };

  return <div className="text-center pt-3">
    <ListGroup className={styles.fileList}>
      {files.documents.map((document: IpfsDocument, index: number) => {
        return <ListGroup.Item key={index} className={'d-flex justify-content-between align-items-center'}>
          {document.filename}
          <Row>
            <ProgressBar label={document.metauri} now={document.metauri ? 100 : 10} srOnly/>
            <Button variant="link" className="badge badge-danger badge-pill" onClick={() => removeFile(index)}>
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </Row>
        </ListGroup.Item>;
      })}
      <div className={styles.fileFooter}>
        <FileUploadButton />
      </div>
    </ListGroup>
  </div>;
};

export default FileList;
