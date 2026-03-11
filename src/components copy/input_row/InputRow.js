import { capitalizeText } from "@/utils/utll";
import Heading from "@/components/heading/Heading";
import styles from "./styles/input_row.module.css";
export default function InputRow({ children, align, col = 3, title, visible = true, style = {} }) {
  if (!visible) return <></>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", ...style }}>
      {title && (
        <Heading text={capitalizeText(title)} type="heading_primary" />
      )}
      <div style={{ "--col": col }} className={`${styles.InputRow} ${align ? styles[align] : ""}`}>
        {children}
      </div>
    </div>
  );
}
