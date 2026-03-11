import { formatNumber } from "@/utils/utll";
import { Loader2 } from "../loader/Loader";
import styles from "./styles/card.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clientFollowupForms } from "@/forms/clientFollowupForm";

export default function Card({ text, number, isNumber = true, loading = false, title = "" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timer, setTimer] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, right: 0, position: "bottom-right" });
  const cardRef = useRef(null);
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);

  const calculateTooltipPosition = () => {
    if (!cardRef.current || !iconRef.current) return;

    const iconRect = iconRef.current.getBoundingClientRect();
    const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 80;
    const tooltipWidth = tooltipRef.current ? tooltipRef.current.offsetWidth : 350;
    const spacing = 10; // Space between icon and tooltip
    const viewportPadding = 10; // Padding from viewport edges

    // Always position tooltip below the icon (as requested)
    let top = iconRect.bottom + spacing;
    let right = window.innerWidth - iconRect.right;
    let position = "bottom-right";

    // Ensure tooltip doesn't go below viewport - if it would, adjust upward
    if (top + tooltipHeight > window.innerHeight - viewportPadding) {
      top = window.innerHeight - tooltipHeight - viewportPadding;
    }

    // Ensure tooltip doesn't go off the right edge
    if (right < viewportPadding) {
      right = viewportPadding;
    }

    // Ensure tooltip doesn't go off the left edge
    const left = window.innerWidth - right - tooltipWidth;
    if (left < viewportPadding) {
      right = window.innerWidth - tooltipWidth - viewportPadding;
    }

    setTooltipPosition({ top, right, position });
  };

  const handleMouseEnter = () => {
    const times = setTimeout(() => {
      setShowTooltip(true);
    }, 300);
    setTimer(times);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    setShowTooltip(false);
  };

  useEffect(() => {
    if (showTooltip) {
      // Use requestAnimationFrame and a small delay to ensure tooltip is fully rendered and we can measure it
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          calculateTooltipPosition();
        });
      }, 10);
      // Recalculate on scroll or resize
      window.addEventListener("scroll", calculateTooltipPosition, true);
      window.addEventListener("resize", calculateTooltipPosition);

      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener("scroll", calculateTooltipPosition, true);
        window.removeEventListener("resize", calculateTooltipPosition);
      };
    }
  }, [showTooltip]);

  return (
    <>
      <div className={`${styles.card} ${showTooltip ? styles.cardWithTooltip : ""}`} ref={cardRef}>
        {title && (
          <div ref={iconRef} className={styles.infoIcon} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <IoMdInformationCircleOutline size={16} style={{ cursor: "pointer" }} />
          </div>
        )}
        <p className={styles.cardLabel}>{text}</p>
        <div className={styles.seperater}></div>
        {loading ? (
          <div className={styles.loaderContainer}>
            <Loader2 />
          </div>
        ) : isNumber ? (
          <p className={`${styles.cardValue} ${parseFloat(number) < 0 ? styles.negative : ""}`}>₹{formatNumber(number, 2, true)}</p>
        ) : (
          <p className={styles.cardValue}>{number}</p>
        )}
      </div>
      {title && showTooltip && typeof document !== "undefined" && createPortal(
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${tooltipPosition.position === "top-right" ? styles.tooltipTopRight : styles.tooltipBottomRight}`}
          style={{
            right: `${tooltipPosition.right}px`,
            top: `${tooltipPosition.top}px`,
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {title}
        </div>,
        document.body
      )}
    </>
  );
}
