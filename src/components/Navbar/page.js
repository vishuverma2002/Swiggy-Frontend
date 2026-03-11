"use client";

import styles from "./navbar.module.css";
import {
  IoSearchOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { RiDiscountPercentLine } from "react-icons/ri";
import { CgToolbox } from "react-icons/cg";
import { useContext, useState, useEffect, useRef } from "react";
import { Context } from "@/store/store";

const Navbar = () => {
  const { user, logOut } = useContext(Context);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const startHoverTimeout = () => {
    if (!isUserMenuOpen) return;
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 500);
  };

  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearHoverTimeout();
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    logOut();
    setIsUserMenuOpen(false);
    window.location.href = "/login";
  };

  const navItems = [
    { icon: <CgToolbox />, label: "FoodieHub Corporate", path: "/corporate" },
    { icon: <IoSearchOutline />, label: "Search", path: "/search" },
    {
      icon: <RiDiscountPercentLine />,
      label: "Offers",
      path: "/offers",
      badge: "NEW",
    },
  ];

  const userName = user?.name || "User";

  return (
    <nav className={styles.navbar}>
      {navItems.map((item, index) => (
        <li key={index}>
          <span className={styles.navLink} style={{ cursor: "default" }}>
            {item.badge && (
              <span className={styles.newBadge}>{item.badge}</span>
            )}
            {item.icon}
            {item.label}
          </span>
        </li>
      ))}

      <li
        className={styles.userMenu}
        ref={userMenuRef}
        onMouseEnter={clearHoverTimeout}
        onMouseLeave={startHoverTimeout}
      >
        <button
          type="button"
          className={`${styles.navLink} ${styles.navButton}`}
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
        >
          <IoPersonCircleOutline />
          <span className={styles.userName}>{userName}</span>
        </button>

        {isUserMenuOpen && (
          <div className={styles.userDropdown}>
            <button
              type="button"
              className={`${styles.userMenuItem} ${styles.logoutItem}`}
              onClick={handleLogout}
            >
              <IoLogOutOutline />
              <span>Logout</span>
            </button>
          </div>
        )}
      </li>
    </nav>
  );
};

export default Navbar;
