import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { IPFS_URL_START, saveSingleToIPFS } from '../helper/ipfs';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';
import { useNameServiceContext } from '../providers/NameServiceProvider';
import Modal from 'react-bootstrap/Modal';

interface RegisterFormFields {
  name: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
  wallet: string;
  metaIpfsHash: string;
}

type InputChangeEvent = React.FormEvent<any> &
  {
    target: {
      id: keyof RegisterFormFields;
      value: RegisterFormFields[keyof RegisterFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

const RegisterArtist: React.FC = () => {
  const [fields, setFields] = React.useState<RegisterFormFields>({
    name: '',
    nationality: '',
    birthYear: '',
    deathYear: '',
    wallet: '',
    metaIpfsHash: '',
  });
  const [validated, setValidated] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [isGovernor, setIsGovernor] = React.useState<boolean>(false);
  const [invalidENS, setInvalidENS] = React.useState<boolean>(false);

  const { Governance, Artists } = useContractContext();
  const { web3, accounts } = useWeb3Context();
  const { addressFromName } = useNameServiceContext();

  React.useEffect(() => {
    Governance.methods.isGovernor(accounts[0])
      .call()
      .then((isGovernor: any) => {
        const newFields = fields as Pick<RegisterFormFields, keyof RegisterFormFields>;
        setIsGovernor(isGovernor);
        setFields(newFields);
      })
      .catch(console.log);
  }, [Governance, accounts, fields]);

  const setMetaHash = (ipfsId: string): void => {
    const newFields = fields;
    newFields.metaIpfsHash = ipfsId;
    setFields(newFields);
  };

  const registerArtist = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();

    let walletValid = false;
    if (fields.wallet === '') {
      const account = web3.eth.accounts.create();
      account.privateKey = '';
      fields.wallet = account.address;
      walletValid = true;
    } else {
      const accountAddress = await addressFromName(fields.wallet);
      if (accountAddress !== '') {
        fields.wallet = accountAddress;
        walletValid = true;
      }
    }

    if (!walletValid) {
      setInvalidENS(true);
      return;
    }

    setValidated(true);
    setSubmitted(true);

    // eslint-disable-next-line
    const { metaIpfsHash, ...restOfTheFields } = fields;
    const jsonData: any = restOfTheFields;

    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));

    await saveSingleToIPFS(jsonDataBuffer, setMetaHash);

    const ipfsUrlStart = IPFS_URL_START;
    await Artists.methods.addArtist(
      ipfsUrlStart + fields.metaIpfsHash,
    ).send(
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ).catch(console.log);
    setSubmitted(false);
  };

  const renderSubmitButton = (): React.ReactNode => {
    if (!validated && !submitted) {
      return <Button type="submit" className="my-2 btn-block" variant="primary">Submit</Button>;
    } else if (submitted) {
      return <Button type="submit" className="my-2 btn-block" variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
          Submitting...
      </Button>;
    }
  };

  const inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;

    const stateUpdate = { fields: fields as Pick<RegisterFormFields, keyof RegisterFormFields> };
    stateUpdate.fields[key] = val;
    setFields(stateUpdate.fields);
  };

  const renderArtistInformation = (): React.ReactNode => {
    const handleClose = (): void => setInvalidENS(false);

    return (
      <Container>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>Artist Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="nationality">
            <Form.Label>Artist Nationality</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>

          <Form.Group as={Col} controlId="wallet">
            <Form.Label>Artist&apos;s ARRtistry Username (optional)</Form.Label>
            <Form.Control
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="birthYear">
            <Form.Label>Year of Artist Birth</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>

          <Form.Group as={Col} controlId="deathYear">
            <Form.Label>Year of Artist Death (optional)</Form.Label>
            <Form.Control
              type="text"
              onChange={inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>
        <Modal
          { ...{ show: invalidENS, title: 'Invalid Username entered', animation: false }}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              {'Invalid Username entered'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Sorry, we couldn&apos;t find an account with that Username</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  if (isGovernor) {
    return (
      <Container>
        <h5>
            Register a new Artist
        </h5>
        <hr/>
        <Row>
          <Col sm={8}>
            <Form
              noValidate
              validated={validated}
              onSubmit={registerArtist}
            >
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                      Artist Information
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {renderArtistInformation()}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {renderSubmitButton()}
            </Form>
          </Col>
        </Row>
        <TransactionLoadingModal
          submitted={submitted}
          title="Submitting this new artist..."
        />
      </Container>
    );
  }

  return (
    <span>You are not an approved moderator</span>
  );
};

export default RegisterArtist;
