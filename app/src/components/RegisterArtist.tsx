import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import ipfs from '../ipfs';
import TransactionLoadingModal from './common/TransactionLoadingModal';
import { ContractProps } from '../helper/eth';

interface RegisterFormFields {
  name: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
  metaIpfsHash: string;
}

interface RegisterArtistState {
  fields: RegisterFormFields;
  validated: boolean;
  submitted: boolean;
  isGovernor: false;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof RegisterFormFields;
      value: RegisterFormFields[keyof RegisterFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class RegisterArtist extends React.Component<ContractProps, RegisterArtistState> {
  constructor (props: ContractProps) {
    super(props);
    this.state = {
      validated: false,
      submitted: false,
      isGovernor: false,
      fields: {
        name: '',
        nationality: '',
        birthYear: '',
        deathYear: '',
        metaIpfsHash: '',
      },
    };
  };

  componentDidMount (): void {
    this.props.contracts.Governance.isGovernor(this.props.accounts[0])
      .then((isGovernor: any) => {
        const fields = this.state.fields as Pick<RegisterFormFields, keyof RegisterFormFields>;
        this.setState({
          isGovernor: isGovernor,
          fields: fields,
        });
      })
      .catch((err: any) => { console.log(err); });
  };

  registerArtist = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    this.setState({ validated: true, submitted: true });

    const { contracts, accounts } = this.props;

    // eslint-disable-next-line
    const { metaIpfsHash, ...restOfTheFields } = this.state.fields;
    const jsonData: any = restOfTheFields;

    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    // TODO: this upload takes like 5 seconds. Some kind of loading notification should display
    await this.saveToIpfs(files, this.setMetaHash);

    const ipfsUrlStart = 'https://ipfs.io/ipfs/';
    await contracts.Artists.addArtist(
      ipfsUrlStart + this.state.fields.metaIpfsHash,
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ).catch((err: any) => {
      // rejection, usually
      console.log('register artist err:');
      console.log(err);
    });
    this.setState({ submitted: false });
  };

  renderSubmitButton = (): React.ReactNode => {
    if (!this.state.validated && !this.state.submitted) {
      return <Button type="submit" className="my-2 btn-block" variant="primary">Submit</Button>;
    } else if (this.state.submitted) {
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
  }

  setMetaHash = (ipfsId: string): void => {
    this.setState({ fields: { ...this.state.fields, metaIpfsHash: ipfsId } });
  };

  async saveToIpfs (files: any, afterwardsFunction: (arg0: string) => void): Promise<void> {
    let ipfsId: string;
    await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
      .then((response: any) => {
        ipfsId = response[0].hash;
        afterwardsFunction(ipfsId);
      }).catch((err: any) => {
        console.log(err);
      });
  }

  // This needs to be an arrow constructor to bind `this`, which is bonkers.
  inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;

    const stateUpdate = { fields: this.state.fields as Pick<RegisterFormFields, keyof RegisterFormFields> };
    stateUpdate.fields[key] = val;
    this.setState(stateUpdate);
  };

  renderArtistInformation = (): React.ReactNode => {
    return (
      <Container>
        <Form.Row>
          <Form.Group as={Col} controlId="name">
            <Form.Label>Artist Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="nationality">
            <Form.Label>Artist Nationality</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="birthYear">
            <Form.Label>Year of Artist Birth</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>

          <Form.Group as={Col} controlId="deathYear">
            <Form.Label>Year of Artist Death (optional)</Form.Label>
            <Form.Control
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>
      </Container>
    );
  };

  // TODO: Make required fields actually required
  render (): React.ReactNode {
    if (!this.state || this.state.isGovernor) {
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
                validated={this.state.validated}
                onSubmit={this.registerArtist}
              >
                <Accordion defaultActiveKey="0">
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                      Artist Information
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <Card.Body>
                        {this.renderArtistInformation()}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
                {this.renderSubmitButton()}
              </Form>
            </Col>
          </Row>
          <TransactionLoadingModal
            onHide={() => this.setState({ submitted: false })}
            submitted={this.state.submitted}
            title="Submitting this new artist..."
          />
        </Container>
      );
    }

    return (
      <span>You are not an approved moderator</span>
    );
  }
}

export default RegisterArtist;
