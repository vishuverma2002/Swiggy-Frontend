import { useCallback, useEffect, useState } from "react";
import styles from "./style/table.module.css";
import { jsonToArray } from "../../utils/utll";
import { AiFillEdit } from "react-icons/ai";
import { useContext } from "react";
import { Context } from "../../store/store";
import Loader from "../loader/Loader";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import ContextMenu from "../contextMenu";

export default function ReportTable({
  mainData = [],
  searchText = "",
  noDataMessage = "No transaction found for the selected criteria",
  name = "",
  showUpDown = false,
  header = "",
  showEdit = true,
  onEdit = () => {},
  options = undefined,
  middleware = (data, name) => {
    return data;
  },
  rowStyles = {},
}) {
  const { updateTableData, fieldsMap, setTableRefresh, tblRefresh } = useContext(Context);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(1);
  const [recordsperPage, setRecordPerPage] = useState(250);
  const [totalPages, setTotalPages] = useState();

  const filterTable = () => {
    let searchData = [...rawData];
    if (searchText == "") {
      searchData = jsonToArray(searchData, fieldsMap, name, EditButton, showEdit, UpDown, showUpDown, options != undefined, OtherOption);
      setTableData(searchData);
      setTotalPages(Math.ceil((searchData.length - 1) / 250));
    } else {
      searchData = searchData.filter((record) => {
        return JSON.stringify(record).toUpperCase().includes(searchText.toUpperCase());
      });

      searchData = jsonToArray(searchData, fieldsMap, name, EditButton, showEdit, UpDown, showUpDown, options != undefined, OtherOption);
      setTableData(searchData);
      setTotalPages(Math.ceil((searchData.length - 1) / 250));
    }
  };

  useEffect(() => {
    filterTable();
  }, [searchText]);

  const fetchTableData = useCallback(() => {
    try {
      let data = middleware(mainData, name);
      assignFieldsToTable(data);
      updateTableData(name, data);
      setTotalPages(Math.ceil((data.length - 1) / 250));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    tblRefresh[name] = fetchTableData;
    fetchTableData();
  }, [fetchTableData]);

  useEffect(() => {
    let data = rawData;
    if (data) assignFieldsToTable(data);
    setTableRefresh((prev) => {
      let obj = { ...prev, [name]: fetchTableData };
      return obj;
    });
  }, [fieldsMap]);

  function assignFieldsToTable(data) {
    if (data.length > 0) {
      setRawData(data);
      updateTableData(name, data);
      data = jsonToArray(data, fieldsMap, name, EditButton, showEdit, UpDown, showUpDown, options != undefined, OtherOption);
      setTableData(data);
    }
  }

  function EditButton({ record, index }) {
    return (
      <div className={styles.editButton}>
        <AiFillEdit
          onClick={() => {
            onEdit(record);
          }}
        />
      </div>
    );
  }
  // Move Records up and Down.
  useEffect(() => {
    assignFieldsToTable(rawData);
  }, [rawData]);
  function moveUp(index) {
    setRawData((prev) => {
      let data = [...prev];
      let temp = data[index];
      data[index] = data[index - 1];
      data[index - 1] = temp;
      return data;
    });
  }
  function moveDown(index) {
    setRawData((prev) => {
      let data = [...prev];
      let temp = data[index];
      data[index] = data[index + 1];
      data[index + 1] = temp;
      return data;
    });
  }
  function UpDown({ index, hideUp = false, hideDown = false }) {
    return (
      <div className={styles.editButton}>
        {!hideDown && (
          <HiArrowCircleDown
            size={25}
            onClick={() => {
              moveDown(index);
            }}
          />
        )}
        {!hideUp && (
          <HiArrowCircleUp
            size={25}
            onClick={() => {
              moveUp(index);
            }}
          />
        )}
      </div>
    );
  }

  function OtherOption({ record }) {
    return (
      <div className={styles.optionsContext}>
        {options.length > 0 ? (
          options.map((option, index) => {
            if (Array.isArray(option?.item)) {
              return <ContextMenu key={index} menu={option.item} data={record} />;
            } else {
              return (
                <span key={`RecordOption_${index}`} onClick={() => option?.event?.(record)} style={{ cursor: "pointer", marginInline: "5px" }}>
                  {typeof option.item === "function" ? option.item(record) : option.item}
                </span>
              );
            }
          })
        ) : (
          <span>No Options Available</span>
        )}
      </div>
    );
  }
  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.gridContainer} style={{ "--height": "100%" }}>
      <div className={styles.tableContainer}>
        {tableData?.length ? (
          <table
            className={`actualTable`}
            style={{
              maxWidth: "100%",
              minWidth: "50%",
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "10px",
              color: "#000",
            }}
          >
            <thead>
              {header ? (
                <tr>
                  <th colSpan={Object.entries(fieldsMap[name]).length} style={{ fontSize: "14px", paddingBottom: "10px", textAlign: "left", color: "#000000", fontWeight: 600, WebkitFontSmoothing: "antialiased", MozOsxFontSmoothing: "grayscale", textRendering: "optimizeLegibility" }}>
                    {header}
                  </th>
                </tr>
              ) : null}
              <tr>
                {tableData[0].map((cell, colIndex) => {
                  let fieldEntry = Object.entries(Object.entries(fieldsMap[name] || {}))[colIndex];
                  let align = fieldEntry?.[1]?.[1]?.align || "center";
                  return (
                    <th
                      key={`th${colIndex}`}
                      style={{
                        backgroundColor: "rgba(218, 227, 254, 1)",
                        color: "#000000",
                        fontWeight: 600,
                        padding: "10px 0.5rem",
                        textAlign: align,
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "optimizeLegibility",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
                          width: "100%",
                        }}
                      >
                        {cell}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableData
                .filter((_, i) => i > 0)
                .map((row, index) => {
                  let isTotal = row.join(",").toLowerCase().includes("total") || row[0].toLowerCase().includes("net ");

                  return (
                    <tr
                      key={`tr${index}`}
                      style={{
                        fontWeight: isTotal ? 600 : 400,
                        fontSize: "10px",
                        borderTop: isTotal ? "1px  solid rgba(109, 131, 197, 1)" : "none",
                        borderBottom: isTotal ? "2px  double rgba(109, 131, 197, 1)" : "none",
                        ...rowStyles,
                      }}
                    >
                      {row.map((cell, colIndex) => {
                        let isNegative = !isNaN(parseFloat(cell?.toString().replaceAll(",", ""))) && parseFloat(cell.toString().replaceAll(",", ""));
                        let textAlign = Object.entries(Object.entries(fieldsMap[name]))[colIndex]?.[1][1].align || "center";
                        let style = Object.entries(Object.entries(fieldsMap[name]))[colIndex]?.[1][1]?.styles;
                        return (
                          <td
                            className={`${styles.cell} ${isNegative < 0 ? styles.negative : ""}`}
                            key={`td${colIndex}`}
                            style={{
                              textAlign,
                              ...style,
                              paddingBlock: "3px",
                              paddingInline: "5px",
                            }}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        ) : (
          <table className={`actualTable`} style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ paddingBlock: "40px" }} className={styles.noData}>
                  {noDataMessage}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
