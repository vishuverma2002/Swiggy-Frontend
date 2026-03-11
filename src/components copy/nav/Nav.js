import styles from "./styles/nav.module.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "@/store/store";
import { useRouter } from "next/router";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { IoLogOutOutline, IoRefresh, IoSettingsOutline } from "react-icons/io5";
import DarkLight from "../DarkLight/DarkLight";
import { BsBell, BsBellFill, BsPlusLg, BsSun, BsMoon } from "react-icons/bs";
import Investor_Name from "../clientName";
import { axios_, capitalizeEachWord } from "@/utils/utll";
import Loader from "../loader/Loader";
import { GiMoneyStack } from "react-icons/gi";
import { HiRefresh } from "react-icons/hi";
import { MdRefresh } from "react-icons/md";

export default function Nav() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showRefreshMenu, setShowRefreshMenu] = useState(false);
  const [businessLogo, setBusinessLogo] = useState("/logos_.png");
  const [loading, setLoading] = useState(true);

  const { user, logOut, notifications, setNotifications, updateTheme, setShowPortfolioList, setAddPortfolio, showMessage } = useContext(Context);
  const [themeValue, setThemeValue] = useState(true);
  const [userName, seUserName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hover state management for dropdowns
  const [isHoveringUserMenu, setIsHoveringUserMenu] = useState(false);
  const [isHoveringRefreshMenu, setIsHoveringRefreshMenu] = useState(false);
  const userMenuCloseTimeoutRef = useState({ current: null })[0];
  const refreshMenuCloseTimeoutRef = useState({ current: null })[0];

  async function getBusinessLogo() {
    try {
      setLoading(true);
      let res = await axios_.get(`advisor/get/business-logo`);
      if (res.status == 200) {
        if (res.data.data !== "Logo not found") {
          setBusinessLogo(res.data.data);
        }
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  // Helper to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Apply Dark Mode Green theme
  const applyDarkModeTheme = () => {
    const root = document.documentElement;
    const darkTheme = {
      primary: "#1a7447",
      banner: "#1a7447",
      secondary: "#2a2a2a",
      tertiary: "#161b18",
      forth: "#2d2d2d",
      text: "#f5f5f5",
      heading: "#ffffff",
      button: hexToRgba("#1a7447", 0.1),
      buttonText: "#1a7447",
      chartAxisLabel: "#e5e7eb",
      chartTick: "#d1d5db",
      chartText: "#f3f4f6",
      chartLabel: "#ffffff",
      chartLegend: "#e5e7eb",
      chartGrid: "rgba(255, 255, 255, 0.1)",
      chartTooltipBg: "rgba(30, 30, 30, 0.95)",
      chartTooltipText: "#ffffff",
      chartTooltipBorder: "rgba(255, 255, 255, 0.2)",
    };

    // Apply all theme colors
    root.style.setProperty("--primary-color", darkTheme.primary);
    root.style.setProperty("--banner-color", darkTheme.banner);
    root.style.setProperty("--scrollColor", darkTheme.primary);
    root.style.setProperty("--secondary-color", darkTheme.secondary);
    root.style.setProperty("--tertiary-color", darkTheme.tertiary);
    root.style.setProperty("--forth-color", darkTheme.forth);
    root.style.setProperty("--text-primary-color", darkTheme.text);
    root.style.setProperty("--heading-color", darkTheme.heading);
    root.style.setProperty("--button-color", darkTheme.button);
    root.style.setProperty("--button-text-color", darkTheme.buttonText);
    
    // Apply chart colors
    root.style.setProperty("--chart-axis-label-color", darkTheme.chartAxisLabel);
    root.style.setProperty("--chart-tick-color", darkTheme.chartTick);
    root.style.setProperty("--chart-text-color", darkTheme.chartText);
    root.style.setProperty("--chart-label-color", darkTheme.chartLabel);
    root.style.setProperty("--chart-legend-color", darkTheme.chartLegend);
    root.style.setProperty("--chart-grid-color", darkTheme.chartGrid);
    root.style.setProperty("--chart-tooltip-bg", darkTheme.chartTooltipBg);
    root.style.setProperty("--chart-tooltip-text", darkTheme.chartTooltipText);
    root.style.setProperty("--chart-tooltip-border", darkTheme.chartTooltipBorder);
    
    // Save to localStorage (matching theme page key format)
    localStorage.setItem("customPrimaryColor", darkTheme.primary);
    localStorage.setItem("customBannerColor", darkTheme.banner);
    localStorage.setItem("customSecondaryColor", darkTheme.secondary);
    localStorage.setItem("customTertiaryColor", darkTheme.tertiary);
    localStorage.setItem("customForthColor", darkTheme.forth);
    localStorage.setItem("customTextColor", darkTheme.text);
    localStorage.setItem("customHeadingColor", darkTheme.heading);
    localStorage.setItem("customButtonColor", darkTheme.button);
    localStorage.setItem("customButtonTextColor", darkTheme.buttonText);
    localStorage.setItem("customChartAxisLabelColor", darkTheme.chartAxisLabel);
    localStorage.setItem("customChartTickColor", darkTheme.chartTick);
    localStorage.setItem("customChartTextColor", darkTheme.chartText);
    localStorage.setItem("customChartLabelColor", darkTheme.chartLabel);
    localStorage.setItem("customChartLegendColor", darkTheme.chartLegend);
    localStorage.setItem("customChartGridColor", darkTheme.chartGrid);
    localStorage.setItem("customChartTooltipBg", darkTheme.chartTooltipBg);
    localStorage.setItem("customChartTooltipText", darkTheme.chartTooltipText);
    localStorage.setItem("customChartTooltipBorder", darkTheme.chartTooltipBorder);
    
    // Set body background
    document.body.style.backgroundColor = darkTheme.tertiary || "#161b18";
  };

  // Apply Default Light theme
  const applyLightModeTheme = () => {
    const root = document.documentElement;
    const lightTheme = {
      primary: "#1a7447",
      banner: "#1a7447",
      secondary: "#e2e2e23b",
      tertiary: "#fffafa",
      forth: "#ebebeb",
      text: "#191818",
      heading: "#4a4a4a",
      button: hexToRgba("#1a7447", 0.1),
      buttonText: "#1a7447",
    };

    // Apply all theme colors
    root.style.setProperty("--primary-color", lightTheme.primary);
    root.style.setProperty("--banner-color", lightTheme.banner);
    root.style.setProperty("--scrollColor", lightTheme.primary);
    root.style.setProperty("--secondary-color", lightTheme.secondary);
    root.style.setProperty("--tertiary-color", lightTheme.tertiary);
    root.style.setProperty("--forth-color", lightTheme.forth);
    root.style.setProperty("--text-primary-color", lightTheme.text);
    root.style.setProperty("--heading-color", lightTheme.heading);
    root.style.setProperty("--button-color", lightTheme.button);
    root.style.setProperty("--button-text-color", lightTheme.buttonText);
    
    // Remove chart colors (use defaults for light mode)
    root.style.removeProperty("--chart-axis-label-color");
    root.style.removeProperty("--chart-tick-color");
    root.style.removeProperty("--chart-text-color");
    root.style.removeProperty("--chart-label-color");
    root.style.removeProperty("--chart-legend-color");
    root.style.removeProperty("--chart-grid-color");
    root.style.removeProperty("--chart-tooltip-bg");
    root.style.removeProperty("--chart-tooltip-text");
    root.style.removeProperty("--chart-tooltip-border");
    
    // Save to localStorage (matching theme page key format)
    localStorage.setItem("customPrimaryColor", lightTheme.primary);
    localStorage.setItem("customBannerColor", lightTheme.banner);
    localStorage.setItem("customSecondaryColor", lightTheme.secondary);
    localStorage.setItem("customTertiaryColor", lightTheme.tertiary);
    localStorage.setItem("customForthColor", lightTheme.forth);
    localStorage.setItem("customTextColor", lightTheme.text);
    localStorage.setItem("customHeadingColor", lightTheme.heading);
    localStorage.setItem("customButtonColor", lightTheme.button);
    localStorage.setItem("customButtonTextColor", lightTheme.buttonText);
    
    // Clear chart colors from localStorage
    localStorage.removeItem("customChartAxisLabelColor");
    localStorage.removeItem("customChartTickColor");
    localStorage.removeItem("customChartTextColor");
    localStorage.removeItem("customChartLabelColor");
    localStorage.removeItem("customChartLegendColor");
    localStorage.removeItem("customChartGridColor");
    localStorage.removeItem("customChartTooltipBg");
    localStorage.removeItem("customChartTooltipText");
    localStorage.removeItem("customChartTooltipBorder");
    
    // Set body background
    document.body.style.backgroundColor = "white";
  };

  useEffect(() => {
    getBusinessLogo();
    if (user) {
      let detail = user?.userDetail || user?.userResponseDetail;
      setIsRegistered(detail?.registred);
      if (user?.userResponseDetail) {
        seUserName(`${user?.userResponseDetail.firstName} ${user?.userResponseDetail.lastName}`);
      }
      if (user?.personalDetail?.advisorFirstName) {
        seUserName(`${user?.personalDetail.advisorFirstName} ${user?.personalDetail.advisorLastName}`);
      }
      if (user?.personalDetail?.employeeId) {
        seUserName(`${user?.personalDetail.employeeFirstName} ${user?.personalDetail.employeeLastName}`);
      }
    }
  }, [user]);

  useEffect(() => {
    updateTheme(true);
    let theme = "light";
    setThemeValue(theme === "dark");
    document.querySelector("html").setAttribute("data-theme", theme);
    getNotificatonCounts();
    
    // Check saved theme mode preference
    const savedMode = localStorage.getItem("themeMode") || "light";
    setIsDarkMode(savedMode === "dark");
    
    // Apply saved theme if exists
    if (savedMode === "dark") {
      applyDarkModeTheme();
    } else {
      applyLightModeTheme();
    }
  }, []);

  // Close refresh menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRefreshMenu && !event.target.closest(`.${styles.refreshContainer}`)) {
        if (refreshMenuCloseTimeoutRef.current) {
          clearTimeout(refreshMenuCloseTimeoutRef.current);
        }
        setShowRefreshMenu(false);
        setIsHoveringRefreshMenu(false);
      }
    };

    if (showRefreshMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showRefreshMenu, styles.refreshContainer]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(`.${styles.userContainer}`)) {
        if (userMenuCloseTimeoutRef.current) {
          clearTimeout(userMenuCloseTimeoutRef.current);
        }
        setShowMenu(false);
        setIsHoveringUserMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMenu, styles.userContainer]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (userMenuCloseTimeoutRef.current) {
        clearTimeout(userMenuCloseTimeoutRef.current);
      }
      if (refreshMenuCloseTimeoutRef.current) {
        clearTimeout(refreshMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  // User menu hover handlers
  const handleUserMenuMouseEnter = () => {
    setIsHoveringUserMenu(true);
    if (userMenuCloseTimeoutRef.current) {
      clearTimeout(userMenuCloseTimeoutRef.current);
      userMenuCloseTimeoutRef.current = null;
    }
  };

  const handleUserMenuMouseLeave = () => {
    setIsHoveringUserMenu(false);
    userMenuCloseTimeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200);
  };

  // Refresh menu hover handlers
  const handleRefreshMenuMouseEnter = () => {
    setIsHoveringRefreshMenu(true);
    if (refreshMenuCloseTimeoutRef.current) {
      clearTimeout(refreshMenuCloseTimeoutRef.current);
      refreshMenuCloseTimeoutRef.current = null;
    }
  };

  const handleRefreshMenuMouseLeave = () => {
    setIsHoveringRefreshMenu(false);
    refreshMenuCloseTimeoutRef.current = setTimeout(() => {
      setShowRefreshMenu(false);
    }, 200);
  };
  function changeTheme() {
    const [e] = arguments;
    const { value } = e.target;
    if (value) {
      localStorage.setItem("theme", "light");
      document.querySelector("html").setAttribute("data-theme", "light");
    } else {
      localStorage.setItem("theme", "light");
      document.querySelector("html").setAttribute("data-theme", "light");
    }
  }

  async function getNotificatonCounts() {
    try {
      let res = await axios_.get("notification/get/assigned-to");
      if (res.status == 200) {
        setNotifications(res.data);
      }
    } catch (e) {
      setNotifications([]);
    }
  }

  // Toggle between light and dark mode
  const toggleThemeMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("themeMode", newMode ? "dark" : "light");
    
    if (newMode) {
      applyDarkModeTheme();
      showMessage("Dark mode enabled", true);
    } else {
      applyLightModeTheme();
      showMessage("Light mode enabled", true);
    }
  };
  
  function handLogout() {
    logOut();
  }
  return (
    <div className={styles.nav}>
      <div className={styles.logoContainer}>
        {loading ? (
          <Loader />
        ) : (
          <img
            className={styles.logo}
            src={businessLogo || "/logos_.png"}
            height={50}
            width={140}
            alt="logos"
            onClick={() => {
              router.push("/");
            }}
          />
        )}
        <h1 className={styles.brandTitle} onClick={() => router.push("/")}>
          Paise Ka Ped
        </h1>
      </div>
      <div className={styles.navMenu}>
        {isRegistered && (
          <div className={styles.refreshContainer} onMouseEnter={handleRefreshMenuMouseEnter} onMouseLeave={handleRefreshMenuMouseLeave}>
            <button
              className={styles.navButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowRefreshMenu((prev) => !prev);
              }}
            >
              <IoRefresh size={16} color="#ffffff" /> <span>Refresh</span>
              <IoMdArrowDropdownCircle size={14} color="#ffffff" className={`${styles.refreshDropdownIcon} ${showRefreshMenu ? styles.rotate : ""}`} />
            </button>

            {showRefreshMenu && (
              <div className={styles.refreshMenu}>
                <div
                  className={styles.refreshMenuItem}
                  onClick={() => {
                    setShowPortfolioList(true);
                    setShowRefreshMenu(false);
                    setIsHoveringRefreshMenu(false);
                    if (refreshMenuCloseTimeoutRef.current) {
                      clearTimeout(refreshMenuCloseTimeoutRef.current);
                    }
                  }}
                >
                  <HiRefresh size={18} />
                  <span>Refresh All Portfolios</span>
                </div>
                <div
                  className={styles.refreshMenuItem}
                  onClick={() => {
                    setShowPortfolioList(true);
                    setShowRefreshMenu(false);
                    setIsHoveringRefreshMenu(false);
                    if (refreshMenuCloseTimeoutRef.current) {
                      clearTimeout(refreshMenuCloseTimeoutRef.current);
                    }
                  }}
                >
                  <MdRefresh size={18} />
                  <span>Refresh Selected</span>
                </div>
                <div className={styles.refreshMenuDivider}></div>
                <div
                  className={styles.refreshMenuItem}
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <IoRefresh size={18} />
                  <span>Reload Page</span>
                </div>
              </div>
            )}
          </div>
        )}
        {isRegistered && (
          <>
            <Investor_Name />
            <button
              className={styles.navButton}
              onClick={() => {
                setAddPortfolio(true);
              }}
            >
              <BsPlusLg size={14} color="#ffffff" /> <span>Portfolio</span>
            </button>
          </>
        )}
        <div className={styles.userSection}>
          <div
            className={styles.themeToggle}
            onClick={(e) => {
              e.stopPropagation();
              toggleThemeMode();
            }}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ?   <BsMoon color="#ffffff" size={18} />:<BsSun color="#ffffff" size={18} />}
          </div>
          <div
            className={styles.notification}
            onClick={(e) => {
              e.stopPropagation();
              router.push("/notification");
            }}
          >
            {notifications.length > 0 && <span className={styles.notificationBadge}>{notifications.length > 99 ? "99+" : notifications.length}</span>}
            <BsBellFill color="#ffffff" size={18} />
          </div>
          <div className={styles.userContainer} onMouseEnter={handleUserMenuMouseEnter} onMouseLeave={handleUserMenuMouseLeave}>
            <div onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }} className={styles.userName}>
              <span>{`${capitalizeEachWord(userName)}`}</span>
              <span>
                <IoMdArrowDropdownCircle size={18} color="#ffffff" className={`${styles.userDropdownIcon} ${showMenu ? styles.rotate : ""}`} />
              </span>
            </div>

            {showMenu && (
              <div className={styles.contextMenu}>
                {user?.userDetail?.registred && (
                  <>
                    <span
                      onClick={() => {
                        router.push("/settings");
                        setShowMenu(false);
                        setIsHoveringUserMenu(false);
                        if (userMenuCloseTimeoutRef.current) {
                          clearTimeout(userMenuCloseTimeoutRef.current);
                        }
                      }}
                    >
                      <IoSettingsOutline size={18} />
                      <span>Settings</span>
                    </span>
                    <span
                      onClick={() => {
                        router.push("/subscription");
                        setShowMenu(false);
                        setIsHoveringUserMenu(false);
                        if (userMenuCloseTimeoutRef.current) {
                          clearTimeout(userMenuCloseTimeoutRef.current);
                        }
                      }}
                    >
                      <GiMoneyStack size={18} />
                      <span>IL Subscription</span>
                    </span>
                  </>
                )}
                <span
                  onClick={() => {
                    handLogout();
                    setShowMenu(false);
                    setIsHoveringUserMenu(false);
                    if (userMenuCloseTimeoutRef.current) {
                      clearTimeout(userMenuCloseTimeoutRef.current);
                    }
                  }}
                >
                  <IoLogOutOutline size={18} />
                  <span>Logout</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
