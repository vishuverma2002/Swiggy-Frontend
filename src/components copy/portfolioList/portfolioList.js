import { useContext, useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { axios_, axios_Investor, debounce, getTodaysDate } from "@/utils/utll";
import styles from "@/components/table/style/table.module.css";
import popupStyles from "./style.module.css";
import Search from "../search/Search";
import { BsCheck2All, BsPlus } from "react-icons/bs";
import { BiCheckDouble } from "react-icons/bi";
import { Context } from "@/store/store";
import Loader from "../loader/Loader";
import { useRouter } from "next/router";
import InputRow from "../input_row/InputRow";
import Tabs from "../tabs/tabs";
import Tab from "../tab/tab";
import { HiRefresh } from "react-icons/hi";

function PortfolioList() {
  const [loading, setLoading] = useState(true);
  const { showPortfolioList, setShowPortfolioList, getInvestorId, investorId, user } = useContext(Context);
  const [portfolioList, setportfolioList] = useState([]);
  const [modelPortfolioList, setModelPortfolioList] = useState([]);
  const [selected, setSelected] = useState([]);
  const [refreshingId, setRefreshingId] = useState();
  const [refreshed, setRefreshed] = useState({});
  const [filterList, setFilterList] = useState([]);

  useEffect(() => {
    if (!investorId) getInvestorId();
  }, []);

  useEffect(() => {
    setRefreshed({});
    investorId && getList();
  }, [investorId]);
  useEffect(() => {
    if (portfolioList) getList();
  }, [showPortfolioList]);

  const [filter, setFilter] = useState(undefined);

  useEffect(() => {
    if (filter == "" || !filter) {
      setFilterList(portfolioList);
    } else {
      setFilterList(() => {
        return portfolioList.filter((client) => JSON.stringify(client).toLowerCase().includes(filter.toLowerCase()));
      });
    }
  }, [filter]);

  const search = debounce((value) => {
    setFilter(value);
  });
  async function getList() {
    try {
      let res = await Promise.all([axios_Investor.get("/portfolios-id-name"), axios_.get(`/model/portfolios-id-name`)]);
      res = res.map((i) => (i.status == 200 ? i.data : []));
      if (res[0].length > 0) {
        setportfolioList(res[0]);
        setFilterList(res[0]);
        setLoading(false);
      }
      if (res[1].length > 0) setModelPortfolioList(res[1]);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  async function refreshPortfolios(portfolioId) {
    try {
      setRefreshingId(null); // Reset before starting
      let company = user?.userDetail?.company;
      let userId = user?.userDetail?.userId;
      // Create an array of promises for all selected portfolioIds

      setRefreshingId(portfolioId);
      try {
        let status = await (async () => {
          try {
            // Create all dataset - > Unrealise capital gain loss - > Fees (In day Loop ) -> Cash Management ( in day Loop)
            await axios_.post(`refreshDetails`, { portfolioId, company, userId });
            await axios_.post(`company/updatePortfolioCommission`, { userId, company: user?.userDetail?.company, portfolioIds: [portfolioId] }); // AMIT's API
            await axios_.post(`company/update/latestDate`, { allUpdated: true, portfolioId, latestDate: getTodaysDate() }); // AMIT's API
            return true;
          } catch (e) {
            return false;
          }
        })();
        // Batch update `setRefreshed` state
        setRefreshed((prev) => {
          const updated = { ...prev };
          updated[portfolioId] = { status };
          return updated;
        });
      } catch (error) {
        return { portfolioId, status: false }; // Mark as failed
      }
    } catch (error) {
      console.error("Error in refreshPortfolios:", error);
    } finally {
      setRefreshingId(undefined);
      setSelected([]); // Reset selection after completion
    }
  }

  function handleSelectPorfolios(id) {
    setSelected((prev) => {
      let obj = [...prev];
      if (obj.includes(id)) {
        obj = obj.filter((item) => item !== id); // Fix: Remove selected ID correctly
      } else {
        obj.push(id);
      }
      return obj;
    });
  }
  const router = useRouter();

  return (
    <>
      <Modal
        visible={showPortfolioList}
        title={"Select Portfolio(s)"}
        minHeight={"70%"}
        maxWidth="48%"
        onClose={() => {
          setShowPortfolioList(false);
        }}
      >
        <div className={popupStyles.contentContainer}>
          <div className={popupStyles.searchSection}>
            <div className={popupStyles.searchWrapper}>
              <Search onChange={search} />
            </div>
          </div>
          {loading ? (
            <div className={popupStyles.loaderContainer}>
              <Loader />
            </div>
          ) : (
            <div className={popupStyles.tabsSection}>
              <Tabs activeTab={router.asPath.includes("model_") ? 1 : 0}>
                <Tab title={"Client Portfolios"}>
                  <PortfolioListTable refreshPortfolios={refreshPortfolios} filterList={filterList} refreshingId={refreshingId} selected={selected} refreshed={refreshed} setShowPortfolioList={setShowPortfolioList} handleSelectPorfolios={handleSelectPorfolios} router={router} />
                </Tab>
                <Tab title={"Model Portfolios"}>
                  <PortfolioListTable refreshPortfolios={refreshPortfolios} filterList={modelPortfolioList} refreshingId={refreshingId} selected={selected} refreshed={refreshed} setShowPortfolioList={setShowPortfolioList} handleSelectPorfolios={handleSelectPorfolios} router={router} />
                </Tab>
              </Tabs>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
function PortfolioListTable({ filterList, refreshingId, refreshed, setShowPortfolioList, refreshPortfolios, router }) {
  return (
    <div className={popupStyles.tableContainer}>
      <table className={styles.table} style={{ width: "100%", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "120px" }} />
          <col style={{ width: "150px" }} />
          <col style={{ width: "auto" }} />
        </colgroup>
        <thead>
          <tr>
            <th className={popupStyles.tableHeader} style={{ textAlign: "center" }}>
              {" "}
              Action{" "}
            </th>
            <th className={popupStyles.tableHeader} style={{ textAlign: "left" }}>
              {" "}
              Portfolio ID{" "}
            </th>
            <th className={popupStyles.tableHeader} style={{ textAlign: "left" }}>
              Portfolio Name
            </th>
          </tr>
        </thead>
        <tbody>
          {filterList?.length > 0 ? (
            filterList.map((portfolio, index) => {
              const isRefreshing = refreshingId === portfolio[0];
              const refreshStatus = refreshed?.[portfolio[0]];
              return (
                <tr key={index} className={popupStyles.tableRow}>
                  <td className={popupStyles.actionCell}>
                    <button className={`${popupStyles.refreshBtn} ${isRefreshing ? popupStyles.refreshing : ""}`} onClick={() => refreshPortfolios(portfolio[0])} disabled={isRefreshing} title="Refresh Portfolio">
                      <HiRefresh className={isRefreshing ? popupStyles.animate : ""} size={18} />
                    </button>
                  </td>
                  <td className={popupStyles.idCell}>{portfolio[0]}</td>
                  <td className={popupStyles.nameCell}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                      <span className={popupStyles.portfolioName}>{portfolio[1]}</span>
                      {refreshStatus && <span className={`${popupStyles.statusBadge} ${refreshStatus.status ? popupStyles.successBadge : popupStyles.errorBadge}`}>{refreshStatus.status ? <BsCheck2All size={16} /> : <BiCheckDouble size={16} />}</span>}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className={popupStyles.emptyState}>
                <button
                  className={popupStyles.addButton}
                  onClick={() => {
                    setShowPortfolioList(false);
                    router.push("/add_portfolio");
                  }}
                >
                  <BsPlus size={18} />
                  <span>Add New Portfolio</span>
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioList;
