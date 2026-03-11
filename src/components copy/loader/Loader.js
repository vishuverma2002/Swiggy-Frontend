import styles from "./styles/loader.module.css";

export function Loader2() {
    return <span className={styles.loader}></span>;
}
export function Loader3() {
    return <div className={styles.loader4}></div>;
}
export function Loader4() {
    return <div className={styles.loader5}></div>;
}

export default function Loader({ text = "" }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
            <div className={styles.flipping} style={{ alignSelf: "center" }}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <span style={{ fontSize: ".8rem", textAlign: "center", fontWeight: "bold", marginTop: "20px" }}>{text}</span>
        </div>
    );
}
