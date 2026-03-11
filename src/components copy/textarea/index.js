import styles from "./style.module.css";

function TextArea({ name, title = "", value = "", onChange = () => {} }) {
  return <textarea name={name} className={styles.input} rows={5} autoFocus placeholder={title} value={value} onChange={onChange} />;
}
export default TextArea;
