"use client";

import React, { useRef, useContext } from "react";
import { Context } from "@/store/store";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import styles from "./toprest.module.css";
import ImgContainer from "@/components/ImgContainer";

const restaurant = [
  {
    id: "1",
    name: "",
    path: "/images/img1.jpeg",
    heading: "Hotel Sai Nath and Sai Restaurant",
    sub: "North Indian, Chinese,...",
    place: "Chhindwara Locality",
    rating: "4.3 - 45-50 mins",
    offer: "60% OFF UPTO ₹120",
  },
  {
    id: "2",
    path: "/images/img9.jpeg",
    heading: "Dev Internatioanl",
    sub: "North Indian, Chinese,Fast Food... ",
    place: "Mohan Nagar",
    rating: "4.4 - 45-50 mins",
    offer: "50% OFF UPTO ₹100",
  },
  {
    id: "3",
    path: "/images/img2.jpeg",
    heading: "Bakery World",
    sub: "Bakery, Ice-cream, Snacks,...",
    place: "Parasia Road",
    rating: "4.3 - 45-50 mins",
    offer: "70% OFF UPTO ₹140",
  },
  {
    id: "4",
    path: "/images/img3.jpeg",
    heading: "The Fusion Lounge",
    sub: "North Indian,South Indian, Chinese,...",
    place: "Railway Staiton",
    rating: "4.1 - 55-60 mins",
    offer: "ITEMS AT ₹29",
  },
  {
    id: "5",
    path: "/images/img4.jpeg",
    heading: "Adil Hotel",
    sub: "North Indian, Biryani, Tandoor,...",
    place: "Chhindwara Locality",
    rating: "4.3 - 35-40 mins",
    offer: "60% OFF UPTO ₹120",
  },
  {
    id: "6",
    path: "/images/img5.jpeg",
    heading: "Satkar Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Crossing Republick",
    rating: "4.3 - 45-50 mins",
    offer: "50% OFF UPTO ₹100",
  },
  {
    id: "7",
    name: "",
    path: "/images/momos.jpg",
    heading: "Hotel Sai Nath and Sai Restaurant",
    sub: "North Indian, Chinese,...",
    place: "Chhindwara Locality",
    rating: "4.3 - 45-50 mins",
    offer: "70% OFF UPTO ₹140",
  },
  {
    id: "8",
    path: "/images/waffles.jpg",
    heading: "The Belgian Waffle Co.",
    sub: "Waffle, Desserts, Ice Cream,...",
    place: "Mohan Nagar",
    rating: "4.5 - 40-45 mins",
    offer: "ITEMS AT ₹29",
  },
  {
    id: "9",
    path: "/images/img8.jpeg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "60% OFF UPTO ₹120",
  },
];
const Toprest = () => {
  const scrollContainerRef = useRef(null);
  const { selectedLocation } = useContext(Context);
  const locationName = selectedLocation?.name || "Ghaziabad";

  const handleScroll = (direction) => {
    scrollContainerRef.current?.scrollBy({
      left: direction * 332,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Top restaurant chains in {locationName}</h1>
          </div>
          <div className={styles.icon}>
            <FaRegArrowAltCircleLeft onClick={() => handleScroll(-1)} />
            <FaRegArrowAltCircleRight onClick={() => handleScroll(1)} />
          </div>
        </div>
        <div className={styles.imaged} ref={scrollContainerRef}>
          <div className={styles.imageSection}>
            {restaurant.map((cat, index) => (
              <ImgContainer
                key={cat.id || index}
                data={cat}
                className={styles.cardSlot}
              />
            ))}
          </div>
        </div>
        <hr
          style={{
            margin: "25px 0px",
            border: "1px solid #cbcbcb",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </>
  );
};

export default Toprest;
