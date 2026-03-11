import { useCallback, useEffect, useState } from "react";
import styles from "./style/table.module.css";
import { jsonToArray } from "../../utils/utll";
import { AiFillEdit } from "react-icons/ai";
import { useContext } from "react";
import { Context } from "../../store/store";
import Loader from "../loader/Loader";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import DownloadFile from "../DownloadFile/DownloadFile";
import Link from "next/link";
import ContextMenu from "../contextMenu";
export default function DataTable({
  mainData = null,
  cellOnClick = {},
  searchText = "",
  noDataMessage = "No transaction found for the selected criteria",
  name = "",
  showUpDown = false,
  CellWidth = "auto",
  showEdit = true,
  onEdit = () => {},
  showOptions = false,
  height = "45rem",
  options = undefined,
  enableScroll = false,
  middleware = (data, name) => {
    return data;
  },
}) {
  const { updateTableData, fieldsMap, setTableRefresh, tblRefresh } = useContext(Context);
  const [tableData, setTableData] = useState(mainData || []);
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
      if (!mainData) {
        setLoading(false);
        return;
      }
      let data = middleware(mainData, name);
      assignFieldsToTable(data);
      updateTableData(name, data);
      setTotalPages(Math.ceil((data.length - 1) / 250));
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [name, mainData]);

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
  const handleChangePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  };

  // Get rows to display based on scroll mode
  const getDisplayRows = () => {
    if (!tableData?.length || !tableData[0]?.length) return [];

    if (enableScroll) {
      // In scroll mode, show all rows except the header row (index 0)
      return tableData.slice(1);
    } else {
      // In pagination mode, show paginated rows (matching original behavior)
      // Original: slice((page-1)*recordsperPage + 1, page*recordsperPage)
      const startIndex = (page - 1) * recordsperPage + 1;
      const endIndex = page * recordsperPage;
      return tableData.slice(startIndex, endIndex);
    }
  };

  const displayRows = getDisplayRows();

  // Calculate the starting index for row numbering (for cellOnClick mapping)
  // This matches the original behavior where row indices start from 0 for the first displayed row
  const getRowStartIndex = () => {
    if (enableScroll) {
      return 0; // In scroll mode, rows are numbered 0, 1, 2, ... (matching tableData indices 1, 2, 3, ...)
    } else {
      return (page - 1) * recordsperPage; // In pagination mode, account for page offset
    }
  };

  const rowStartIndex = getRowStartIndex();

  return (
    <div className={styles.gridContainer} style={{ "--height": height }}>
      <div className={styles.tableContainer} style={enableScroll ? { height: height, maxHeight: height } : {}}>
        {tableData?.length ? (
          <table className={`${styles.table} ${CellWidth !== "auto" ? styles.special : ""}`}>
            <thead>
              {showOptions && !enableScroll && (
                <tr style={{ backgroundColor: "var(--secondary-color)" }} className={styles.options}>
                  <td colSpan={100}>
                    {" "}
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", userSelect: "none" }}>
                      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "10px", gap: "15px" }}>
                        <span onClick={() => tblRefresh[name]()}>
                          {" "}
                          <IoIosRefresh size={15} />{" "}
                        </span>
                        <span style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "10px" }}>
                          <span onClick={() => handleChangePage(page - 1)} disabled={page === 1}>
                            <BsArrowBarLeft size={15} color="rgba(191, 159, 101, 1)" />
                          </span>
                          <span
                            style={{
                              marginInline: "10px",
                              marginBottom: "3px",
                            }}
                          >
                            Page {page} of {totalPages == 0 ? 1 : totalPages}
                          </span>
                          <span onClick={() => handleChangePage(page + 1)} disabled={page === totalPages}>
                            <BsArrowBarRight size={15} color="rgba(191, 159, 101, 1)" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {showOptions && enableScroll && (
                <tr style={{ backgroundColor: "var(--secondary-color)" }} className={styles.options}>
                  <td colSpan={100}>
                    <div style={{ display: "flex", gap: "15px", alignItems: "center", userSelect: "none" }}>
                      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", fontSize: "10px", gap: "15px" }}>
                        <span onClick={() => tblRefresh[name]()} style={{ cursor: "pointer" }}>
                          <IoIosRefresh size={15} />
                        </span>
                        <span style={{ fontSize: "10px" }}>Total Records: {tableData.length - 1}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              {/* Table Headers */}
              <tr className={styles.sticky} style={{ "--CellWidth": CellWidth, "--top": showOptions ? "1.8rem" : "-2px" }}>
                {tableData[0].map((cell, colIndex) => {
                  let fieldEntry = Object.entries(Object.entries(fieldsMap?.[name] || {}))[showEdit ? colIndex - 1 : colIndex];
                  let align = fieldEntry?.[1]?.[1]?.align || "center";
                  return (
                    <th key={`th${colIndex}`} style={{ textAlign: align }}>
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
              {displayRows.map((row, rowIndex) => {
                // actualIndex represents the row number in the original data (0-indexed, excluding header)
                // This is used for cellOnClick mapping and row keys
                const actualIndex = rowStartIndex + rowIndex;
                return (
                  <tr key={`tr${actualIndex}`}>
                    {row.map((cell, colIndex) => {
                      let fieldEntry = Object.entries(Object.entries(fieldsMap?.[name] || {}))[showEdit ? colIndex - 1 : colIndex];
                      let align = fieldEntry?.[1]?.[1]?.align || "center";
                      return (
                        <td className={`${styles.cell} ${!isNaN(parseFloat(cell?.toString().replaceAll(",", ""))) && parseFloat(cell.toString().replaceAll(",", "")) < 0 ? styles.negative : ""}`} key={`td${colIndex}`} style={{ textAlign: align }}>
                          {cellOnClick[`${actualIndex}${colIndex}`] ? (
                            <span className={styles.clickableCell} onClick={cellOnClick[`${actualIndex}${colIndex}`]}>
                              {cell}
                            </span>
                          ) : tableData[0][colIndex].toLowerCase().includes("file") ? (
                            <span style={{ display: "flex", justifyContent: "center" }}>
                              <DownloadFile fName={cell} />
                            </span>
                          ) : tableData[0][colIndex].toLowerCase().includes("mail") ? (
                            <Link style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }} href={`mailto:${cell}`}>
                              {cell}
                            </Link>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className={styles.noData}>
            <span>{noDataMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
