import * as React from "react";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { FormStatusContext } from "./Form";

const FormSubmitButton: React.FC = () => {
  const formStatus = React.useContext(FormStatusContext);

  if (!formStatus.validated && !formStatus.submitted) {
    return <Button type="submit" className="my-2 btn-block" variant="primary">Submit</Button>;
  } else if (formStatus.submitted) {
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
}

export default FormSubmitButton;
