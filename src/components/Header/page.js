"use client";

import React, { useState, useContext } from "react";
import styles from "./header.module.css";
import { RxCaretDown, RxCross1 } from "react-icons/rx";
import { IoLocationSharp } from "react-icons/io5";
import Navbar from "../Navbar/page";
import Locations from "../Locations/page";
import Drawer from "../Drawer/Drawer";
import Heading from "../heading/Heading";
import Button from "../button/Button";
import { Context } from "@/store/store";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { selectedLocation, setSelectedLocation } = useContext(Context);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    closeDrawer();
  };

  return (
    <>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        position="left"
        width="420px"
        title=""
        showHeader={false}
        noPadding
      >
        <div className={styles.locationDrawer}>
          <Button
            title={<RxCross1 />}
            onClick={closeDrawer}
            btnType="btnXSmall"
            style={{
              position: "absolute",
              top: "20px",
              right: "24px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "40px",
              fontSize: "22px",
              margin: 0,
              marginTop: 0,
              background: "rgba(252, 128, 25, 0.1)",
              borderRadius: "12px",
              zIndex: 10,
            }}
          />
          <div className={styles.locationDrawerHeader}>
            <div className={styles.locationIconWrap}>
              <IoLocationSharp className={styles.locationIcon} />
            </div>
            <Heading
              as="h2"
              type="heading_primary"
              text="Set your location"
              style={{ margin: "0 0 8px 0" }}
            />
            <p className={styles.locationSubtitle}>
              Find restaurants and food delivery options near you
            </p>
          </div>
          <div className={styles.locationDrawerBody}>
            <Locations
              onLocationSelect={handleLocationSelect}
              onClose={closeDrawer}
            />
          </div>
        </div>
      </Drawer>
      <header className={styles.header}>
        <div className={styles.heads}>
          <div className={styles.logo}>
            <img src="/foddiHub.jpg" alt="FoodieHub logo" />
          </div>
          <div className={styles.text}>
            <span className={styles.highlight}>
              <b onClick={openDrawer}>
                {selectedLocation?.name || "Other"}
              </b>
            </span>
            <div className={styles.new}></div>
            <div className={styles.icons}>
              <RxCaretDown onClick={openDrawer} />
            </div>
          </div>
          <Navbar />
        </div>
      </header>

    </>
  );
};

export default Header;

