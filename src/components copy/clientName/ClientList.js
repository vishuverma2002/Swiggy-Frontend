import { useContext, useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { axios_, debounce } from "@/utils/utll";
import styles from "@/components/table/style/table.module.css";
import Search from "../search/Search";
import { BsArrowUpRightCircle, BsPlus, BsSearch } from "react-icons/bs";
import { Context } from "@/store/store";
import Loader, { Loader3 } from "../loader/Loader";
import { useRouter } from "next/router";
import Button from "../button/Button";
import { HiRefresh } from "react-icons/hi";
import { IoRefresh } from "react-icons/io5";
import InputRow from "../input_row/InputRow";

function ClientList() {
  const [loading, setLoading] = useState(true);
  const { showClientList, setShowClientList, getInvestorToken, showMessage } = useContext(Context);
  const [clientList, setClientList] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [selecting, setSelecting] = useState(true);

  useEffect(() => {
    getList();
  }, []);

  const [filter, setFilter] = useState(undefined);

  useEffect(() => {
    if (filter == "" || !filter) {
      setFilterList(clientList);
    } else {
      setFilterList(() => {
        return clientList.filter((client) => JSON.stringify(client).toLowerCase().includes(filter.toLowerCase()));
      });
    }
  }, [filter]);

  const search = debounce((value) => {
    setFilter(value);
  });
  async function getList() {
    try {
      setLoading(true);
      let res = await axios_.get("/advisor/investor/get-all-by-token");
      if (res.status == 200) {
        setClientList(res.data.data);
        setFilterList(res.data.data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  async function handleSelectClient(client) {
    try {
      setSelecting(client.userId);
      await getInvestorToken(client);
      setShowClientList(false);
      setSelecting(true);
    } catch (e) {
      console.log(e);
      setSelecting(false);
    }
  }
  const router = useRouter();
  return (
    <>
      <Modal
        visible={showClientList}
        title={
          <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            {" "}
            <span>Select Client</span>{" "}
            <div style={{ display: "flex" }}>
              {" "}
              <Button
                title={"Add New"}
                onClick={() => {
                  setShowClientList(false);
                  router.push("/manage_clients");
                }}
              />{" "}
              <Button title={"Refresh"} onClick={getList} />{" "}
            </div>{" "}
          </div>
        }
        zindex={50}
        minHeight={"70%"}
        maxWidth="50%"
        onClose={() => {
          setShowClientList(false);
        }}
      >
        <div style={{ paddingInline: "1rem" }}>
          <Search onChange={search} />
          {loading ? (
            <Loader />
          ) : (
            <table className={styles.table} style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {filterList?.length > 0 ? (
                  filterList.map((client, index) => {
                    return (
                      <tr key={index} style={{ cursor: "pointer" }} onClick={() => handleSelectClient(client)}>
                        <td>
                          <span style={{ width: "1rem", justifyContent: "center", alignItems: "center", width: "100%", display: "flex", alignItems: "center" }}>{selecting === client.userId ? <Loader3 /> : <BsArrowUpRightCircle size={18} />}</span>
                        </td>
                        <td>{client.name}</td>
                        <td>{client.email}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: "1rem", textAlign: "center", width: "100%", color: "var(--primary-color)" }}>
                      <span
                        onClick={() => {
                          setShowClientList(false);
                          router.push("/manage_clients");
                        }}
                        style={{ cursor: "pointer", justifyContent: "center", display: "flex", alignItems: "center", width: "100%" }}
                      >
                        {" "}
                        <BsPlus size={18} /> Add New Client{" "}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </>
  );
}

export default ClientList;
