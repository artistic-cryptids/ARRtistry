import React, {useCallback} from "react";
import * as styles from './DropZone.module.scss';
import {useDropzone} from 'react-dropzone'
import { FilesContext } from "./RegisterForm";
import { saveToIPFS } from "../../helper/ipfs";

const DropZone: React.FC<{popup?: true, callback: (hash: string) => void}> = ({popup, callback}) => {

  const { files } = React.useContext(FilesContext);

  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    var reader = new FileReader();
    reader.addEventListener("loadend", function() {
      saveToIPFS([reader.result], callback);
    });
    acceptedFiles.forEach((blob) => reader.readAsArrayBuffer(blob));
  }, [callback]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const isFileOver = isDragActive || files.image !== '';
  const isComplete = files.image !== '';

  return (
  <>
    {popup ?
    <div className={styles.popup}>
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
      <img className={styles.imageHolder + (isComplete ? ' ' + styles.move : '')} src={'https://ipfs.io/ipfs/' + files.image} alt='artifact-img'/>
      <input accept="image/*" {...getInputProps()} />
    </div>
  </>
  );
}

// $(function() {
//
//   $('#container').on('dragover', function(e) {
//     e.preventDefault();
//     $(this).addClass('file-over');
//     //$('svg path').show();
//   });
//
//   $('#container').on('dragleave', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     $(this).removeClass('file-over');
//   });
//
//   $('#container').on('drop', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
//     $(this).addClass('file-over').stop(true, true).css({
//       background:'#fff'
//     });
//     $('.progress').toggleClass('complete');
//     $('#image-holder').addClass('move');
//   });
//
//   var dropzone = document.getElementById("container");
//
//   FileReaderJS.setupDrop(dropzone, {
//     readAsDefault: "DataURL",
//     on: {
//       load: function(e, file) {
//         var img = document.getElementById("image-holder");
//         img.onload = function() {
//           document.getElementById("image-holder").appendChild(img);
//         };
//         img.src = e.target.result;
//       }
//     }
//   });
//
// });

export default DropZone;
