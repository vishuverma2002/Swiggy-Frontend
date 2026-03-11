import styles from "./styles/heading.module.css";

export default function Heading({ text, type = "heading_primary", style }) {
  return <h1 className={styles[type]} style={{ ...style }}>{text}</h1>;
}
