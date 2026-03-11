import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/styles.module.css";

function RadioGroup({ options = [], isValid = true, title, val, name, onChange = () => {}, disabled = false }, ref) {
  const [value, setValue] = useState(val || []);

  function handleOnChange(val) {
    if (value.includes(val)) {
      setValue((prev) => {
        let newVal = value.filter((i) => i !== val);
        return newVal;
      });
    } else {
      setValue((prev) => {
        let newVal = [...prev, val];
        return newVal;
      });
    }
  }
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
                      if (disabled || option?.disabled) return;
                      handleOnChange(option.value);
                    }
                  }}
                  tabIndex={0}
                  key={`${name}_${index}`}
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                  onClick={() => {
                    disabled || option?.disabled ? () => {} : handleOnChange(option.value);
                  }}
                >
                  <span className={`${styles.checkBox} ${value.includes(option.value) ? styles.checked : ""} ${option?.disabled ? styles.disabled : ""}`} />
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
