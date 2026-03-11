import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import styles from "./style.module.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

let menuItems = [
  { caption: "Status 1", onClick: () => { } },
  { caption: "Status 2", onClick: () => { } },
];

function ContextMenu({ menu = menuItems, data, zIndex = 0 }) {
  const [show, setShow] = useState(false);
  const containerRef = useRef();
  const menuRef = useRef();
  const closeTimeoutRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        // Clear any pending close timeout
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
        setShow(false);
        setIsHovering(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [show]);

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    setIsHovering(false);
    // Add a small delay before closing to allow smooth cursor movement
    closeTimeoutRef.current = setTimeout(() => {
      setShow(false);
    }, 200);
  };

  // Handle mouse enter to cancel close
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Calculate menu position when shown or when scrolling
  const updateMenuPosition = useCallback(() => {
    if (show && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const menuWidth = 200; // min-width from CSS
      const menuHeight = menu?.length * 40 || 200; // approximate height
      
      let top = rect.top + rect.height + 5; // 5px offset below the button
      let left = rect.left + 8; // 8px offset to the right
      
      // Adjust if menu would go off right edge
      if (left + menuWidth > window.innerWidth) {
        left = window.innerWidth - menuWidth - 10;
      }
      
      // Adjust if menu would go off bottom edge
      if (top + menuHeight > window.innerHeight) {
        top = rect.top - menuHeight - 5; // Show above instead
      }
      
      // Ensure menu doesn't go off left edge
      if (left < 10) {
        left = 10;
      }
      
      // Ensure menu doesn't go off top edge
      if (top < 10) {
        top = 10;
      }
      
      setMenuPosition({ top, left });
    }
  }, [show, menu]);

  useEffect(() => {
    updateMenuPosition();
  }, [updateMenuPosition]);

  // Update position on scroll/resize when menu is open
  useEffect(() => {
    if (show) {
      // Listen to scroll on window and all scrollable containers
      window.addEventListener("scroll", updateMenuPosition, true);
      window.addEventListener("resize", updateMenuPosition);
      
      return () => {
        window.removeEventListener("scroll", updateMenuPosition, true);
        window.removeEventListener("resize", updateMenuPosition);
      };
    }
  }, [show, updateMenuPosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={styles.container}
        style={{ "--zIndex": zIndex }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", height: "100%", width: "100%" }}>
          <BsThreeDotsVertical size={13} onClick={() => setShow((prev) => !prev)} style={{ display: "block" }} />
        </span>
      </div>
      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <div 
            ref={menuRef}
            className={styles.contextMenu}
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              zIndex: zIndex || 10001,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {menu?.length > 0 &&
              menu.map((item, index) => {
                return (
                  <span
                    key={`context_${index}`}
                    onClick={() => {
                      setShow(false);
                      setIsHovering(false);
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                      }
                      item.onClick(item.caption, data);
                    }}
                  >
                    {item.caption}
                  </span>
                );
              })}
          </div>,
          document.body
        )}
    </>
  );
}

export default ContextMenu;
