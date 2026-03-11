import { formatNumber } from "@/utils/utll";
import Loader from "../loader/Loader";
import styles from "./style/table.module.css";

export const HorizontalTable = ({ data = [], columns = [], loading, }) => {
	if (loading) {
		return <Loader />;
	}
	return (
		<div className={styles.tableContainer}>
			{data?.length ? <table className={`${styles.reportTable} actualTable`} >
				<tbody >
					{columns.map((column, columnIndex) => (
						<tr key={columnIndex}>
							<th > {column.text} </th>
							{data?.map((dataItem, dataIndex) => (
								<HorizontalTableCell key={dataIndex} data={dataItem} column={column} columnIndex={columnIndex} />
							))}
						</tr>
					))}
				</tbody>

			</table> : <div style={{ fontSize: '10px', color: 'var(--primary-color)' }}>No Data Available</div>}
		</div>
	);
};

const HorizontalTableCell = ({ data, column, columnIndex, report }) => {
	const isNotaNumber = isNaN(data?.[column.field] || 0);
	const value = data?.[column.field];
	return (
		<td
			style={{ textAlign: "right", }}
			className={!isNotaNumber && value < 0 ? styles.negative : ""}>
			{isNotaNumber ? value : `${formatNumber(value)}`}
		</td>
	);
};
