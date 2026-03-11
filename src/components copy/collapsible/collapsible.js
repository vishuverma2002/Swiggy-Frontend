import { useContext, useState } from "react";
import style from "./style/collapsible.module.css";
import { Context } from "@/store/store";

export default function Collapsible({ header = <></>, children, id = "", onChange = () => {}, minHeight = "auto" }) {
  const { collapseVisible, setCollapseVisible } = useContext(Context);

  minHeight = collapseVisible === id ? minHeight : "auto";

  function handleCollapseVisible() {
    onChange(id);
    setCollapseVisible((prev) => {
      // If this item is already expanded, collapse it
      if (prev.includes(id)) {
        return [];
      } else {
        // Otherwise, expand only this item (close all others)
        return [id];
      }
    });
  }
  return (
    <>
      <div className={`${style.collapsible}`}>
        <div onClick={handleCollapseVisible} className={`${style.header} ${collapseVisible === id ? style.colored : ""}`}>
          {header}
        </div>
        <div style={{ minHeight }} className={`${style.content} ${collapseVisible.includes(id) ? style.active : ""}`}>
          {children}
        </div>
      </div>
    </>
  );
}
