import { forwardRef } from "react";
import styles from "./styles/search.module.css";
import { BsSearch } from "react-icons/bs";

function Search({ isError, type, title, name, onChange = () => {}, compact, nav }, ref) {
    function handleChange(e) {
        onChange(e.target.value);
    }
    return (
        <>
            <div className={`${styles.container} ${compact ? styles.compact : ""} ${nav ? styles.nav : ""}`}>
                {title && <span className={styles.label}>{title}</span>}
                <BsSearch className={styles.icon} />
                <input
                    type={type}
                    ref={ref}
                    onChange={handleChange}
                    placeholder={"Search"}
                    className={`${styles.input} ${isError ? styles.error : ""} ${nav ? styles.navInput : ""}`}
                    name={name || "search"}
                    autoComplete="off" />
            </div>
        </>
    );
}

export default forwardRef(Search);
