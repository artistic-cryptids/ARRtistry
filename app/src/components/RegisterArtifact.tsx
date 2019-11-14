import {
  RegisterForm,
  RegisterOnSubmit,
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
import FileList from './register/FileList';
import { TextFields, ErrorMessages, DEFAULT_ERRORS } from '../providers/FormProvider';
import { useFilesContext } from '../providers/FileProvider';
import { IPFS_URL_START, saveSingleToIPFS } from '../helper/ipfs';

const registerValidator: (textFields: TextFields) => ErrorMessages = (_fields) => {
  return DEFAULT_ERRORS;
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
  const { setImage } = useFilesContext();
  return <DropZone popup callback={(hash: string) => {
    setImage(hash);
  }}/>;
};

interface ArtifactDocument {
  filename: string;
  metauri: string;
}

interface ArtifactMetadata {
  title: string;
  artistId: string;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
  previousSalePrice: number;
  imageIpfsHash: string;
  saleProvenance: string[];
  documents: ArtifactDocument[];
}

const RegisterArtifact: React.FC<ContractProps> = ({ contracts, accounts }) => {
  const onSubmit: RegisterOnSubmit = ({ files, fields }): void => {
    const currentAccount = accounts[0];
    const artist = accounts[0];

    const jsonData: ArtifactMetadata = {
      ...fields,
      previousSalePrice: 0,
      saleProvenance: [],
      imageIpfsHash: files.image,
      documents: files.documents.map((ipfsDocument) => {
        return {
          filename: ipfsDocument.filename,
          metauri: IPFS_URL_START + ipfsDocument.metauri,
        };
      }),
    };

    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    saveSingleToIPFS(jsonDataBuffer, (hash: string) => {
      contracts.ArtifactApplication.applyFor(
        currentAccount,
        artist,
        IPFS_URL_START + hash,
        {
          from: accounts[0],
          gasLimit: 6000000,
        },
      ).catch((err: any) => {
        // rejection, usually
        console.log('register error', err);
      });
    });
  };

  return (
    <ArtistProvider artistContract={contracts.Artists}>
      <RegisterForm validator={registerValidator} onSubmit={onSubmit}>
        <Row>
          <Col sm={4}>
            <ImageDropZone/>
            <hr/>
            <FileList/>
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
