import { IoMdClose } from "react-icons/io";
import styles from "./styles/modal.module.css";
import Icon from "../icon/icon";
import { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { Context } from "@/store/store";

export default function Modal({
  visible = false,
  children,
  zindex = 1000,
  modalTransaprent = false,
  maxWidth = "60%",
  minHeight,
  showCloseButton = true,
  title = "Add Transaction",
  fullScreenOverlay = false,
  onClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
  },
}) {
  const { modelZindex, setModelZIndex } = useContext(Context);
  const [localZIndex, setLocalZIndex] = useState(zindex);
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
    if (!visible) return;
    setLocalZIndex(modelZindex + 1);
    setModelZIndex((prev) => {
      let newZindex = prev + 1;
      return newZindex;
    });
    if (childRef.current) {
      childRef.current.focus();
    }
  }, [visible, modelZindex, setModelZIndex]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        event.preventDefault();
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
      <div
        className={styles.modalContainer}
        style={{
          "--index": localZIndex,
          "--bgColor": modalTransaprent ? "#00000000" : isDarkMode ? "rgba(0, 0, 0, 0.4)" : "#000000af",
          top: fullScreenOverlay ? "0" : undefined,
          height: fullScreenOverlay ? "100vh" : undefined,
          display: visible ? "flex" : "none",
        }}
        onClick={onClose}
      >
        <div
          className={styles.child}
          style={{ "--maxWidht": maxWidth, minHeight: minHeight, border: modalTransaprent ? "1px solid #ffffff1d" : null }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles.modalHeader}>
            {title}
            {showCloseButton && (
              <Icon onClick={onClose}>
                <IoMdClose />
              </Icon>
            )}
          </div>
          <div ref={childRef} className={styles.modalContent} style={{ width: "100%", padding: "0.75rem", overflowY: "auto", overflowX: "hidden", flex: 1, minHeight: 0, maxHeight: "calc(80vh - 120px)" }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
