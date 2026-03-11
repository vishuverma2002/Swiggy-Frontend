"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./drawer.module.css";
import { RxCross1 } from "react-icons/rx";

const Drawer = ({
  isOpen,
  onClose,
  children,
  position = "left",
  width = "400px",
  title,
  showHeader = true,
  contentClassName,
  noPadding = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && document?.body) {
      setPortalContainer(document.body);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const drawerContent = (
    <>
      <div
        onClick={onClose}
        className={styles.overlay}
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        aria-hidden={!isOpen}
      />
      <div
        className={`${styles.drawer} ${styles[position]}`}
        style={{
          [position]: isOpen ? 0 : "-100%",
          width,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Drawer"}
      >
        {showHeader && title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              <RxCross1 />
            </button>
          </div>
        )}
        <div className={`${styles.content} ${noPadding ? styles.noPadding : ""} ${contentClassName || ""}`}>
          {children}
        </div>
      </div>
    </>
  );

  // Safeguard: only create portal when running in the browser
  // and we have a valid container to attach to
  if (!mounted || !portalContainer) return null;
  return createPortal(drawerContent, portalContainer);
};

export default Drawer;
