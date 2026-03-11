import styles from "./styles/button.module.css";

export default function Button({
  loading = false,
  btnType = "btnPrimary",
  title,
  marginTop = 0,
  frmIndex = 0,
  align,
  style,
  disabled = false,
  onClick = (e) => {
    e.preventDefault();
  },
}) {
  const isDisabled = loading || disabled;
  return (
    <div
      style={{ marginTop: `${marginTop}px`, ...style, textAlign: "center" }}
      onClick={(e) => {
        if (!isDisabled) {
          onClick.call(this, e, frmIndex);
        }
      }}
      className={`${styles[btnType]} ${isDisabled ? styles.loading : ""} ${align ? styles[align] : ""} ${isDisabled ? styles.disabled : ""} `}
    >
      {!loading ? title : <span className={styles.loader} />}
    </div>
  );
}
