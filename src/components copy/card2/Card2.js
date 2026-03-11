import { AiFillDollarCircle, AiFillMoneyCollect } from "react-icons/ai";
import styles from "./styles/card.module.css";
import { formatNumber } from "@/utils/utll";
export default function Card2({ text, number, isNumber = true }) {
	return (
		<div className={styles.card}>
			{isNumber && <AiFillDollarCircle size={20} />}
			<p>{text}</p>
			<p style={{ fontSize: "1.5rem" }}>/</p>
			<p className={parseFloat(number) < 0 ? styles.negative : ""}>
				{isNumber ? "₹" : ""}
				{formatNumber(number)}
			</p>
		</div>
	);
}
