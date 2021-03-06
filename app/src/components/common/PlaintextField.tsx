import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const PlaintextField: React.FC<{label: string; value: string}> = ({ label, value }) => {
  return <Form.Row>
    <Form.Label column sm="3">
      <small className="text-uppercase text-muted">{label}</small>
    </Form.Label>
    <Col sm="9">
      <Form.Control plaintext readOnly defaultValue={value} />
    </Col>
  </Form.Row>;
};

export default PlaintextField;
