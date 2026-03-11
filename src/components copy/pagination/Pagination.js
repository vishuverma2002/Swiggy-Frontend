import { useEffect, useState } from "react";

import styles from "./styles/pagination.module.css";

export default function Pagination({ onChange = () => {}, totalRecord = 100 }) {
  const [selectedValue, setSelected] = useState(25);
  const [currenPageNumber, setCurrentPageNumber] = useState(1);
  const [total, setTotalRecrods] = useState(totalRecord - 1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setTotalPages(Math.ceil(total / selectedValue));
    onChange(selectedValue, currenPageNumber);
  }, [selectedValue, currenPageNumber, totalRecord]);

  return (
    <>
      <div className={styles.pagination}>
        <span className={styles.displayRecords}>{`Showing ${currenPageNumber == 1 ? 1 : total < (currenPageNumber - 1) * selectedValue + 1 ? 1 : (currenPageNumber - 1) * selectedValue + 1} To ${
          currenPageNumber == 1 ? (total < selectedValue ? total : selectedValue) : total < currenPageNumber * selectedValue ? total : currenPageNumber * selectedValue
        } Of ${total}`}</span>
        {total > 25 && (
          <>
            <select
              value={selectedValue}
              className={styles.select}
              onChange={(e) => {
                setSelected(e.target.value);
              }}
            >
              <option selectedValue value={25}>
                25
              </option>
              <option selectedValue value={50}>
                50
              </option>
              <option selectedValue value={100}>
                100
              </option>
              <option selectedValue value={200}>
                200
              </option>
            </select>

            <div className={styles.pages}>
              <span
                onClick={() => {
                  setCurrentPageNumber((prev) => {
                    if (prev == 1) return prev;
                    let next = prev - 1;
                    return next;
                  });
                }}
              >
                Prev
              </span>
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  let val;
                  return (
                    <span
                      key={`$page_${index}`}
                      onClick={() => {
                        setCurrentPageNumber(() => {
                          let val = currenPageNumber < 4 ? index + 1 : currenPageNumber - 2 + index;

                          if (val > totalPages) return currenPageNumber;
                          return val;
                        });
                      }}
                    >
                      {currenPageNumber < 4 ? index + 1 : currenPageNumber - 2 + index}
                    </span>
                  );
                })}

              <span
                onClick={() => {
                  setCurrentPageNumber((prev) => {
                    if (prev == totalPages) return prev;
                    let next = prev + 1;
                    return next;
                  });
                }}
              >
                Next
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
