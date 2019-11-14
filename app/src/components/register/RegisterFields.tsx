import Form from 'react-bootstrap/Form';
import * as React from 'react';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useFormControlContext, useTextFieldsContext, TextFields } from '../../providers/FormProvider';
import { FormControlProps } from 'react-bootstrap/FormControl';

type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof TextFields;
      value: TextFields[keyof TextFields];
    };
  }

const RegisterFields: React.FC = () => {
  const { setField } = useFormControlContext();
  const textFields = useTextFieldsContext();

  const inputChangeHandler = (event: InputChangeEvent): void => {
    setField(event.target.id, event.target.value);
  };

  return (
    <>
      <Form.Row>
        <Form.Group as={Col} controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            required
            type="text"
            onChange={inputChangeHandler}
            value={textFields.title}
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
    </>
  );
};

export default RegisterFields;
