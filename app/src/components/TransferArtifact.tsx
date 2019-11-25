import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ipfs from '../helper/ipfs';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

interface TransferArtifactProps {
  tokenId: number;
  metaUri: string;
}

interface TransferArtifactFormFields {
  recipientName: string;
  price: string;
  location: string;
  date: string;
}

interface TransferArtifactState {
  fields: TransferArtifactFormFields;
  showTransferForm: boolean;
  submitted: boolean;
}

type InputChangeEvent = React.FormEvent<any> &
  {
    target: {
      id: keyof TransferArtifactFormFields;
      value: TransferArtifactFormFields[keyof TransferArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

const LOCATIONS = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Iceland',
  'Ireland',
  'Italy',
  'Latvia',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Norway',
  'Poland',
  'Portugal',
  'Romania',
  'Slovak Republic',
  'Slovenia',
  'Spain',
  'Sweden',
  'United Kingdom',
];

const TransferArtifact: React.FC<TransferArtifactProps> = ({ tokenId, metaUri }) => {
  const [fields, setFields] = React.useState<TransferArtifactFormFields>({
    recipientName: '',
    price: '',
    location: LOCATIONS[0],
    date: '',
  });
  const [showTransferForm, setShowTransferForm] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const { addressFromName } = useNameServiceContext();
  const { ArtifactRegistry } = useContractContext();
  const { accounts } = useWeb3Context();

  const saveMetaData = (jsonData: string): Promise<string> => {
    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    return ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => 'https://ipfs.io/ipfs/' + response[0].hash);
  };

  const addProvenance = (price: string, buyers: string[],
    seller: string, location: string, date: string): Promise<string> => {
    return fetch(metaUri)
      .then((response: any) => response.json())
      .then((jsonData: any) => {
        jsonData.previousSalePrice = price;
        jsonData.saleProvenance.push({
          price: (parseFloat(price) * 100).toString(),
          location: location,
          buyers: buyers,
          seller: seller,
          date: date,
        });

        return saveMetaData(jsonData);
      });
  };

  const transferArtwork = async (_: React.FormEvent): Promise<void> => {
    let owner = '';
    setSubmitted(true);

    const recipientAddress = await addressFromName(fields.recipientName);
    const address = await ArtifactRegistry.methods.ownerOf(tokenId).call();
    owner = address;
    const provenanceHash = await addProvenance(
      fields.price,
      [recipientAddress],
      owner,
      fields.location,
      fields.date,
    );

    ArtifactRegistry.methods.transfer(
      owner,
      recipientAddress,
      tokenId,
      provenanceHash,
      (parseFloat(fields.price) * 100).toString(),
      fields.location,
      fields.date,
    ).send(
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ).then(() => {
      setSubmitted(false);
    }).catch((err: any) => {
      // rejection, usually
      console.log(err);
      setSubmitted(false);
    });
  };

  const inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: fields as Pick<TransferArtifactFormFields, keyof TransferArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    setFields(stateUpdate.fields);
  };

  const handleShow = (): void => {
    setShowTransferForm(true);
  };

  const handleCancel = (): void => {
    setFields({
      recipientName: '',
      price: '',
      location: LOCATIONS[0],
      date: '',
    });
    setShowTransferForm(false);
  };

  const locationOptions = (): JSX.Element[] => {
    return LOCATIONS.map((location, index) =>
      <option key={index}>{location}</option>,
    );
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Register Sale
      </Button>
      <Modal show={showTransferForm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Register Sale of Artifact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Col} controlId="recipientName">
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="example.artistry.test"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
          <Form.Group as={Col} controlId="price">
            <Form.Label>Price (Euros)</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
          <Form.Group as={Col} controlId="location">
            <Form.Label>Sale Location</Form.Label>
            <Form.Label className="mb-2 text-muted">If you do not see your sale location listed below it
              might be the case the artist is not eligible for ARR</Form.Label>
            <Form.Control
              required
              as="select"
              onChange={inputChangeHandler}>
              {locationOptions()}
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="date">
            <Form.Label>Date (YYYY-MM-DD)</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={transferArtwork}>
            Register Sale
          </Button>
        </Modal.Footer>
      </Modal>
      <TransactionLoadingModal
        submitted={submitted}
        title="Registering sale..."
      />
    </>
  );
};

export default TransferArtifact;
