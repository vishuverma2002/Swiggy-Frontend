import { useState } from "react";
import styles from "./style.module.css";

function InputGroup({ name, controls = [], value = {}, onChange = () => { }, disabled, title }) {
  const [values, setValues] = useState([]);

  function handleOnChange(e) {
    let localval = { ...values, [e.target.name]: e.target.value };
    setValues(localval);
    onChange({ target: { name, value: localval } });
  }
  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      {title && (
        <span className={styles.label}>
          <span>{title}</span>
        </span>
      )}
      {Array.isArray(controls) ? (
        controls.map((input, index) => {
          return (
            <div key={`inputG_${index}`} className={styles.tdInput}>
              <input name={input.name} className={styles.input} type="number" placeholder={input.placeholder} style={{ width: "50px" }} value={value[input.name]} onChange={handleOnChange} autoComplete="off" />
              <span className={styles.suffix}>{input.suffix}</span>
            </div>
          );
        })
      ) : (
        <>No input</>
      )}
    </div>
  );
}

export default InputGroup;
