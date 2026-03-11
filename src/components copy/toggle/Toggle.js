import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/toggle.module.css";

function Toggle({ isValid = true, title, value = false, name, onChange = () => {}, disabled = false }, ref) {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value === true || value === "true" || value === "yes" || value === "Yes");
  }, [value]);
  function CheckUncheck(e) {
    setLocalValue((prev) => !prev);
    onChange(e);
  }
  return (
    <>
      <div
        className={`${styles.container} ${isValid ? "" : styles.error} ${disabled ? styles.disabled : ""}`}
        style={{ pointerEvents: disabled && "none" }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e?.code === "Enter" || e?.code === "Space") {
            e.preventDefault();
            CheckUncheck({ target: { name, value: !localValue } });
          }
        }}
      >
        <div className={styles.toggleContainer} onClick={() => CheckUncheck({ target: { name, value: !localValue } })}>
          <input type="checkbox" ref={ref} checked={localValue} value={localValue} onChange={() => {}} className={`${styles.input} `} name={name} disabled={disabled} />
          <div className={styles.slider} />
          <div className={styles.label}>{title}</div>
        </div>
      </div>
    </>
  );
}

export default forwardRef(Toggle);
