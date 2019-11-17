import * as React from 'react';

export interface IpfsDocument {
  filename: string;
  data: File;
  metauri?: string;
}

export interface Files {
  image: string;
  documents: IpfsDocument[];
}

export interface FilesControl {
  files: Files;
  setImage: (image: string) => void;
  setDocuments: (documents: IpfsDocument[]) => void;
}

const DEFAULT_FILES: Files = {
  image: '',
  documents: [],
};

export const DEFAULT_FILE_CONTROL: FilesControl = {
  files: DEFAULT_FILES,
  setImage: console.warn,
  setDocuments: console.warn,
};

const FilesContext = React.createContext<FilesControl>(DEFAULT_FILE_CONTROL);

export const FilesProvider: React.FC = ({ children }) => {
  const [files, setFiles] = React.useState<Files>(DEFAULT_FILES);

  const _setImage = (image: string): void => {
    setFiles({
      ...files,
      image: image,
    });
  };

  const _setDocuments = (documents: IpfsDocument[]): void => {
    setFiles({
      ...files,
      documents: documents,
    });
  };

  return (
    <FilesContext.Provider value={{ files: files, setImage: _setImage, setDocuments: _setDocuments }}>
      { children }
    </FilesContext.Provider>
  );
};

export const useFilesContext: () => FilesControl = () => React.useContext<FilesControl>(FilesContext);
