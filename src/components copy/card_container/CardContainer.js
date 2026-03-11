import styles from "./styles/cardContainer.module.css";
export default function CardContainer({ veritcal = false, children, title = "", style = {} }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "100%", alignItems: "center", ...style }}>
      {title && <span>{title}</span>}
      <div className={veritcal ? `${styles.cardContainer} ${styles.vertical}` : `${styles.cardContainer} ${styles.horizontal}`}>{children}</div>
    </div>
  );
}
