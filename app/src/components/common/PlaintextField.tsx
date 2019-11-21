import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const PlaintextField: React.FC<{label: string; value: string}> = ({ label, value }) => {
  return <Form.Group as={Form.Row}>
    <Form.Label column sm="2">
      {label}
    </Form.Label>
    <Col sm="10">
      <Form.Control plaintext readOnly defaultValue={value} />
    </Col>
  </Form.Group>;
};

export default PlaintextField;
