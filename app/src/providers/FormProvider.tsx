import * as React from 'react';
import Form from 'react-bootstrap/Form';
import * as _ from 'lodash';

export interface TextFields {
  title: string;
  artistId: string;
  artistWallet: string;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
}

export interface FormStatus {
  validated: boolean;
  submitted: boolean;
}

export type ErrorMessages = {
  [K in keyof TextFields]: React.ReactElement | null;
}

export const DEFAULT_TEXT_FIELDS: TextFields = {
  title: '',
  artistId: '1',
  artistWallet: '0xEF1728245cBB4E908a72f92AC2074175609fA6c9',
  description: '',
  edition: '',
  artifactCreationDate: '',
  medium: '',
  width: '',
  height: '',
};

export const DEFAULT_ERRORS: ErrorMessages = {
  title: null,
  artistId: null,
  artistWallet: null,
  description: null,
  edition: null,
  artifactCreationDate: null,
  medium: null,
  width: null,
  height: null,
};

export const DEFAULT_FORM_STATUS: FormStatus = {
  validated: false,
  submitted: false,
};

type SetField = (name: string, value: string) => void;
type SetFields = (newFields: {[key: string]: string}) => void;

export interface FormControl {
  status: FormStatus;
  setField: SetField;
  setFields: SetFields;
  clear: VoidFunction;
}

const TextFieldContext = React.createContext<TextFields>(DEFAULT_TEXT_FIELDS);
const FormControlContext = React.createContext<FormControl>({
  status: DEFAULT_FORM_STATUS,
  setField: console.warn,
  setFields: (newFields: {[key: string]: string}) => console.warn(newFields),
  clear: console.warn,
});
const ErrorsContext = React.createContext<ErrorMessages>(DEFAULT_ERRORS);

type formOnSubmit = (fields: TextFields) => Promise<void>;

export interface FormProviderProps {
  validator: (textFields: TextFields) => ErrorMessages;
  onSubmit: formOnSubmit;
  onClear?: VoidFunction;
}

export const FormProvider: React.FC<FormProviderProps> = ({ onSubmit, validator, onClear, children }) => {
  const [textFields, setTextFields] = React.useState<TextFields>(DEFAULT_TEXT_FIELDS);
  const [errors, setErrors] = React.useState<ErrorMessages>(DEFAULT_ERRORS);
  const [formStatus, setFormStatus] = React.useState<FormStatus>(DEFAULT_FORM_STATUS);

  const _setField = (id: string, value: string): void => {
    setTextFields({
      ...textFields,
      [id]: value,
    });
  };

  /* _setFields should be used if multiple fields need to be set at a similar time.
   * This is because React's setState is asynchronous so the textFields retrieved
   * when setting the new fields may not update in time if setField is called
   * multiple times in a short time period.
   *
   */
  const _setFields = (newFields: {[key: string]: string}): void => {
    setTextFields({
      ...textFields,
      ...newFields,
    });
  };

  const _validate = (submittedBool: boolean): ErrorMessages => {
    const errors = validator(textFields);
    const foundErrors = _.pickBy(errors, (b: any) => !!b);
    const hasErrors = Object.keys(foundErrors).length > 0;
    if (hasErrors) {
      return errors;
    }
    setFormStatus({ ...formStatus, submitted: submittedBool, validated: true });
    return DEFAULT_ERRORS;
  };

  const clearForm = (): void => {
    setTextFields(DEFAULT_TEXT_FIELDS);
    setErrors(DEFAULT_ERRORS);
    setFormStatus(DEFAULT_FORM_STATUS);
    onClear && onClear();
  };

  const _onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const errors = _validate(true);
    setErrors(errors);
    await onSubmit(textFields);
    clearForm();
  };

  return (
    <TextFieldContext.Provider value={textFields}>
      <FormControlContext.Provider value={{
        status: formStatus,
        setField: _setField,
        setFields: _setFields,
        clear: clearForm,
      }}>
        <ErrorsContext.Provider value={errors}>
          <Form
            noValidate
            validated={formStatus.validated}
            onSubmit={_onSubmit}
          >
            { children }
          </Form>
        </ErrorsContext.Provider>
      </FormControlContext.Provider>
    </TextFieldContext.Provider>
  );
};

export const useTextFieldsContext = (): TextFields => React.useContext<TextFields>(TextFieldContext);
export const useFormControlContext = (): FormControl => React.useContext<FormControl>(FormControlContext);
export const useErrorsContext = (): ErrorMessages => React.useContext<ErrorMessages>(ErrorsContext);
