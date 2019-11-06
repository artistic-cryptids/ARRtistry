import { RegisterForm, DEFAULT_ERRORS, RegisterOnSubmit, TextFields, ErrorMessages, FilesContext } from "./register/Form";
import * as React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import FormSubmitButton from "./register/FormSubmitButton";
import { ArtistProvider } from "../providers/ArtistProvider";
import { ContractProps } from "../helper/eth";
import ArtistSelection from "./register/ArtistSelection";
import RegisterFields from "./register/RegisterFields";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropZone from "./register/DropZone";
import ipfs from "../helper/ipfs";

const registerArtifact: RegisterOnSubmit = async ({fields}, _event): Promise<void> => {
  console.log(fields);
};

const registerValidator: (textFields: TextFields) => ErrorMessages = (_fields) => {
  return DEFAULT_ERRORS;
}

const RegisterFieldLayout: React.FC = () => {
  return <>
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Artifact Information
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <RegisterFields/>
            <ArtistSelection/>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <FormSubmitButton/>
  </>;
}

const saveToIPFS = async (file: any, callback: (hash: string) => void): Promise<void> => {
  const hash = await ipfs.add(file, { progress: (prog: any) => console.log(`received: ${prog}`) });
  callback(hash);
}

const RegisterArtifact: React.FC<ContractProps> = ({ contracts }) => {
  const { files, setFiles } = React.useContext(FilesContext);

  const onDrop = (acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => saveToIPFS(file, (hash: string) => {
      setFiles({...files, image: hash});
    }));
  }

  return (
    <ArtistProvider artistContract={contracts.Artists}>
      <RegisterForm validator={registerValidator} onSubmit={registerArtifact}>
        <Row>
          <Col sm={4}>
            <DropZone callback={onDrop}/>
          </Col>
          <Col sm={8}>
            <RegisterFieldLayout/>
          </Col>
        </Row>
      </RegisterForm>
    </ArtistProvider>
  );
}

export default RegisterArtifact;
