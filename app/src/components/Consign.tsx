import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';
import Modal from 'react-bootstrap/Modal';

interface ConsignProps {
  drizzle: any;
  drizzleState: any;
  tokenId: number;
}

interface ConsignFormFields {
  recipientAddress: string;
}

interface ConsignState {
  fields: ConsignFormFields;
  showConsignForm: boolean;
}

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof ConsignFormFields;
      value: ConsignFormFields[keyof ConsignFormFields];
    };
  }

const GENERIC_FEEDBACK = <Form.Control.Feedback>Looks good!</Form.Control.Feedback>;

class Consign extends React.Component<ConsignProps, ConsignState> {
  constructor (props: ConsignProps) {
    super(props);
    this.state = {
      fields: {
        recipientAddress: '',
      },
      showConsignForm: false,
    };
  }

  ConsignForArtwork = (_: React.FormEvent): void => {
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
      fields: this.state.fields as Pick<ConsignFormFields, keyof ConsignFormFields>,
    };
    stateUpdate.fields[key] = val;
    this.setState(stateUpdate);
  };

  handleShow = (): void => {
    this.setState({
      showConsignForm: true,
    });
  }

  handleCancel = (): void => {
    this.setState({
      fields: {
        recipientAddress: '',
      },
      showConsignForm: false,
    });
  }

  render (): React.ReactNode {
    return (
      <div>
        <Button variant="primary" onClick={this.handleShow}>
          Consign for Sale
        </Button>
        <Modal show={this.state.showConsignForm} onHide={this.handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Approve Entity For Artifact </Modal.Title>
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
            <Button variant="primary" onClick={this.ConsignForArtwork}>
              Approve
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default Consign;
