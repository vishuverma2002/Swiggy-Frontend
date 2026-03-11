import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/checkbox.module.css";

function CheckBox({ isValid = true, title, val = false, name, onChange = () => { } }, ref, bgColor = "none") {

  const [value, setValue] = useState(val);
  
  // Sync internal state with val prop when it changes
  useEffect(() => {
    setValue(val === true || val === "true");
  }, [val]);
  
  function CheckUncheck() {
    setValue((prev) => !prev);
  }
  useEffect(() => {
    let e = { target: { name, value } };
    onChange(e);
  }, [value]);

  return (
    <>
      <div className={`${styles.container} ${isValid ? "" : styles.error}`}>
        <input type="checkbox" ref={ref} checked={value} value={value} style={{ backgroundColor: bgColor }} onChange={() => { }} className={`${styles.input} `} name={name || title} />
        <div
          className={styles.checkBoxContainer}
          onClick={() => {
            CheckUncheck();
          }}
        >
          <span className={styles.checkBox} />
          <span className={styles.label}>{title}</span>
        </div>
      </div>
    </>
  );
}
export default forwardRef(CheckBox);
