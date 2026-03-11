import { forwardRef, useState, useEffect, useRef, useContext } from "react";
import styles from "./styles/select.module.css";
import { axios_, axios_get, axios_Investor } from "@/utils/utll";
import { HiSelector } from "react-icons/hi";
import { Loader2 } from "../loader/Loader";
import { IoHelpCircleOutline } from "react-icons/io5";
import { Context } from "@/store/store";
import { useRouter } from "next/router";
import { IoMdRefresh } from "react-icons/io";

function Select({ errMessage = "", ddnType = "advisor", isFetched = () => {}, contact = [], disable = false, ddnField = [0, 1], help = "", filter, fetch = undefined, selectorText = "", options = [], isValid = true, title = null, name = "", value = "", frmIndex = 0, onChange = () => {}, isLoading = false, defaultSelected = 0 }, inputRef) {
  const router = useRouter();
  const { setDropdownsData, setDropdowns, clientPages, clientPageAdvisorDropDown } = useContext(Context);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(isLoading || true);
  const [selectionOption, setSelectOption] = useState(Array.isArray(options) ? [...options] : []);
  const [selectionOptionAll, setSelectOptionAll] = useState(Array.isArray(options) ? [...options] : []);
  const [dropDown, setDropDown] = useState(false);
  const [isDisabled, setIsdisabled] = useState(false);
  const [localVal, setLocalVal] = useState();
  const [search, setSearch] = useState("");
  const [refIndex, setRefIndex] = useState(-1);
  let localref = useRef();
  const searchInputRef = useRef();
  const closeTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isValid) {
      localref.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }, [isValid]);
  useEffect(() => {
    try {
      getOptions();
    } catch (e) {
      console.log(e);
    }
  }, [fetch, defaultSelected, JSON.stringify(options)]);
  useEffect(() => {
    searchInputRef.current && searchInputRef.current.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [searchInputRef.current]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (localref.current && !localref.current.contains(event.target)) {
        // Clear any pending close timeout
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        setSearch(undefined);
        setDropDown(false);
        isHoveringRef.current = false;
        setIsHovering(false);
      }
    };

    if (dropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown]);

  // Handle mouse leave with delay
  const handleMouseLeave = (e) => {
    // Don't close if dropdown is already closed
    if (!dropDown) return;
    
    // Don't close if the mouse is moving to a child element within the container
    if (e?.relatedTarget && localref.current?.contains(e.relatedTarget)) return;
    
    isHoveringRef.current = false;
    setIsHovering(false);
    // Add a small delay before closing to allow smooth cursor movement
    closeTimeoutRef.current = setTimeout(() => {
      // Double-check that we're still not hovering before closing
      if (!isHoveringRef.current && dropDown) {
        setDropDown(false);
        setSearch(undefined);
      }
    }, 150);
  };

  // Handle mouse enter to cancel close
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    setIsHovering(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    try {
      updateOnValueChange();
    } catch (e) {
      console.log("Error In Setting value of ", name, e);
    }
  }, [value, selectionOptionAll]);

  function updateOnValueChange() {
    if (value === "") {
      return setLocalVal("");
    }
    if ((value !== localVal || value != selected) && ddnField.length >= 1 && selectionOptionAll.length >= 1) {
      let currentValue = selectionOptionAll.filter((option) => {
        return option[ddnField[0]]?.toString() === value.toString();
      });
      if (currentValue.length >= 1) {
        currentValue = currentValue[0][ddnField.length > 1 ? ddnField[1] : ddnField[0]];
        setLocalVal(currentValue);
        setSearch(undefined);
      }
    }
  }
  useEffect(() => {
    try {
      if (!search || search === "") {
        selectionOptionAll.length > 0 && setSelectOption(selectionOptionAll);
      } else {
        setSelectOption(
          selectionOptionAll.filter((item) => {
            if (contact.length > 0) {
              return item
                .map((item, index) => (contact.includes(index) ? item : ""))
                .join()
                .toLowerCase()
                .includes(search.toLowerCase());
            }
            if (item.length > 0) {
              return `${item[ddnField[1]]}`.toUpperCase().includes(`${search}`.toUpperCase());
            } else {
              return `${item[ddnField[0]]}`.toUpperCase().includes(`${search}`.toUpperCase());
            }
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, [search]);
  useEffect(() => {
    setIsdisabled(disable);
  }, [disable]);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  async function getOptions() {
    try {
      let res;
      let obj = [...options];
      setLoading(true);
      if (fetch) {
        if (fetch?.url) {
          res = await axios_.post(fetch.url, fetch.data);
        } else if ((clientPages.includes(router.asPath) && name && !name.toLowerCase().includes("model") && !clientPageAdvisorDropDown.includes(name)) || ddnType == "investor") {
          res = await axios_Investor.get(fetch);
        } else {
          res = await axios_.get(fetch);
        }
        if (res?.status == 200) {
          obj = [...options, ...res.data];
          if (filter) {
            obj = obj.filter((item) => !filter.includes(item[0]));
          }
        }
      }

      if (defaultSelected >= 0) {
        setLocalVal(obj[defaultSelected][1]);
      }
      setSelectOption(obj);
      setSelectOptionAll(obj);
      isFetched(name);
      setLoading(false);
      setDropdowns((prev) => {
        let obj = { ...prev };
        obj[name] = getOptions;
        return obj;
      });
      setDropdownsData((prev) => {
        let obj = { ...prev };
        obj[name] = res?.data;
        return obj;
      });

      if (fetch) return res.data;
    } catch (e) {
      // console.log(e)
      setLoading(false);
      return [];
    }
  }

  function handleOnChange(e) {
    try {
      // Clear any pending close timeout immediately
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      // Close dropdown immediately before processing
      setDropDown(false);
      isHoveringRef.current = false;
      setIsHovering(false);
      
      setSelectOption(selectionOptionAll);
      setSearch(e.target.innerText);
      setSelected(e.target.id);
      let selected = selectionOption.filter((option) => {
        return option[ddnField[0]] == e.target.id;
      })[0];
      // setLocalVal(e.target.innerText);
      onChange({ target: { name: name, value: e.target.id } }, frmIndex, { name, selectedOptions: selected });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div
      ref={localref}
      className={`${styles.container} ${disable ? styles.disabled : ""} `}
      style={{ pointerEvents: disable && "none" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        onKeyDown={(e) => {
          if (disable) return;
          if (e?.code === "ArrowDown") {
            if (!dropDown) return setDropDown(true);
            setDropDown(true);
            setRefIndex((prev) => {
              let max = selectionOption.length;
              if (selectionOption.length > 100) max = 100;
              if (prev < max - 1) {
                return prev + 1;
              } else {
                return prev;
              }
            });
          }
          if (e?.code === "ArrowUp") {
            setDropDown(true);
            setRefIndex((prev) => {
              if (prev > 0) {
                return prev - 1;
              } else {
                return prev;
              }
            });
          }
          if (e?.code === "Enter") {
            e.preventDefault();
            if (refIndex > -1 && selectionOption.length > 0) {
              handleOnChange({
                target: {
                  id: selectionOption[refIndex][ddnField[0]],
                  innerText: selectionOption[refIndex][ddnField[1]],
                },
              });
            }
            setSearch(undefined);
            setRefIndex(-1);
          }
          if (e?.code === "Tab") {
            setDropDown(false);
            isHoveringRef.current = false;
            setIsHovering(false);
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
          }
          if (e?.code === "Escape") {
            setSearch(undefined);
            setDropDown(false);
            isHoveringRef.current = false;
            setIsHovering(false);
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
          }
        }}
      >
        <div className={`${styles.input} ${styles.input} ${styles.select} ${isValid ? "" : styles.error} ${selected == "" ? styles.primaryColor : ""} ${dropDown ? styles.dropdownOpenBorder : styles.dropdownClosedBorder}`}>
          <input
            spellCheck={false}
            autoComplete="off"
            onClick={() => {
              setDropDown(true);
            }}
            disabled={isDisabled}
            name={name}
            placeholder={`--${selectorText}--`}
            value={search || localVal || ""}
            onChange={(e) => {
              setSearch(e.target.value);
              setRefIndex(0);
              setLocalVal(e.target.value);
              // onChange({ target: { name, value: e.target.value } }, frmIndex, null);
              setDropDown((prev) => (!prev ? true : prev));
            }}
          />
          <span
            onClick={() => {
              setDropDown((prev) => !prev);
            }}
            className={styles.loaderContainer}
          >
            {loading ? (
              <span className={styles.loader}>
                {" "}
                <Loader2 />{" "}
              </span>
            ) : dropDown ? (
              <IoMdRefresh onClick={getOptions} />
            ) : (
              <HiSelector />
            )}
          </span>

          {dropDown && !isDisabled && (
            <div 
              className={styles.dropdownOpen}
              style={{ 
                maxHeight: "10rem", 
                zIndex: 9999
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}>
            {selectionOption?.length > 0 ? (
              <>
                {selectionOption.slice(0, 100).map((option, index) => {
                  if (option) {
                    let id = "",
                      value = "";
                    if (contact.length > 0) {
                      id = contact.map((o) => option[o]).join(" - ");
                      value = contact.map((o) => option[o]).join(" - ");
                    } else {
                      id = option?.[ddnField[0]];
                      value = ddnField.length > 1 ? option[ddnField[1]] : option[ddnField[0]];
                    }
                    return (
                      <span style={{ color: index === refIndex ? "var(--primary-color)" : "" }} key={`${name}_${index}`} data-name={name} onClick={handleOnChange} id={option[ddnField[0]]} ref={index === refIndex ? searchInputRef : null}>
                        {value}
                      </span>
                    );
                  }
                })}
                {selectionOption.length > 100 && (
                  <span disable={disable ? "true" : "false"} style={{ color: "white", cursor: "default" }} id={"na"}>
                    Search For More...
                  </span>
                )}
              </>
            ) : (
              <span disable={disable ? "true" : "false"} id={"na"}>
                No Option
              </span>
            )}
            </div>
          )}
        </div>
        {title && (
          <span className={styles.label}>
            <span>{title}</span>
            {help && (
              <span className={styles.help}>
                <IoHelpCircleOutline />
                <span className={styles.helpBox}>{help}</span>
              </span>
            )}
          </span>
        )}
        {errMessage && <span style={{ color: "#f62626c9", position: "absolute", fontSize: "10px", bottom: -14, right: 2 }}>{errMessage}</span>}
      </div>
    </div>
  );
}

export default forwardRef(Select);
