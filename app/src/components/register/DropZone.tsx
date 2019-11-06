import React, {useCallback} from "react";
import * as styles from './DropZone.module.scss';
import {useDropzone, DropEvent} from 'react-dropzone'
import ipfs from "../../helper/ipfs";

type DropZoneCallback = (acceptedFiles: File[], rejectedFiles: File[], event: DropEvent) => void;

const DropZone: React.FC<{callback: DropZoneCallback}> = ({callback}) => {

  const onDrop = useCallback(callback, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
  <>
    <div className={styles.popup}>
      <span className={styles.message}>
      Artifact Image<br />
      <small>Drop your image into the space below</small>
    </span>
    </div>
    <div
      className={styles.dropzone + (isDragActive ? ' ' + styles.fileOver : '')}
      {...getRootProps()}
    >
      <div className={styles.box}>
        <div className={styles.progress}></div>
      </div>
      <div>
        <div className={styles.arrow}></div>
      </div>
      <img className={styles.imageHolder}/>
      <input {...getInputProps()} />
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
