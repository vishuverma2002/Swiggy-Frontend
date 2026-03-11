import { useCallback, useEffect, useState } from "react";
import styles from "./style/table.module.css";
import { axios_, axios_get, jsonToArray, axios_Investor } from "./../../utils/utll";
import { AiFillEdit } from "react-icons/ai";
import { useContext } from "react";
import { Context } from "../../store/store";
import Loader from "../loader/Loader";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import { GiInfo } from "react-icons/gi";

import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs";
import { IoIosRefresh } from "react-icons/io";
import DownloadFile from "../DownloadFile/DownloadFile";
import Link from "next/link";
import { useRouter } from "next/router";
import ContextMenu from "../contextMenu";

export default function Table({
  onRefresh,
  mainData,
  cellOnClick = {},
  searchText = "",
  noDataMessage = "No transaction found for the selected criteria",
  name = "",
  fetch = {},
  showUpDown = false,
  CellWidth = "auto",
  showEdit = true,
  onEdit = () => {},
  showOptions = false,
  recordCount = 250,
  minHeight = "8rem",
  maxWidth = "auto",
  // height = "45rem",
  height = "auto",
  options = undefined,
  isClient = false,
  middleware = (data) => {
    return data;
  },
}) {
  const router = useRouter();
  const { updateTableData, tbldata, fieldsMap, setTableRefresh, tblRefresh, clientPages } = useContext(Context);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(1);
  const [recordsperPage, setRecordPerPage] = useState(recordCount);
  const [totalPages, setTotalPages] = useState();
  const [hoveredTooltip, setHoveredTooltip] = useState(null);
  // const [menuItem, setMenuItems] = useState({ content: "Assign-Client", content: "Page-Access" });

  const filterTable = () => {
    let searchData = [...rawData];
    if (searchText == "") {
      searchData = jsonToArray(searchData, fieldsMap, name, EditButton, showEdit, UpDown, showUpDown, options != undefined, OtherOption);
      setTableData(searchData);
      setTotalPages(Math.ceil((searchData.length - 1) / recordCount));
    } else {
      searchData = searchData.filter((record) => {
        return JSON.stringify(record).toUpperCase().includes(searchText.toUpperCase());
      });

      searchData = jsonToArray(searchData, fieldsMap, name, EditButton, showEdit, UpDown, showUpDown, options != undefined, OtherOption);
      setTableData(searchData);
      setTotalPages(Math.ceil((searchData.length - 1) / recordCount));
    }
  };

  useEffect(() => {
    filterTable();
  }, [searchText]);

  const fetchTableData = useCallback(async () => {
    try {
      if (fetch?.api) {
        let res;
        setLoading(true);
        if (fetch.type === "post") {
          if (clientPages.includes(router.asPath)) {
            res = await axios_Investor.post(fetch.api, fetch.data);
          } else {
            res = await axios_.post(fetch.api, fetch.data);
          }
        } else {
          if (clientPages.includes(router.asPath)) {
            res = await axios_Investor.get(fetch.api);
          } else {
            res = await axios_get(fetch.api);
          }
        }

        if (res?.status == 200) {
          let data = res.data?.data;
          if (!data) data = res.data;
          data = middleware(data, name);
          if (data && data?.length > 0) {
            assignFieldsToTable(data);
            updateTableData(name, [...data]);
            setTotalPages(Math.ceil((data.length - 1) / recordCount));
          } else {
            setTableData([]);
            updateTableData(name, []);
          }
        } else {
          setTableData([]);
          updateTableData(name, []);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }, [name, fetch.data, fetch.api]);

  useEffect(() => {
    if (!Array.isArray(mainData)) return;
    assignFieldsToTable(mainData);
    updateTableData(name, [...mainData]);
    setTotalPages(Math.ceil((mainData.length - 1) / recordCount));
  }, [mainData]);

  useEffect(() => {
    fetchTableData();
    setTableRefresh((prev) => {
      let obj = { ...prev, [name]: fetchTableData };
      return obj;
    });
  }, [fetchTableData]);

  useEffect(() => {
    let data = rawData;
    if (data) assignFieldsToTable(data);
  }, [fieldsMap]);

  function assignFieldsToTable(data) {
    if (data) {
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
              return <ContextMenu key={index} menu={option.item} data={record} zIndex={10002} />;
            } else {
              return (
                <span key={`RecordOption_${index}`} onClick={() => option?.event?.(record)} style={{ cursor: "pointer", marginInline: "5px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {typeof option.item == "function" ? option.item(record) : option.item}
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

  // Helper function to truncate string values
  const truncateCell = (value) => {
    if (value === null || value === undefined) return value;

    const stringValue = String(value);

    // Check if it's a number (including formatted numbers with commas)
    const isNumber = !isNaN(parseFloat(stringValue.replaceAll(",", ""))) && stringValue.replaceAll(",", "").trim() !== "";

    // Don't truncate numbers
    if (isNumber) return value;

    // Truncate strings longer than 50 characters
    if (stringValue.length > 50) {
      return stringValue.substring(0, 50) + "...";
    }

    return value;
  };

  // Tooltip handlers
  const handleTooltipMouseEnter = (colIndex) => {
    setHoveredTooltip(colIndex);
  };

  const handleTooltipMouseLeave = () => {
    setHoveredTooltip(null);
  };
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

  return (
    <div className={styles.gridContainer} style={{ "--height": height, "--stickyPixel": showOptions ? "20px" : "0px", maxWidth }}>
      {showOptions && (
        <div className={styles.options}>
          <div className={styles.optionsContainer}>
            <button
              className={`${styles.optionButton} ${styles.refreshButton}`}
              onClick={async () => {
                if (onRefresh) {
                  setLoading(true);
                  await onRefresh();
                  setLoading(false);
                } else {
                  fetchTableData();
                }
              }}
              title="Refresh Table"
            >
              <IoIosRefresh size={18} />
              <span>Refresh</span>
            </button>
            <div className={styles.paginationControls}>
              <button className={`${styles.optionButton} ${styles.pageButton} ${page === 1 ? styles.disabled : ""}`} onClick={() => handleChangePage(page - 1)} disabled={page === 1} title="Previous Page">
                <BsArrowBarLeft size={18} />
                <span>Previous</span>
              </button>
              <div className={styles.pageIndicator}>
                <span className={styles.pageText}>
                  Page <strong>{page}</strong> of <strong>{totalPages == 0 ? 1 : totalPages}</strong>
                </span>
              </div>
              <button className={`${styles.optionButton} ${styles.pageButton} ${page === totalPages ? styles.disabled : ""}`} onClick={() => handleChangePage(page + 1)} disabled={page === totalPages} title="Next Page">
                <span>Next</span>
                <BsArrowBarRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      {tableData?.length ? (
        <div className={styles.tableContainer} style={{ paddingBottom: options ? "7rem" : 0 }}>
          <table className={`${styles.table} ${CellWidth !== "auto" ? styles.special : ""}`} style={{ "--CellWidth": CellWidth, "--top": showOptions ? "0px" : "-1px" }}>
            <thead>
              {/* Headers */}
              <tr className={styles.sticky}>
                {tableData[0].map((cell, colIndex) => {
                  let align = Object.entries(fieldsMap[name]).filter((entry) => entry[1].header == cell)[0]?.[1]?.align || "center";
                  let help = Object.entries(fieldsMap[name]).filter((entry) => entry[1].header == cell)[0]?.[1]?.help;
                  return (
                    <th key={`th${colIndex}`} style={{ textAlign: align }}>
                      <div style={{ display: "flex", justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center", gap: "10px", alignItems: "center", position: "relative" }}>
                        <p style={{ display: "inline", margin: 0 }}> {cell} </p>
                        {help && (
                          <span className={styles.infoIconWrapper} onMouseEnter={() => handleTooltipMouseEnter(colIndex)} onMouseLeave={handleTooltipMouseLeave}>
                            <GiInfo size={15} className={styles.infoIcon} />
                            {hoveredTooltip === colIndex && <div className={styles.tooltip}>{help}</div>}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableData[0]?.length &&
                tableData.slice((page - 1) * recordsperPage + 1, page * recordsperPage + 1).map((row, index) => {
                  return (
                    <tr key={`tr${index}`}>
                      {tableData[(page - 1) * recordsperPage + index + 1].map((cell, colIndex) => {
                        let align = Object.entries(fieldsMap[name]).filter((entry) => entry[1].header == tableData[0][colIndex])[0]?.[1]?.align || "center";
                        return (
                          <td
                            className={`${styles.cell} ${!isNaN(parseFloat(cell?.toString().replaceAll(",", ""))) && parseFloat(cell.toString().replaceAll(",", "")) < 0 ? styles.negative : ""}`}
                            key={`td${colIndex}`}
                            style={{
                              textAlign: align,
                            }}
                          >
                            {cellOnClick[`${index}${colIndex}`] ? (
                              <span className={styles.clickableCell} onClick={(e) => cellOnClick[`${index}${colIndex}`](row)}>
                                {truncateCell(cell)}
                              </span>
                            ) : cellOnClick[`${colIndex}`] ? (
                              <span
                                className={styles.clickableCell}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cellOnClick[`${colIndex}`](row);
                                }}
                              >
                                {truncateCell(cell)}
                              </span>
                            ) : tableData[0][colIndex].toLowerCase().split(" ").includes("file") ? (
                              <span style={{ display: "flex", justifyContent: "center" }}>
                                <DownloadFile fName={cell} />
                              </span>
                            ) : tableData[0][colIndex].toLowerCase().includes("mail") ? (
                              <Link style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }} href={`mailto:${cell}`}>
                                {truncateCell(cell)}
                              </Link>
                            ) : (
                              truncateCell(cell)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                  c;
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noData} style={{ "--minHeight": minHeight, width: "100%" }}>
          {noDataMessage}
        </div>
      )}
    </div>
  );
}
