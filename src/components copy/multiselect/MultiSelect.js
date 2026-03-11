import React, { forwardRef, useState, useEffect, useRef, useContext } from "react";
import styles from "./styles/multiselect.module.css";
import { axios_, axios_Investor } from "@/utils/utll";
import { HiSelector } from "react-icons/hi";
import { Loader2 } from "../loader/Loader";
import Button from "../button/Button";
import { BsCheck } from "react-icons/bs";
import { Context } from "@/store/store";
import { useRouter } from "next/router";

function MultiSelect({ isFetched = () => {}, disabled = false, ddnFields = [0, 1], help = "", filterOut, fetch = undefined, selector = "", options = [], isError = false, title = null, name = "", value = [], frmIndex = 0, onChange = () => {}, selectAll = false, selectedOnLoad = [], isLoading = false }, inputRef) {
  const router = useRouter();
  const { dropdowns, clientPages } = useContext(Context);
  const [selected, setSelected] = useState();
  const [loading, setLoading] = useState(false);
  const [selectionOption, setSelectOption] = useState([]);
  const [selectionOptionAll, setSelectOptionAll] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const [isDisabled, setIsdisabled] = useState(false);
  const [refIndex, setRefIndex] = useState(-1);
  const [localVal, setLocalVal] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [change, setChange] = useState(false);
  const searchInputRef = useRef();
  const closeTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  useEffect(() => {
    options.length > 0 && setLocalVal(options[0][1]);
    setIsdisabled(disabled);
  }, []);
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);
  useEffect(() => {
    try {
      setLoading(true);
      getOptions();
      dropdowns[name] = getOptions;
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }, [fetch]);

  useEffect(() => {
    searchInputRef.current && searchInputRef.current.scrollIntoView({ behavior: "instant", block: "nearest" });
  }, [searchInputRef.current]);
  useEffect(() => {
    try {
      if ((value !== localVal || value != selected) && ddnFields.length >= 1 && selectionOptionAll.length >= 1) {
        let currentValue = selectionOptionAll.filter((option) => {
          return option[ddnFields[0]] == value;
        });
        if (currentValue.length >= 1) {
          let currentValueLocal = currentValue[0][ddnFields.length > 1 ? ddnFields[1] : ddnFields[0]];
          setLocalVal(currentValueLocal);
          // onChange({ target: { name: name, value: currentValueLocal } }, frmIndex, { name, selectedOptions: currentValueLocal });
        }
      }
    } catch (e) {
      console.log("Error In Setting value of ", name, e);
    }
  }, [value, selectionOptionAll]);

  useEffect(() => {
    try {
      if (!search || search === "") {
        selectionOptionAll.length > 0 && setSelectOption(selectionOptionAll);
      } else {
        setSelectOption(
          selectionOptionAll.filter((item) => {
            if (item.length > 0) {
              return `${item[ddnFields[1]]}`.toUpperCase().includes(`${search}`.toUpperCase());
            } else {
              return `${item[ddnFields[0]]}`.toUpperCase().includes(`${search}`.toUpperCase());
            }
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, [search]);

  async function getOptions() {
    try {
      let res;
      let obj = [...options];
      if (fetch?.url) {
        res = await axios_.post(fetch.url, fetch.data);
      } else if (fetch) {
        if (clientPages.includes(router.asPath)) {
          res = await axios_Investor.get(fetch);
        } else {
          res = await axios_.get(fetch);
        }
      }

      if (res?.status == 200) {
        obj = [...obj, ...res.data];
        if (filterOut) {
          obj = obj.filter((item) => !filterOut.includes(item[0]));
        }
      }
      setSelectOption(obj);
      setSelectOptionAll(obj);

      let updatedSelectedOnLoad = [];
      if (Array.isArray(value)) {
        obj.forEach((objItem, index) => {
          if (value?.some((valueItem) => valueItem[0] == objItem[0])) updatedSelectedOnLoad.push(index);
        });
      } else if (selectAll) {
        obj.forEach((_, index) => updatedSelectedOnLoad.push(index));
      } else {
        updatedSelectedOnLoad = [...selectedOnLoad];
      }

      // updates the value in formData state on Load using updatedSelectedOnLoad(which is calculated from 'value', 'selectAll', 'selectedOnLoad');
      if (updatedSelectedOnLoad?.length && obj?.length) {
        const filteredObj = obj.filter((_, index) => updatedSelectedOnLoad.includes(index));
        const newSelectedOptions = filteredObj.map((item) => `${item[0]}`);
        setSelectedOptions(newSelectedOptions);
        const localValue = filteredObj.map((item) => item[1]).join(", ");
        setLocalVal(localValue);
        onChange({ target: { name: name, value: filteredObj } }, frmIndex, { name, selectedOptions: filteredObj });
      }
      setIsdisabled(disabled);
      setLoading(false);
      isFetched(name);
      return res.data;
    } catch (e) {
      setLoading(false);
      console.log(e);
      return [];
    }
  }

  function handleOnChange(e) {
    try {
      const id = e.target.id;
      setSelectedOptions((prev) => {
        let newSelectedOptions = [...prev];
        const isAlreadySelected = newSelectedOptions.some((item) => item == id);
        if (!isAlreadySelected) {
          newSelectedOptions.push(id);
        } else {
          newSelectedOptions = newSelectedOptions.filter((item) => item != id);
        }
        return newSelectedOptions;
      });
    } catch (e) {
      console.log(e);
    }
  }
  function handleOnApply(e) {
    e?.stopPropagation();
    // Clear any pending close timeout immediately
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setChange(false);
    setDropDown(false);
    isHoveringRef.current = false;
    setIsHovering(false);
    try {
      setSearch(undefined);
      const value = selectionOptionAll.filter((option) => {
        return selectedOptions.some((id) => id == option[ddnFields[0]]);
      });
      if (value.length > 1) {
        setLocalVal(value.map((i) => i[ddnFields[1]]).join(", "));
      } else if (value.length == 0) {
        setLocalVal("");
      } else {
        setLocalVal(value[0][ddnFields[1]]);
      }
      onChange({ target: { name: name, value: value } }, frmIndex, { name, selectedOptions: selectedOptions });
    } catch (e) {
      console.log(e);
    }
  }
  const localref = useRef();

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

  return (
    <div ref={localref} className={`${styles.container} ${isDisabled ? styles.disabled : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div>
        <div
          className={`${styles.select} ${isError ? styles.error : ""} ${selected == "" ? styles.primaryColor : ""} ${dropDown ? styles.dropdownOpenBorder : styles.dropdownClosedBorder}`}
          onKeyDown={(e) => {
            if (e?.code === "ArrowDown") {
              if (!dropDown) return setDropDown(true);
              setDropDown(true);
              setRefIndex((prev) => {
                if (prev < selectionOption.length - 1) {
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

            if (e?.code === "Tab") {
              setDropDown(false);
              isHoveringRef.current = false;
              setIsHovering(false);
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
              }
            }
            if (e?.code === "Enter") {
              e.preventDefault();
              handleOnApply();
            }
            if (refIndex > -1) {
              if (e?.code === "Space") {
                e.preventDefault();
                handleOnChange({ target: { id: selectionOption[refIndex]?.[ddnFields[0]] } });
              }
            }
          }}
        >
          <input
            name={name}
            spellCheck={false}
            autoComplete="off"
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) setDropDown((prev) => !prev);
            }}
            placeholder={`--${selector}--`}
            value={search || localVal}
            onChange={(e) => {
              if (!isDisabled) {
                setLocalVal(undefined);
                setSearch(e.target.value);
              }
            }}
          />
          <span
            onClick={() => {
              setDropDown((prev) => !prev);
            }}
            className={styles.loaderContainer}
          >
            {loading || isLoading ? (
              <span className={styles.loader}>
                <Loader2 />
              </span>
            ) : (
              <>{change ? <BsCheck onClick={(e) => { e.stopPropagation(); handleOnApply(e); }} size={20} /> : <HiSelector />}</>
            )}
          </span>

          <div 
            style={{ 
              visibility: dropDown && !isDisabled ? "visible" : "hidden", 
              opacity: dropDown && !isDisabled ? 1 : 0,
              transform: dropDown && !isDisabled ? "translateY(0)" : "translateY(-8px)",
              zIndex: 9999 
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            {selectionOption?.length > 0 ? (
              <>
                {selectionOption.slice(0, 100).map((option, index) => {
                  return (
                    <span key={"m_" + index} className={styles.option} style={{ margin: "0px", padding: "0px", color: index === refIndex ? "var(--primary-color)" : "" }} ref={index === refIndex ? searchInputRef : null}>
                      <ListItem key={`${name}_${index}`} name={name} option={option} onClick={handleOnChange} id={option[ddnFields[0]]} ddnFields={ddnFields} isChecked={selectedOptions.some((item) => item == option[ddnFields[0]])} setChange={setChange} />
                    </span>
                  );
                })}
                {selectionOption.length > 100 && (
                  <span disable={disabled ? "true" : "false"} style={{ color: "white", cursor: "default" }} id={"na"}>
                    Search For More...
                  </span>
                )}
              </>
            ) : (
              <span disable={disabled ? "true" : "false"} id={"na"}>
                No Option
              </span>
            )}
          </div>
        </div>
        {title && (
          <span className={styles.label}>
            <span>{title}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function ListItem({ name, option, onClick, id, ddnFields, isChecked, setChange }) {
  const [checked, setChecked] = useState("");
  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  function handleOnClick(e) {
    onClick(e, !checked);
    setChange(true);
    setChecked((prev) => !prev);
  }
  return (
    <span
      style={{ color: "inherit" }}
      data-name={name}
      onClick={(e) => {
        handleOnClick(e);
      }}
      id={id}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        readOnly
        onClick={(e) => {
          e.stopPropagation();
          handleOnClick(e);
        }}
        name={id}
      />
      {option.length > 1 ? option[ddnFields[1]] : option[ddnFields[0]]}
    </span>
  );
}
export default forwardRef(MultiSelect);
