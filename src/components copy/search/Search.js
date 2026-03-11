import { forwardRef, useEffect } from "react";
import styles from "./styles/search.module.css";
import { BsSearch } from "react-icons/bs";

function Search({ isError, type, title, name, onChange }, ref) {
    function handleChange(e) {
        onChange(e.target.value);
    }
    return (
        <>
            <div className={styles.container}>
                {title && <span className={styles.label}>{title}</span>}
                <BsSearch className={styles.icon} />
                <input
                    type={type}
                    ref={ref}
                    onChange={handleChange}
                    placeholder={"Search"}
                    className={`${styles.input} ${isError ? styles.error : ""}`}
                    name={name || "search"}
                    autoComplete="off" />
            </div>
        </>
    );
}

export default forwardRef(Search);
