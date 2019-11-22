import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ENSName from './ENSName';

const AddressField: React.FC<{address: string; label: string}> =
({ address, label }) => {
  return <Form.Row>
    <Form.Label column sm="3">
      <small className="text-uppercase text-muted">{label}</small>
    </Form.Label>
    <Col sm="9">
      <ENSName className='form-control-plaintext' address={address}/>
    </Col>
  </Form.Row>;
};

export default AddressField;
