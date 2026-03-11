"use client";

import React, { useState } from "react";
import styles from "./online.module.css";
import { LiaSortSolid } from "react-icons/lia";
import { MdSort } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import ImgContainer from "@/components/ImgContainer";
import FilterModal from "../Popup/page";
import Best from "../BestPlace/page";
import Button from "@/components/button/Button";
const restaurant = [
  {
    id: "1",
    path: "/images/sizzlers.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
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
    path: "/images/img6.jpeg",
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
    path: "/images/ice-creams.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "60% OFF UPTO ₹120",
  },
  {
    id: "10",
    path: "/images/drinks.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "50% OFF UPTO ₹100",
  },
  {
    id: "11",
    path: "/images/shakes.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "70% OFF UPTO ₹140",
  },
  {
    id: "12",
    path: "/images/chaat.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "ITEMS AT ₹29",
  },
  {
    id: "13",
    path: "/images/snacks.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "60% OFF UPTO ₹120",
  },
  {
    id: "14",
    path: "/images/non.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "50% OFF UPTO ₹100",
  },
  {
    id: "15",
    path: "/images/nonveg.jpg",
    heading: "Raajbagh Restaurant",
    sub: "North Indian, South Indian, Indian...",
    place: "Chhindwara Locality",
    rating: "3.7 - 50-55 mins",
    offer: "70% OFF UPTO ₹140",
  },
  {
    id: "16",
    name: "",
    path: "/images/img1.jpeg",
    heading: "Hotel Sai Nath and Sai Restaurant",
    sub: "North Indian, Chinese,...",
    place: "Chhindwara Locality",
    rating: "4.3 - 45-50 mins",
    offer: "ITEMS AT ₹29",
  },
  //   {
  //     id: "17",
  //     name: "",
  //     path: "/images/greyNoodles.jpg",
  //     heading: "Hotel Sai Nath and Sai Restaurant",
  //     sub: "North Indian, Chinese,...",
  //     place: "Chhindwara Locality",
  //     rating: "4.3 - 45-50 mins",
  //   },
  //   {
  //     id: "18",
  //     name: "",
  //     path: "/images/img1.jpeg",
  //     heading: "Hotel Sai Nath and Sai Restaurant",
  //     sub: "North Indian, Chinese,...",
  //     place: "Chhindwara Locality",
  //     rating: "4.3 - 45-50 mins",
  //   },
  //   {
  //     id: "19",
  //     name: "",
  //     path: "/images/img1.jpeg",
  //     heading: "Hotel Sai Nath and Sai Restaurant",
  //     sub: "North Indian, Chinese,...",
  //     place: "Chhindwara Locality",
  //     rating: "4.3 - 45-50 mins",
  //   },
  //   {
  //     id: "20",
  //     name: "",
  //     path: "/images/img1.jpeg",
  //     heading: "Hotel Sai Nath and Sai Restaurant",
  //     sub: "North Indian, Chinese,...",
  //     place: "Chhindwara Locality",
  //     rating: "4.3 - 45-50 mins",
  //   },
];

const OnlineDelivery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage the filter values
  const [filters, setFilters] = useState({
    category: "",
    price: 0,
    date: "",
  });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Restaurants with online food delivery in Ghaziabad</h1>
          </div>
        </div>
        <header>
          <div style={{ padding: "20px" }}>
            <div className={styles.fixed}>
              <Button
                title={
                  <>
                    Filters <LiaSortSolid />
                  </>
                }
                onClick={openModal}
                btnType="btnPrimary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minWidth: "85px",
                }}
              />
              <Button
                title={
                  <>
                    Sort By <MdSort />
                  </>
                }
                btnType="btnPrimary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minWidth: "85px",
                }}
              />
              <Button
                title={
                  <>
                    Ratings <GoPlus />
                  </>
                }
                btnType="btnPrimary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  minWidth: "85px",
                }}
              />
              <Button
                title="Pure Veg"
                btnType="btnPrimary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "85px",
                }}
              />
              <Button
                title="Offers"
                btnType="btnPrimary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "85px",
                }}
              />
            </div>

            <FilterModal
              isOpen={isModalOpen}
              onClose={closeModal}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </header>
        <div className={styles.imaged}>
          <div className={styles.imageSection}>
            {restaurant.map((cat, indexes) => (
              <ImgContainer
                key={cat.id || indexes}
                data={cat}
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
      <Best />
    </>
  );
};

export default OnlineDelivery;
