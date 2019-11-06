import Form from 'react-bootstrap/Form';
import { TextFieldContext, SetValueContext, InputChangeEvent } from './RegisterForm';
import * as React from 'react';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';

const RegisterFields: React.FC = () => {
  const setValue = React.useContext(SetValueContext);
  const textFields = React.useContext(TextFieldContext);

  const inputChangeHandler = (event: InputChangeEvent): void => {
    setValue(event.target.id, event.target.value);
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
