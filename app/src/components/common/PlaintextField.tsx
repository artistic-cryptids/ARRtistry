import Form from 'react-bootstrap/Form';

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
