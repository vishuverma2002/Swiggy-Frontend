import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/styles.module.css";

function RadioGroup({ options = [], isValid = true, title, val, name, onChange = () => {}, disabled = false }, ref) {
  const [value, setValue] = useState(val);
  useEffect(() => {
    setValue(val || false);
  }, [val]);
  useEffect(() => {
    let e = { target: { name, value } };
    onChange(e);
  }, [value]);
  return (
    <>
      <div className={`${styles.container} ${isValid ? "" : styles.error} `}>
        <div className={styles.checkBoxContainer}>
          {title && <span className={styles.label}>{title}</span>}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginInline: title ? "20px" : "0px" }}>
            {options.map((option, index) => {
              return (
                <div
                  onKeyDown={(e) => {
                    if (e?.code == "Enter" || e?.code == "Space") {
                      e.preventDefault();
                      setValue(option.value);
                    }
                  }}
                  tabIndex={0}
                  key={`${name}_${index}`}
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={() => {
                    disabled ? () => {} : setValue(option.value);
                  }}
                >
                  <span className={`${styles.checkBox} ${value == option.value ? styles.checked : ""}`} />
                  <span className={styles.label}>{option.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
export default forwardRef(RadioGroup);
