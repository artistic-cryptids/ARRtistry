import Form from 'react-bootstrap/Form';
import * as React from 'react';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import TransactionLoadingModal from '../common/TransactionLoadingModal';
import { useFormControlContext, useTextFieldsContext } from '../../providers/FormProvider';
import { useKeyContext } from '../../providers/KeyProvider';

const RegisterFields: React.FC = () => {
  const { setField, status } = useFormControlContext();
  const textFields = useTextFieldsContext();
  const { setKey } = useKeyContext();

  const inputChangeHandler: React.FormEventHandler<any> = (event) => {
    // Can't handle the Bootstrap form types
    const target = event.target as any;
    const key = target.id;
    const val = target.value;
    setField(key, val);
  };

  const keyFileHandler = (event: any): void => {
    const fileReader = new FileReader();
    fileReader.onload = async (e: any) => {
      console.log('RegisterFields:29:', 'Setting key');
      setKey(JSON.parse(e.target.result));
    };
    setField('arweaveKeyPath', event.target.files[0]);
    fileReader.readAsText(event.target.files[0]);
  };

  return (
    <>
      <Form.Row>
        <Form.Group as={Col} controlId="name">
          <Form.Label>Title</Form.Label>
          <Form.Control
            required
            type="text"
            onChange={inputChangeHandler}
            value={textFields.name}
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Label className="mb-2 text-muted"> (optional)</Form.Label>
          <Form.Control
            as="textarea"
            rows="3"
            onChange={inputChangeHandler}
            value={textFields.description}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="artifactCreationDate">
          <Form.Label>Date of creation</Form.Label>
          <Form.Control
            required
            type="text"
            onChange={inputChangeHandler}
            value={textFields.artifactCreationDate}
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="medium">
          <Form.Label>Medium of Artwork</Form.Label>
          <Form.Control
            required
            type="text"
            onChange={inputChangeHandler}
            value={textFields.medium}
          />
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
              onChange={inputChangeHandler}
              value={textFields.height}
            />
            <Form.Control
              required
              type="text"
              id="width"
              onChange={inputChangeHandler}
              value={textFields.width}
            />
          </InputGroup>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="arweaveKey">
          <Form.Label>Arweave Key</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={keyFileHandler}
          />
        </Form.Group>
      </Form.Row>

      <TransactionLoadingModal
        submitted={status.submitted}
        title="Submitting this new artifact..."
      />
    </>
  );
};

export default RegisterFields;
