import { IoMdClose } from "react-icons/io";
import styles from "./styles/modal.module.css";
import Icon from "../icon/icon";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { Context } from "@/store/store";

export default function ReportModal({
  data = [],
  visible = false,
  children,
  zindex = 15,
  modalTransaprent = false,
  maxWidth = "90%",
  minHeight,
  showCloseButton = true,
  title = "Add Transaction",
  onClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
  },
}) {
  const { setReportPortfolio, reportsParameter } = useContext(Context);
  // let { portfolio, pids } = Object.entries(data.reportsParameters)[0][1];
  const reportsParameters = data?.reportsParameters || {};
  const firstData = Object.entries(reportsParameters)[0]?.[1] || { portfolio: [], pids: [] };
  const { portfolio = [], pids = [] } = firstData;

  let portfolios = portfolio.map((id) => {
    if (id == "Consolidated") return ["Consolidated", "Consolidated"];
    return [id, pids.find((i) => i[0] == id)?.[1]];
  });

  const childRef = useRef();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };
    
    checkDarkMode();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose(event);
      }
    };

    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  return (
    <>
      <div className={styles.modalContainer} style={{ "--index": zindex, "--bgColor": modalTransaprent ? "#00000000" : isDarkMode ? "rgba(0, 0, 0, 0.4)" : "#000000af", display: visible ? "block" : "none" }} onClick={onClose}>
        <div
          style={{ "--maxWidht": maxWidth, minHeight: minHeight, border: modalTransaprent ? "1px solid #ffffff1d" : null }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modalHeader}>
            {" "}
            {title}{" "}
            {showCloseButton && (
              <Icon onClick={onClose}>
                {" "}
                <IoMdClose />{" "}
              </Icon>
            )}{" "}
          </div>
          <div style={{ width: "297mm" }} ref={childRef}>
            {" "}
            {children}{" "}
          </div>
        </div>
      </div>
    </>
  );
}
