import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import { FormControlProps } from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import ipfs from '../ipfs';
import { Drizzled } from 'drizzle';
import TransactionLoadingModal from './common/TransactionLoadingModal';

interface SaleProvenance {
  price: string;
  location: string;
  seller: string;
  buyers: string[];
}

interface RegisterFormFields {
  title: string;
  artistId: string;
  description: string;
  artifactCreationDate: string;
  medium: string;
  edition: string;
  width: string;
  height: string;
  imageIpfsHash: string;
  metaIpfsHash: string;
}

interface Artist {
  id: number;
  name: string;
  wallet: string;
  nationality: string;
  birthYear: string;
  deathYear: string;
}

interface RegisterState {
  fields: RegisterFormFields;
  registerTransactionStackId: any;
  validated: boolean;
  submitted: boolean;
  artists?: Artist[];
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof RegisterFormFields;
      value: RegisterFormFields[keyof RegisterFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class Register extends React.Component<Drizzled, RegisterState> {
  constructor (props: Drizzled) {
    super(props);
    this.state = {
      registerTransactionStackId: null,
      validated: false,
      submitted: false,
      fields: {
        title: '',
        artistId: '',
        description: '',
        edition: '',
        artifactCreationDate: '',
        medium: '',
        width: '',
        height: '',
        imageIpfsHash: '',
        metaIpfsHash: '',
      },
    };
  };

  componentDidMount (): void {
    this.getArtistInfo()
      .then((artists: Artist[]) => {
        const fields = this.state.fields as Pick<RegisterFormFields, keyof RegisterFormFields>;
        // set the default artistId to the first artist, assuming the list of artists is not empty
        fields.artistId = artists[0].id.toString();
        this.setState({
          artists: artists,
          fields: fields,
        });
      })
      .catch((err: any) => console.log(err));
  };

  hashToArtist = (hash: string): Promise<Artist> => {
    return fetch(hash)
      .then((response: any) => response.json());
  };

  getArtistInfo = (): Promise<Artist[]> => {
    const Artists = this.props.contracts.Artists;

    return Artists.getArtistsTotal()
      .then((total: number) => {
        const artists = [];

        for (let i = 1; i < total; i++) {
          // Have to extract to new variable for async issues
          const id = i;
          const artist = Artists.getArtist(id)
            .then((hash: string) => this.hashToArtist(hash))
            .then((artist: Artist) => {
              console.log(artist);
              return artist;
            });

          artists.push(artist);
        }

        return Promise.all(artists);
      });
  };

  registerArtifact = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      return;
    }

    this.setState({ validated: true, submitted: true });

    const { drizzle, drizzleState, contracts, accounts } = this.props;

    //const currentAccount = drizzleState.accounts[0];
    // TODO: Update this to real artist's account
    //const artist = drizzleState.accounts[0];
    const currentAccount = accounts[0];
    const artist = accounts[0]; 

    // eslint-disable-next-line
    const { metaIpfsHash, ...restOfTheFields } = this.state.fields;
    const jsonData: any = restOfTheFields;

    jsonData.previousSalePrice = 0;
    jsonData.saleProvenance = [];

    const jsonDataBuffer = Buffer.from(JSON.stringify(jsonData));
    const files = Array(jsonDataBuffer);

    // TODO: this upload takes like 5 seconds. Some kind of loading notification should display
    await this.saveToIpfs(files, this.setMetaHash);

    const ipfsUrlStart = 'https://ipfs.io/ipfs/';
    const stackId = await contracts.ArtifactApplication.applyFor(
      currentAccount,
      artist,
      ipfsUrlStart + this.state.fields.metaIpfsHash,
      {
        from: accounts[0],
        gasLimit: 6000000,
      },
    ); // TODO: Catch error when this function fails and display error to user
    console.log(stackId);

    this.setState({
      registerTransactionStackId: stackId,
    });
  };

  renderSubmitButton = (): React.ReactNode => {
    // eslint-disable-next-line
    const { transactions, transactionStack } = this.props.drizzleState;

    // eslint-disable-next-line
    const registerTransactionHash = transactionStack[this.state.registerTransactionStackId];
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

  setImgHash = (ipfsId: string): void => {
    this.setState({ fields: { ...this.state.fields, imageIpfsHash: ipfsId } });
  };

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

  artistChangeHandler = (event: InputChangeEvent): void => {
    if (!this.state.artists) {
      return;
    }

    const value = event.target.value;

    let artist;

    for (const a of this.state.artists) {
      if (a.name === value) {
        artist = a;
        break;
      }
    }

    if (!artist) {
      return;
    }

    const stateUpdate = { fields: this.state.fields as Pick<RegisterFormFields, keyof RegisterFormFields> };

    stateUpdate.fields.artistId = artist.id.toString();

    this.setState(stateUpdate);
  }

  getOptions = (): JSX.Element[] => {
    if (!this.state.artists) {
      return [];
    }

    return this.state.artists.map((artist: Artist, id: number) => {
      return <option key={id}>{artist.name}</option>;
    });
  };

  renderArtifactInformation = (): React.ReactNode => {
    return (
      <Container>
        <Form.Row>
          <Form.Group as={Col} controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Label className="mb-2 text-muted"> (optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="artifactCreationDate">
            <Form.Label>Date of creation</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="medium">
            <Form.Label>Medium of Artwork</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={this.inputChangeHandler}/>
            {GENERIC_FEEDBACK}
          </Form.Group>

          <Form.Group as={Col}>
            <Form.Label>Size (cm)</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Height x Width</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                type="text"
                id="height"
                onChange={this.inputChangeHandler}/>
              <Form.Control
                required
                type="text"
                id="width"
                onChange={this.inputChangeHandler}/>
            </InputGroup>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Artist Name</Form.Label>
            <Form.Control
              required
              as="select"
              onChange={this.artistChangeHandler}>
              {this.getOptions()}
            </Form.Control>
            {GENERIC_FEEDBACK}
          </Form.Group>
        </Form.Row>
      </Container>
    );
  };

  // TODO: Split these into more manageable components
  // TODO: Make required fields actually required
  render (): React.ReactNode {
    return (
      <Container>
        <h5>
          Register a Piece
        </h5>
        <hr/>
        <Row>
          <Col sm={4}>
            <Card>
              {this.state.fields.imageIpfsHash !== ''
                ? <Card.Img src={'https://ipfs.io/ipfs/' + this.state.fields.imageIpfsHash}/>
                : <></>}
              <Card.Body>
                <div style={{
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'inline-block',
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
                        this.saveToIpfs(files, this.setImgHash);
                      } else {
                        // TODO: nicer way of alerting
                        alert('Image cannot be greater than 1 MB!');
                      }
                    }}
                  />
                  <Button>
                    Upload Image
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={8}>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.registerArtifact}
            >
              <Accordion defaultActiveKey="0">
                <Card>
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    Artifact Information
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {this.renderArtifactInformation()}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              {this.renderSubmitButton()}
            </Form>
          </Col>
        </Row>
        <TransactionLoadingModal
          drizzleState={this.props.drizzleState}
          onHide={() => this.setState({ submitted: false })}
          submitted={this.state.submitted}
          transactionStackId={this.state.registerTransactionStackId}
          title="Submitting your Artifact..."
        />
      </Container>
    );
  }
}

export default Register;
