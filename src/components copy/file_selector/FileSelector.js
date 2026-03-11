import { useState, useEffect, useRef } from "react";
import Loader from "../loader/Loader";
import styles from "./style/filesSelector.module.css";
let fileMap = {
  csv: "text/csv",
  pdf: "application/pdf",
  image: "",
};
const FileSelector = function ({ fileType = "csv", loading = false, onFileSelect = () => {}, isError = false, uploaded = false, checkFileType = true }) {
  useEffect(() => {
    if (uploaded) {
      setMessage("File uploaded successfully");
      setTimeout(() => {
        setMessage(`Click or Drag and Drop ${fileType} file here`);
      }, 3000);
    }
  }, [uploaded]);

  const ref = useRef();
  const [message, setMessage] = useState(`Click or Drag and Drop ${fileType} file here`);

  function setFileToUpload(e) {
    if (checkFileType) {
      if (e.target?.files?.length > 0) {
        if (e.target?.files[0].type !== fileMap[fileType]) {
          return showError(`Only ${fileType} file is allowed`);
        }
      }
    }
    console.log(e.target.files);
    onFileSelect(e.target.files[0]);
    setMessage(e.target.files[0]?.name || "No File Selected");
  }
  function selectFile(e) {
    e.preventDefault();
    ref.current.click();
  }
  function hanldeDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setMessage(`Drop ${fileType} file here`);
  }

  function showError(message) {
    setMessage(message);
    setTimeout(() => {
      setMessage(`Click or Drag and Drop ${fileType} file here`);
    }, 3000);
  }
  function handleFileChange(e) {
    e.preventDefault();
    setFileToUpload(e);
  }

  function hanldeOnDrop(e) {
    e.preventDefault();
    // e.stopPropagation();
    console.log("e.dataTransfer", e.dataTransfer);
    if (e?.dataTransfer?.files.length > 1) {
      return showError("Multiple files are not allowed");
    }
    const file = e.dataTransfer.files[0];
    setFileToUpload({ target: { files: [file] } });
  }
  return (
    <>
      <input type="file" style={{ display: "none" }} ref={ref} onChange={handleFileChange} />
      <div onClick={selectFile} className={`${styles.fileSelector} ${isError ? styles.error : ""} ${uploaded ? styles.uploaded : ""}`} onDragOver={hanldeDragOver} onDrop={hanldeOnDrop}>
        {loading ? <Loader text="processing" /> : message}
      </div>
    </>
  );
};
export default FileSelector;
