import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { FormControlProps } from 'react-bootstrap/FormControl';

export interface TextFields {
  title: string;
  artistId: string;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
}

export interface Files {
  image: string;
  documents: string[];
}

export interface FormStatus {
  validated: boolean;
  submitted: boolean;
}

export type ErrorMessages = {
  [K in keyof TextFields]: React.ReactElement | null;
}

export const DEFAULT_TEXT_FIELDS = {
  title: '',
  artistId: '',
  description: '',
  edition: '',
  artifactCreationDate: '',
  medium: '',
  width: '',
  height: ''
};

export const DEFAULT_ERRORS: ErrorMessages = {
  title: null,
  artistId: null,
  description: null,
  edition: null,
  artifactCreationDate: null,
  medium: null,
  width: null,
  height: null
};

export const DEFAULT_FILES = {
  image: '',
  documents: []
};

export const DEFAULT_FORM_STATUS = {
  validated: false,
  submitted: false
}


export const TextFieldContext = React.createContext<TextFields>(DEFAULT_TEXT_FIELDS);
export const SetValueContext = React.createContext<(name: string, value: string) => void>((_n, _v) => {});
export const ErrorsContext = React.createContext<ErrorMessages>(DEFAULT_ERRORS);
export const FormStatusContext = React.createContext<FormStatus>(DEFAULT_FORM_STATUS);
export const FilesContext = React.createContext<{files: Files, setFiles: (files: Files) => void}>({files: DEFAULT_FILES, setFiles: (_) => {}});

interface Results {
  errors: ErrorMessages;
  fields: TextFields;
}

export type InputChangeEvent = React.FormEvent<FormControlProps> &
  {
    target: {
      id: keyof TextFields;
      value: TextFields[keyof TextFields];
    };
  }

export type RegisterOnSubmit = (res: Results, event: React.FormEvent<HTMLFormElement>) => Promise<void>;

export interface RegisterProps {
  onSubmit: RegisterOnSubmit;
  validator: (textFields: TextFields) => ErrorMessages;
}

const removeEmpty = (obj: { [x: string]: any; }) => {
  Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

const RegisterForm: React.FC<RegisterProps> = ({ onSubmit, validator, children }) => {
  const [textFields, setTextFields] = React.useState<TextFields>(DEFAULT_TEXT_FIELDS);
  const [errors, setErrors] = React.useState<ErrorMessages>(DEFAULT_ERRORS);
  const [files, setFiles] = React.useState<Files>(DEFAULT_FILES);
  const [formStatus, setFormStatus] = React.useState<FormStatus>(DEFAULT_FORM_STATUS);

  const _setField = (id: string, value: string) => {
    setTextFields({
      ...textFields,
      [id]: value
    });
  }

  const clearForm = () => {
    setTextFields(DEFAULT_TEXT_FIELDS);
    setErrors(DEFAULT_ERRORS);
    setFiles(DEFAULT_FILES);
    setFormStatus(DEFAULT_FORM_STATUS);
  }

  const _onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus({...formStatus, submitted: true});
    const errors = _validate();
    setErrors(errors);
    await onSubmit({errors: errors, fields: textFields}, event);
    clearForm();
  }

  const _validate = () => {
    let errors = validator(textFields);
    removeEmpty(errors);
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      return errors;
    }
    setFormStatus({...formStatus, validated: true});
    return DEFAULT_ERRORS;
  }

  return (
    <TextFieldContext.Provider value={textFields}>
      <SetValueContext.Provider value={_setField}>
        <ErrorsContext.Provider value={errors}>
          <FormStatusContext.Provider value={formStatus}>
            <FilesContext.Provider value={{files: files, setFiles: setFiles}}>
              <Form
                noValidate
                validated={formStatus.validated}
                onSubmit={_onSubmit}
              >
              { children }
              </Form>
            </FilesContext.Provider>
          </FormStatusContext.Provider>
        </ErrorsContext.Provider>
      </SetValueContext.Provider>
    </TextFieldContext.Provider>
  );
};

export {
  RegisterForm,
}
