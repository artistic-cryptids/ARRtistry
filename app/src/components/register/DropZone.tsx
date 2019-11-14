import React, { useCallback } from 'react';
import * as styles from './DropZone.module.scss';
import { useDropzone } from 'react-dropzone';
import { saveSingleToIPFS } from '../../helper/ipfs';
import { useFilesContext } from '../../providers/FileProvider';

const DropZone: React.FC<{popup?: true; callback: (hash: string) => void}> = ({ popup, callback }) => {
  const { files } = useFilesContext();
  const [dropped, setDropped] = React.useState(false);

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    setDropped(true);
    const reader = new FileReader();
    reader.addEventListener('loadend', function () {
      saveSingleToIPFS(reader.result, callback);
    });
    acceptedFiles.forEach((blob) => reader.readAsArrayBuffer(blob));
  }, [callback]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const isFileOver = isDragActive || dropped;
  const isComplete = files.image !== '';

  return (
    <>
      {popup
        ? <div className={styles.popup}>
          <span className={styles.message}>
      Artifact Image<br />
            <small>Drop your image into the space below</small>
          </span>
        </div> : null}
      <div
        className={styles.dropzone + (isFileOver ? ' ' + styles.fileOver : '')}
        {...getRootProps()}
      >
        <div className={styles.box}>
          <div className={styles.progress + (isComplete ? ' ' + styles.complete : '')}></div>
        </div>
        <div>
          <div className={styles.arrow}></div>
        </div>
        { isComplete
          ? <img
            className={styles.imageHolder + ' ' + styles.move}
            src={'https://ipfs.io/ipfs/' + files.image}
            alt='artifact-img'
          /> : null
        }
        <input accept="image/*" {...getInputProps()} />
      </div>
    </>
  );
};

export default DropZone;
