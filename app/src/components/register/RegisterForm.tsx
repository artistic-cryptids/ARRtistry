import * as React from 'react';
import { FilesProvider, Files, useFilesContext } from '../../providers/FileProvider';
import { FormProvider, TextFields } from '../../providers/FormProvider';

export interface RegisterFields {
  name: string;
  artistId: string;
  artistWallet: string;
  description: string;
  edition: string;
  artifactCreationDate: string;
  medium: string;
  width: string;
  height: string;
}

interface Results {
  fields: RegisterFields;
  files: Files;
}

export type RegisterOnSubmit = (res: Results) => Promise<void>;

export interface RegisterProps {
  validator: any;
  onSubmit: RegisterOnSubmit;
}

const SubmitWithFiles: React.FC<RegisterProps> = ({ validator, onSubmit, children }) => {
  const { files, setImage, setDocuments } = useFilesContext();

  const _formSubmit = async (fields: TextFields): Promise<void> => {
    await onSubmit({ files: files, fields: fields });
  };

  const clearFiles = (): void => {
    setImage('');
    setDocuments([]);
  };

  return <FormProvider validator={validator} onSubmit={_formSubmit} onClear={clearFiles}>
    { children }
  </FormProvider>;
};

const RegisterForm: React.FC<RegisterProps> = (props) => {
  return (
    <FilesProvider>
      <SubmitWithFiles {...props}/>
    </FilesProvider>
  );
};

export {
  RegisterForm,
};
