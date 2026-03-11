import React, { useEffect, useState, useRef } from "react";
import styles from "./style/tabs.module.css";

export default function Tabs({ children, tabChange = () => {}, Setting = <></>, activeTab = 0 }) {
  const [active, setActive] = useState(activeTab);
  const [loaded, setLoaded] = useState([activeTab]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextActive, setNextActive] = useState(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef([]);

  useEffect(() => {
    setActive(activeTab);
    tabChange(activeTab);
    updateIndicator(activeTab);
  }, [activeTab]);
  useEffect(() => {
    setLoaded((prev) => [...new Set([...prev, activeTab])]);
  }, [active, activeTab]);

  useEffect(() => {
    updateIndicator(active);
  }, [active]);

  const updateIndicator = (index) => {
    const tabElement = tabRefs.current[index];
    if (tabElement) {
      const { offsetLeft, offsetWidth } = tabElement;
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      });
    }
  };

  const handleTabClick = (index) => {
    if (index === active || isTransitioning) return;

    setIsTransitioning(true);
    setNextActive(index);

    // Wait for fade-out animation to complete (150ms) before showing new tab
    setTimeout(() => {
      setActive(index);
      tabChange(index);
      setLoaded((prev) => [...new Set([...prev, index])]);
      setNextActive(null);
      // Allow fade-in animation to start, then re-enable transitions
      setTimeout(() => {
        setIsTransitioning(false);
      }, 30); // Small delay to ensure state updates
    }, 150);
  };

  return (
    <>
      <div className={styles.tabs}>
        <div className={styles.tabButtonRow}>
          {React.Children.map(children, (child, index) => {
            return (
              <React.Fragment key={`tabButton_${index}`}>
                <div 
                  ref={(el) => (tabRefs.current[index] = el)}
                  className={`${styles.tabButton} ${active == index ? styles.active : ""}`} 
                  onClick={() => handleTabClick(index)}
                >
                  <span>{child?.props?.title}</span>
                </div>
              </React.Fragment>
            );
          })}
          {Setting}
          <div className={styles.tabIndicator} style={indicatorStyle}></div>
        </div>
        <div className={styles.tabContentContainer}>
          {React.Children.map(children, (child, index) => {
            const isActive = active == index;
            const isNext = nextActive == index;
            const shouldRender = loaded.includes(index) && (isActive || isNext);

            if (!shouldRender) return null;

            // Class logic:
            // - If active and no transition pending: show with fade-in
            // - If active but there's a nextActive (different tab): fade out (old tab)
            // - If next (pending): keep hidden until it becomes active
            // - Otherwise: fade out
            let className = styles.tabBox;
            if (isActive && !nextActive) {
              // Currently active tab with no transition
              className += ` ${styles.activeTab}`;
            } else if (isActive && nextActive && nextActive !== index) {
              // Old active tab that should fade out
              className += ` ${styles.inActiveTab}`;
            } else if (isNext) {
              // Pending tab: keep hidden
              className += ` ${styles.pendingTab}`;
            } else {
              // Inactive tab
              className += ` ${styles.inActiveTab}`;
            }

            return (
              <div key={`tabContent_${index}`} className={className}>
                {child.props.children}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
