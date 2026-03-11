import React from "react";
import styles from "./best.module.css";

const RenderList = ({ data, title }) => (
  <section className={styles.section}>
    <div className={styles.sectionHeader}>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
    <div className={styles.grid}>
      {data.map((item, index) => (
        <div
          key={index}
          className={`${styles.card} ${item.title === "Show More" ? styles.showMore : ""}`}
        >
          <div className={styles.store}>{item.title}</div>
        </div>
      ))}
    </div>
  </section>
);

const Best = () => {
  const rests = [
    { title: "Best Restuarant in Bangalore" },
    { title: "Best Restuarant in Pune" },
    { title: "Best Restuarant in Mumbai" },
    { title: "Best Restuarant in Delhi" },
    { title: "Best Restuarant in Hyderabad" },
    { title: "Best Restuarant in Kolkata" },
    { title: "Best Restuarant in Chennai" },
    { title: "Best Restuarant in Chandigarh" },
    { title: "Best Restuarant in Ahemdabad" },
    { title: "Best Restuarant in Jaipur" },
    { title: "Best Restuarant in Nagpur" },
    { title: "Show More" },
  ];

  const rests1 = [
    { title: "Chinese Resturant Near Me" },
    { title: "South Indian Resturant Near Me" },
    { title: "Indian Resturant Near Me" },
    { title: "Kerala Resturant Near Me" },
    { title: "Korean Resturant Near Me" },
    { title: "North Indian Resturant Near Me" },
    { title: "Seafood Resturant Near Me" },
    { title: "Bengali Resturant Near Me" },
    { title: "Punjabi Resturant Near Me" },
    { title: "Italian Resturant Near Me" },
    { title: "Andhra Resturant Near Me" },
    { title: "Show More" },
  ];

  return (
    <>
      <div className={styles.container}>
        <RenderList data={rests} title="Best Places to eat across cities" />
        <RenderList data={rests1} title="Best Cuisines Near Me" />
        <hr className={styles.divider} />
      </div>
    </>
  );
};

export default Best;
