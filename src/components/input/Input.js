import React, { forwardRef, useEffect, useRef, useState } from "react";
import styles from "./styles/input.module.css";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Loader2 } from "../Loader/Loader";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { RxEyeClosed } from "react-icons/rx";

function Input({ secure = false, placeholder = "", errMessage = "", length = 1000, isValid = true, type, help = "", title, name, onChange, value = "", min = 0, max = undefined, disabled = false, isLoading = false, isString = false }, ref) {
  let localref = useRef();
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    setIsSecure(secure);
  }, [secure]);

  useEffect(() => {
    if (!isValid) {
      localref.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }, [isValid]);

  if (type == "datetime") type = "datetime-local";

  // Handler to fix date input year formatting issue (preventing 2025 -> 20025)
  const handleDateInput = (e) => {
    if (type === "date" || type === "datetime-local") {
      const inputValue = e.target.value;
      // Check if the input value contains a malformed year (more than 4 digits)
      if (inputValue && inputValue.includes("-")) {
        const parts = inputValue.split("-");
        if (parts.length >= 1 && parts[0]) {
          let year = parts[0];
          // If year has more than 4 digits, fix it by taking only the first 4 digits
          if (year.length > 4) {
            year = year.substring(0, 4);
            // Reconstruct the date string with corrected year
            const correctedValue = parts.length === 3 
              ? `${year}-${parts[1]}-${parts[2]}`
              : parts.length === 2
              ? `${year}-${parts[1]}`
              : year;
            e.target.value = correctedValue;
            // Create a new event with the corrected value, preserving all original properties
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                value: correctedValue,
                name: e.target.name, // Explicitly preserve name property
              }
            };
            onChange(syntheticEvent);
            return;
          }
        }
      }
    }
    onChange(e);
  };

  return (
    <>
      <div className={`${styles.container} ${disabled ? styles.disabled : ""}`} ref={localref}>
        {title && (
          <span className={styles.label}>
            <span>{title}</span>
            {help && (
              <span className={styles.help}>
                <IoHelpCircleOutline />
                <span className={styles.helpBox}>
                  <span>{help}</span>
                </span>
              </span>
            )}
          </span>
        )}
        {secure && (
          <span
            style={{ position: "absolute", top: "10px", zIndex: 2, right: "10px" }}
            onClick={() => {
              setIsSecure((prev) => !prev);
            }}
          >
            {isSecure ? <BsEyeSlash /> : <BsEye />}
          </span>
        )}
        <input data-secure={isSecure} new-password="true" autoComplete="off" maxLength={length} disabled={disabled} type={type} ref={ref} min={min} max={max} step="any" value={isString ? value?.toString() : value ? value : ""} onChange={type === "date" || type === "datetime-local" ? handleDateInput : onChange} onInput={type === "date" || type === "datetime-local" ? handleDateInput : undefined} placeholder={placeholder || title} className={`${styles.input} ${isValid ? "" : styles.error}`} name={name}></input>
        {isLoading && (
          <span className={styles.loaderContainer}>
            <span className={styles.loader}>
              <Loader2 />
            </span>
          </span>
        )}

        {errMessage && <span style={{ fontWeight: "600", color: "#f62626c9", position: "absolute", fontSize: "10px", bottom: -14, right: 2 }}>{errMessage}</span>}
      </div>
    </>
  );
}

export default forwardRef(Input);
