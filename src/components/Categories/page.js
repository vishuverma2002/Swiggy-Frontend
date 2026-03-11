"use client";

import styles from "./categories.module.css";
import { useRef } from "react";
import React from "react";
import { FaRegArrowAltCircleLeft } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import Toprest from "../Toprest/page";
import Online from "../Online/page";
import ImgContainer from "@/components/ImgContainer";
import Heading from "../heading/Heading";

const mainImage = [
  { id: "1", path: "/images/Burger.jpeg"},
  { id: "2", path: "/images/Biryani1.jpeg" },
  { id: "3", path: "/images/Cakes.jpeg" },
  { id: "4", path: "/images/Idli.jpeg"  },
  { id: "6", path: "/images/Khichdi.jpeg" },
  { id: "11", path: "/images/Paratha.jpeg"  },
  { id: "12", path: "/images/Pizza.jpeg" },
  { id: "13", path: "/images/Salad.jpeg" },
  { id: "14", path: "/images/Rolls.jpeg" },
  { id: "15", path: "/images/Poori.jpeg" },
];

const Categories = () => {
  const scrollRef = useRef(null);

  const handleScroller = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * 190,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <Heading text="Whats on your Mind!" type="heading_primary" />
          </div>
          <div className={styles.icon}>
            <FaRegArrowAltCircleLeft onClick={() => handleScroller(-1)} />
            <FaRegArrowAltCircleRight onClick={() => handleScroller(1)} />
          </div>
        </div>
        <div className={styles.imaged} ref={scrollRef}>
          <div className={styles.imageSection}>
            {mainImage.map((cat) => (
              <ImgContainer
                key={cat.id}
                data={cat}
                variant="category"
                showOffer={false}
                showRatingBadge={false}
                className={styles.imageCard}
              />
            ))}
  
          </div>
        </div>
        <hr className={styles.divider} />
      </div>
      <Toprest />
      <Online />
    </>
  );
};
export default Categories;
