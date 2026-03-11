import styles from "./styles/heading.module.css";

export default function Heading({ text, children, type = "heading_primary", as: Tag = "h1", style }) {
  return (
    <Tag className={styles[type]} style={{ ...style }}>
      {children ?? text}
    </Tag>
  );
}
