import { formatNumber } from "@/utils/utll";
import { Loader2 } from "../loader/Loader";
import styles from "./styles/card.module.css";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useState } from "react";

export default function Card({ text, number, isNumber = true, loading = false, title = "" }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleMouseEnter = () => {
    const times = setTimeout(() => setShowTooltip(true), 300);
    setTimer(times);
  };

  const handleMouseLeave = () => {
    clearTimeout(timer);
    setShowTooltip(false);
  };

  return (
    <div className={`${styles.card} ${showTooltip ? styles.cardWithTooltip : ""}`}>
      {title && (
        <>
          <div className={styles.infoIcon} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <IoMdInformationCircleOutline size={16} style={{ cursor: "pointer" }} />
          </div>
          {showTooltip && (
            <div className={styles.tooltip} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              {title}
            </div>
          )}
        </>
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
  );
}
