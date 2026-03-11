import Heading from "../heading/Heading";
import styles from "./styles/form.module.css";

export default function Form({ children, title = "", notes = "", name = "", style = {}, fullHeight = false, onSubmit }) {
  return (
    <form
      className={`${styles.form} ${fullHeight == true ? styles.fullHeight : ""}`}
      style={{ ...style }}
      name={name.replaceAll(" ", "_")}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onSubmit={(e) => {
        e.preventDefault();
        if (typeof onSubmit === "function") onSubmit(e);
      }}
    >
      {title.length > 0 ? (
        <span className={styles.formheading}>
          <span style={{ marginBottom: "5px" }}>
            <Heading text={title} type="heading_primary" />
          </span>
          {notes.length > 0 && <span>{notes}</span>}
        </span>
      ) : (
        <></>
      )}
      {children}
    </form>
  );
}
