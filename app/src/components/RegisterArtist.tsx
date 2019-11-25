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
import ipfs from '../helper/ipfs';
import { useContractContext } from '../providers/ContractProvider';
import { useWeb3Context } from '../providers/Web3Provider';

interface RegisterFormFields {
  name: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
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
    metaIpfsHash: '',
  });
  const [validated, setValidated] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);
  const [isGovernor, setIsGovernor] = React.useState<boolean>(false);

  const { Governance, Artists } = useContractContext();
  const { accounts } = useWeb3Context();

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
    setFields({ ...fields, metaIpfsHash: ipfsId });
  };

  const saveToIpfs = async (files: any, afterwardsFunction: (arg0: string) => void): Promise<void> => {
    let ipfsId: string;
    await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => {
        ipfsId = response[0].hash;
        afterwardsFunction(ipfsId);
      }).catch(console.log);
  };

  const registerArtist = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    setValidated(true);
    setSubmitted(true);

    // eslint-disable-next-line
    const { metaIpfsHash, ...restOfTheFields } = fields;
    const jsonData: any = restOfTheFields;

    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    // TODO: this upload takes like 5 seconds. Some kind of loading notification should display
    await saveToIpfs(files, setMetaHash);

    const ipfsUrlStart = 'https://ipfs.io/ipfs/';
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
