import * as React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

const PrivacySelection: React.FC = () => {
  return (
    <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Privacy</Form.Label>
        <Form.Control
          as="select"
        >
          <option value={1}>Public</option>
          <option value={2}>Mostly Public?</option>
          <option value={3}>Private (Compliant)</option>
        </Form.Control>
      </Form.Group>
    </Form.Row>
  );
};

export default PrivacySelection;
