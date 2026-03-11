import styles from "./style.module.css"


function Label({ value, align }) {
    return <span className={styles.label} style={{ justifySelf: align == 'right' ? 'flex-end' : 'flex-start' }} >{typeof value === 'function' ? value() : value}</span>
}

export default Label
