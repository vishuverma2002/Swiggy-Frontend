"use client";

import React from "react";
import Image from "next/image";
import { BiSolidStar } from "react-icons/bi";
import styles from "./imgContainer.module.css";

const ImgContainer = ({
  data = {},
  showOffer = true,
  showRatingBadge = true,
  ratingIcon,
  onClick,
  className = "",
  variant = "restaurant",
  containerStyle = {},
  imageStyle = {},
  contentStyle = {},
  titleStyle = {},
  offerStyle = {},
  ratingBadgeStyle = {},
  ...rest
}) => {
  const {
    image: imageProp,
    path,
    alt,
    title: titleProp,
    heading,
    label,
    offer = "",
    rating = "",
    ratingTime: ratingTimeProp = "",
    cuisines = "",
    sub,
    location = "",
    place,
  } = data;

  const image = imageProp ?? path;
  const title = titleProp ?? heading ?? label ?? "";
  const cuisinesValue = cuisines || sub || "";
  const locationValue = location || place || "";
  const ratingTime = ratingTimeProp || (typeof rating === "string" ? rating : "") || "";

  if (!image) return null;

  const displayRating =
    (typeof rating === "number" ? String(rating) : null) ??
    rating?.match(/^([\d.]+)/)?.[1] ??
    ratingTime?.match(/^([\d.]+)/)?.[1] ??
    (rating ? String(rating) : null) ??
    "—";
  const deliveryTime = ratingTime
    ? String(ratingTime).replace(/^[\d.]+\s*[-\•]\s*/, "").trim()
    : "";
  const isCategory = variant === "category";

  return (
    <div
      className={`${styles.card} ${isCategory ? styles.categoryCard : ""} ${className}`}
      style={containerStyle}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick(e) : undefined}
      {...rest}
    >
      <div
        className={`${styles.imageWrapper} ${isCategory ? styles.categoryImageWrapper : ""}`}
      >
        <Image
          src={image}
          alt={alt ?? title}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={styles.image}
          style={imageStyle}
        />
        {!isCategory && showOffer && offer && (
          <div className={styles.offerOverlay} style={offerStyle}>
            {offer}
          </div>
        )}
      </div>
      <div
        className={`${styles.cardContent} ${isCategory ? styles.categoryContent : ""}`}
        style={contentStyle}
      >
        {title && (
          <h2 className={styles.title} style={titleStyle}>
            {title}
          </h2>
        )}
        {!isCategory && (displayRating !== "—" || deliveryTime) && (
          <div className={styles.ratingTime}>
            {ratingIcon ?? <BiSolidStar className={styles.ratingStar} />}
            <span className={styles.ratingText}>
              {displayRating !== "—" && <span className={styles.ratingNum}>{displayRating}</span>}
              {displayRating !== "—" && deliveryTime && " • "}
              {deliveryTime}
            </span>
          </div>
        )}
        {!isCategory && cuisinesValue && (
          <div className={styles.cuisines}>{cuisinesValue}</div>
        )}
        {!isCategory && locationValue && (
          <div className={styles.location}>{locationValue}</div>
        )}
      </div>
    </div>
  );
};

export default ImgContainer;
