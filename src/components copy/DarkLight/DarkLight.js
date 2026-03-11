import { forwardRef, useEffect, useState } from "react";
import styles from "./styles/darkLight.module.css";
import Toggle from "../toggle/Toggle";
import { BsMoon, BsMoonFill, BsSun, BsSunFill } from "react-icons/bs";

function DarkLight({ isValid = true, title, value = false, name, onChange = () => {} }, ref) {
  const [localValue, setLocalValue] = useState(value === "true" || value === "yes" || value === "Yes" || value === true);
  function CheckUncheck() {
    setLocalValue((prev) => !prev);
  }
  useEffect(() => {
    let e = { target: { name, value: localValue } };
    onChange(e);
  }, [localValue]);
  return;
  // <div className={styles.darkLight}>{<span onClick={CheckUncheck}> {localValue ? <BsMoonFill size={20} /> : <BsMoonFill size={20} />}</span>}</div>;
  // return <div className={styles.darkLight}>{<span onClick={CheckUncheck}> {localValue ? <BsSunFill size={20} /> : <BsMoonFill size={20} />}</span>}</div>;
}
export default forwardRef(DarkLight);
