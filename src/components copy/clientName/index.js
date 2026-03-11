import { Context } from "@/store/store";
import { capitalizeEachWord } from "@/utils/utll";
import { useContext, useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";

function Investor_Name() {
  const { investorId, setShowClientList } = useContext(Context);
  const [clientName, setClientName] = useState(undefined);

  useEffect(() => {
    let token = sessionStorage.getItem("token_");
    if (token) {
      setClientName(parseJwt(sessionStorage.getItem("token_") || "Click To Select Client"));
    } else {
      setClientName({ "clientName ": "Click To Select Client" });
    }
  }, [investorId]);

  function parseJwt(token) {
    if (!token || token == "undefined") return undefined;
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replaceAll(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
  return (
    <div
      style={{
        color: "#fff",
        display: "flex",
        gap: "5px",
        alignContent: "center",
        cursor: "pointer",
        borderRadius: "5px",
        paddingBlock: "12px",
        marginRight: ".5rem",
      }}
      onClick={() => {
        setShowClientList(true);
      }}
    >
      {/* <span style={{ position: "absolute", top: "8px", fontSize: "10px", backgroundColor: "var(--banner-color)" }}>Select Client</span> */}
      <BsPerson size={18} color="#ffffff" />
      <span
        style={{
          color: "#fff",
          display: "flex",
          fontSize: "13px",
          alignItems: "center",
          gap: 1,
        }}
      >
        {clientName && capitalizeEachWord(clientName?.["clientName "])} <IoMdArrowDropdown size={18} color="#ffffff" />
      </span>
    </div>
  );
}

export default Investor_Name;
