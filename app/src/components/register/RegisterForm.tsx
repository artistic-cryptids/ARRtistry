import * as React from 'react';
import { FilesProvider, Files, useFilesContext } from '../../providers/FileProvider';
import { FormProvider, TextFields } from '../../providers/FormProvider';
import { JWKInterface } from 'arweave/web/lib/wallet';

interface Results {
  fields: TextFields;
  files: Files;
  arweaveKey: JWKInterface | undefined;
}

export type RegisterOnSubmit = (res: Results) => Promise<void>;

export interface RegisterProps {
  validator: any;
  onSubmit: RegisterOnSubmit;
}

const SubmitWithFiles: React.FC<RegisterProps> = ({ validator, onSubmit, children }) => {
  const { files, setImage, setDocuments } = useFilesContext();

  const _formSubmit = async (fields: TextFields, arweaveKey: JWKInterface | undefined): Promise<void> => {
    await onSubmit({ files: files, fields: fields, arweaveKey: arweaveKey });
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
