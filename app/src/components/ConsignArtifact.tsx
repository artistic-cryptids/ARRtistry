import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';

interface ConsignArtifactProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
}

interface ConsignArtifactFormFields {
  recipientAddress: string;
}

interface ConsignArtifactState {
  fields: ConsignArtifactFormFields;
  showConsignArtifactForm: boolean;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof ConsignArtifactFormFields;
      value: ConsignArtifactFormFields[keyof ConsignArtifactFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class ConsignArtifact extends React.Component<ConsignArtifactProps, ConsignArtifactState> {
  constructor (props: ConsignArtifactProps) {
    super(props);
    this.state = {
      fields: {
        recipientAddress: '',
      },
      showConsignArtifactForm: false,
    };
  }

  ConsignArtifactForArtwork = (_: React.FormEvent): void => {
    const artifactRegistry = this.props.drizzle.contracts.ArtifactRegistry;

    artifactRegistry.methods.approve.cacheSend(
      this.state.fields.recipientAddress,
      this.props.tokenId,
    );
  }

  inputChangeHandler = (event: InputChangeEvent): void => {
    const key = event.target.id;
    const val = event.target.value;
    const stateUpdate = {
      fields: this.state.fields as Pick<ConsignArtifactFormFields, keyof ConsignArtifactFormFields>,
    };
    stateUpdate.fields[key] = val;
    this.setState(stateUpdate);
  };

  handleShow = (): void => {
    this.setState({
      showConsignArtifactForm: true,
    });
  }

  handleCancel = (): void => {
    this.setState({
      fields: {
        recipientAddress: '',
      },
      showConsignArtifactForm: false,
    });
  }

  render (): React.ReactNode {
    return (
      <div>
        <Button variant="primary" onClick={this.handleShow}>
          Consign for Sale
        </Button>
        <Modal show={this.state.showConsignArtifactForm} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Consign Entity to Sell Artifact </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group as={Col} controlId="recipientAddress">
              <Form.Label>Recipient Address</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={this.inputChangeHandler}/>
              {GENERIC_FEEDBACK}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.ConsignArtifactForArtwork}>
              Consign for Sale
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default ConsignArtifact;
