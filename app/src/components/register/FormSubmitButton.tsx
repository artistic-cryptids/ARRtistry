import * as React from 'react';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useFormControlContext } from '../../providers/FormProvider';

const FormSubmitButton: React.FC = () => {
  const { status } = useFormControlContext();

  if (!status.validated && !status.submitted) {
    return <Button type="submit" className="my-2 btn-block" variant="primary">Submit</Button>;
  } else if (status.submitted) {
    return <Button type="submit" className="my-2 btn-block" variant="primary" disabled>
      <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
      Submitting...
    </Button>;
  }
  return <Button type="submit" className="my-2 btn-block" disabled variant="primary">Submit</Button>;
};

export default FormSubmitButton;
