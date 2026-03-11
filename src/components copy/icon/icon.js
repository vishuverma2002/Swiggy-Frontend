import styles from "./style/icon.module.css";
export default function Icon({ children, onClick, align }) {
  return (
    <>
      <span onClick={onClick} className={styles.icon}>
        {children}
      </span>
    </>
  );
}
