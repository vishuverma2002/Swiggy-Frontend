import { BsX } from "react-icons/bs";
import styles from "./style.module.css";
import { useEffect, useState } from "react";
import { axios_ } from "@/utils/utll";
import Button from "../button/Button";
import { useRouter } from "next/router";

function Alerts() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  useEffect(() => {
    checkAlerts();
  }, []);

  function handleView() {
    setShow(false);
    router.push("/manage_platform/portfolio_alerts");
  }
  async function checkAlerts() {
    try {
      let res = await axios_.get(`alert-settings/popup-message`);
      if (res.status == 200) {
        if (res.data == true) {
          setShow(true);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  if (!show) return null;
  return (
    <div className={styles.container}>
      <span
        style={{ position: "absolute", top: "10px", right: "20px" }}
        onClick={() => {
          setShow(false);
        }}
      >
        <BsX size={20} />
      </span>
      <span style={{ display: "block", width: "90%" }}>Your account needs attention: Some balances exceed your set thresholds, and/or your investments deviate from your risk profile. Review now to optimize your funds.</span>
      <span style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginTop: "10px", paddingRight: "2rem" }}>
        <Button title={"View Alerts"} onClick={handleView} btnType="btnSecondary" style={{ color: "var(--primary-color)", fontSize: "12px", cursor: "pointer" }} />
      </span>
    </div>
  );
}

export default Alerts;
