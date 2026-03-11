import { formatNumber } from "@/utils/utll";
import Loader from "../loader/Loader";
import styles from "./style/table.module.css";

export const HorizontalTable = ({ data = [], columns = [], loading, report = false }) => {
  if (loading) {
    return <Loader />;
  }
  return (
    <div className={styles.tableContainer}>
      {data?.length ? (
        <table className={report ? styles.reportTable : styles.table}>
          <tbody>
            {columns.map((column, columnIndex) => (
              <tr key={columnIndex}>
                <th> {column.text} </th>
                {data?.map((dataItem, dataIndex) => (
                  <HorizontalTableCell key={dataIndex} data={dataItem} column={column} columnIndex={columnIndex} report={report} colTxt={column.text} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ fontSize: "10px", color: "var(--primary-color)" }}>No Data Available</div>
      )}
    </div>
  );
};

const HorizontalTableCell = ({ data, column, columnIndex, report, colTxt }) => {
  let isNumber = !isNaN(data?.[column.field] || "-");
  let value = data?.[column.field] || 0;
  if (isNumber) {
    if (value) {
      if (colTxt?.includes("%") || column.field === "standard_deviation" || column.field === "risk_free_rate") {
        if (value <= 1) {
          value = `${(value * 100).toFixed(2)}%`;
        } else {
          value = `${value.toFixed(2)}%`;
        }
        isNumber = false;
      }
    }
  }

  return (
    <td style={{ textAlign: "center" }} className={isNumber && value < 0 ? styles.negative : ""}>
      {isNumber ? `${formatNumber(value)}` : value ? value : "-"}
    </td>
  );
};
