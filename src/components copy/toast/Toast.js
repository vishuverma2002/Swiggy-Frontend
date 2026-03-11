import { useEffect } from "react";
import styles from "./styles/toast.module.css";

export default function Toast({ message = "Success", title = "InvestLytics", unloader = () => { }, success = true }) {
	useEffect(() => {
		const timeOut = setTimeout(() => {
			unloader(null);
		}, 4000);
		return () => {
			clearTimeout(timeOut);
		};
	}, [message, unloader]);
	return (
		<div className={`${styles.toastContainer} ${success ? styles.successDiv : styles.dangerDiv}`}>
			{title && <div className={styles.title}>{title}</div>}
			{message && <div className={`${styles.message} `}>{message}</div>}
			<div className={`${styles.progress} ${success ? styles.success : styles.danger}`} />
		</div>
	);
}
