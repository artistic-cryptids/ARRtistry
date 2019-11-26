import {
  RegisterForm,
  RegisterOnSubmit,
} from './register/RegisterForm';
import * as React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import FormSubmitButton from './register/FormSubmitButton';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import ArtistSelection from './register/ArtistSelection';
import RegisterFields from './register/RegisterFields';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropZone from './register/DropZone';
import FileList from './register/FileList';
import { TextFields, ErrorMessages, DEFAULT_ERRORS } from '../providers/FormProvider';
import { useFilesContext } from '../providers/FileProvider';
import { IPFS_URL_START, saveSingleToIPFSNoCallBack } from '../helper/ipfs';

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

interface Artist {
  id: number;
  name: string;
  wallet: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
}

const RegisterArtifact: React.FC = () => {
  const [artist, setArtist] = React.useState<Artist>({
    id: 0,
    name: '',
    wallet: '',
    nationality: '',
    birthYear: '',
    deathYear: '',
  });
  const [retrievedData, setRetrievedData] = React.useState<boolean>(false);

  const { ArtifactApplication } = useContractContext();
  const { Artists } = useContractContext();
  const { accounts } = useWeb3Context();

  const hashToArtist = async (hash: string): Promise<Artist> => {
    const response = await fetch(hash);
    return response.json();
  };

  const onSubmit: RegisterOnSubmit = async ({ files, fields }): Promise<void> => {
    const getArtistInfo = (): void => {
      if (!fields.artistId && retrievedData) {
        return;
      }

      Artists.methods.getArtist(fields.artistId)
        .call()
        .then((hash: string) => hashToArtist(hash))
        .then((artist: Artist) => {
          setArtist(artist);
          setRetrievedData(true);
        })
        .catch(console.log);
    };

    const currentAccount = accounts[0];
    getArtistInfo();
    let artistAddr = artist.wallet;
    if (artistAddr === '') {
      artistAddr = '0x0000000000000000000000000000000000000000';
    }

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
    const hash = await saveSingleToIPFSNoCallBack(jsonDataBuffer);
    await ArtifactApplication.methods.applyFor(
      currentAccount,
      artistAddr,
      IPFS_URL_START + hash,
    ).send(
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ).catch((err: any) => {
      // rejection, usually
      console.log('register error', err);
    });
  };

  return (
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
  );
};

export default RegisterArtifact;
