import { axios_, formatDateDDMMYYYYHHMM } from "@/utils/utll";
import styles from "./style.module.css";
import { useContext, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { Context } from "@/store/store";
import axios from "axios";

function DownloadFile({ fName, prefix = "InvestLytics" }) {
  const { showMessage } = useContext(Context);
  const [downloading, setDownloading] = useState(false);

  async function download() {
    try {
      setDownloading(true);
      let token = sessionStorage.getItem("token");
      const res = await axios.post("/api/downloadfile", { filePath: fName.documentUrl || fName }, { headers: { "Content-Type": "application/json", Authorization: token } });
      let base64 = res.data.base64;
      const link = document.createElement("a");
      link.href = base64;
      link.download = `${prefix} - file - ${formatDateDDMMYYYYHHMM(new Date())}.${getFileExtensionFromBase64(base64)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    } catch (e) {
      console.log(e);
      showMessage("Error in downloading file", false);
      setDownloading(false);
    }
  }
  function getFileExtensionFromBase64(base64String) {
    // Example: "data:application/pdf;base64,JVBERi0x..."
    const matches = base64String.match(/^data:(.*?);base64,/);
    if (!matches || matches.length < 2) {
      return null; // Invalid base64 format
    }

    const mimeType = matches[1]; // e.g., "application/pdf"
    const parts = mimeType.split("/");
    return parts[1]; // e.g., "pdf"
  }

  return (
    <>
      <span style={{ display: "flex", justifyContent: "center" }}>
        <span className={downloading ? styles.loader : ""} style={{ display: "flex", width: "20px", height: "20px", justifyContent: "center", alignItems: "center" }}>
          <BsDownload size={12} onClick={download} />
        </span>
      </span>
    </>
  );
}

export default DownloadFile;
