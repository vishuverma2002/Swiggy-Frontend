import { useContext, useEffect, useState } from "react";
import Heading from "../heading/Heading";
import styles from "./style.module.css";
import InputRow from "../input_row/InputRow";
import Button from "../button/Button";
import { BsCheck2, BsCheck2All, BsXCircle } from "react-icons/bs";
import { axios_, getTodaysDate } from "@/utils/utll";
import { Context } from "@/store/store";
import Modal from "../modal/Modal";
import Form from "../form/Form";
import Input from "../input/Input";

function RiskProfile({ investor, questionnaire, portfolioId, onSuccess = () => { }, style, onClose = () => { } }) {
  const [score, setScore] = useState({});
  const [total, setTotal] = useState(0);
  const [clientAgree, setClientAgree] = useState(true);
  const [recommendedProfile, setRecommended] = useState({});
  const [selectedProfile, setSelectedProfile] = useState({});
  const [agreeToSubmit, setAgreeToSubmit] = useState(false);
  const [showOTPModel, setShowOTPModel] = useState(false);
  const [profileFormData, setProfileFormData] = useState({ token: "", selectedInvestor: "", completeDate: getTodaysDate(), riskProfileId: "", otp: "", isBusy: false });
  const { showMessage } = useContext(Context);

  useEffect(() => {
    let total = 0;
    Object.keys(score).forEach((key) => {
      if (key !== "total") {
        total += score[key];
      }
    });
    setRecommended(questionnaire.riskProfiles.filter((profile) => profile.min <= total && profile.max >= total)[0]);
    setTotal(total);
  }, [score]);

  const [submitted, setSubmitted] = useState(false);

  async function submitRiskProfile() {
    try {
      if (!clientAgree && !selectedProfile?.title) {
        return showMessage("Please select a new risk profile", false);
      }
      let investorRiskProfileDetails = {};
      let investorQuestionDetails = [];
      Object.keys(score).forEach((key) => {
        let questionData = questionnaire.questionDetails[parseInt(key)];

        let obj = {
          question: questionData.question,
          answer: questionData.answers.filter((ans) => ans.score === score[key])[0].title,
          score: score[key],
        };
        investorQuestionDetails.push(obj);
      });
      investorRiskProfileDetails = {
        riskProfileDetailsId: questionnaire.riskProfileDetailsId,
        investorQuestionDetails: investorQuestionDetails,
        totalPoints: total,
        accessedRiskProfile: clientAgree ? recommendedProfile.title : selectedProfile.title,
        recommendedRiskProfileId: recommendedProfile.riskProfilesId,
        selectedRiskProfileId: selectedProfile.riskProfilesId,
        agreeStatus: clientAgree,
        isActive: true,
        completionStatus: true,
        completionDate: profileFormData.completeDate,
        notes: "",
      };

      let inputData = {
        token: profileFormData.token,
        otp: profileFormData.otp,
        investorId: investor.userId,
        investorRiskProfileDetails,
      };

      let res = await axios_.post("advisor/investor-risk-profile/questionnaire/save", inputData);
      if (res.status == 200) {
        showMessage("Success", true);
        onSuccess();
        setShowOTPModel(false);
        onClose();
      } else {
        showMessage("Error", false);
      }
    } catch (e) {
      console.log(e);
      showMessage("Error in saving risk profile quetionnaire", false);
    }
  }

  async function sendOtp() {
    try {
      let res = await axios_.post(`risk-profile/send-token-with-otp/by-investor-id/${investor.userId}`);
      if (res.status == 200) {
        showMessage("OTP has been sent to investor registered email id", true);
        setProfileFormData((prev) => {
          return { ...prev, token: res.data.data };
        });
      }
    } catch (e) {
      console.log(e);
    }
    setShowOTPModel(true);
  }

  return (
    <>
      <Modal
        zindex={16}
        visible={showOTPModel}
        title="Enter OTP"
        maxWidth="50vw"
        showCloseButton={true}
        onClose={() => {
          setShowOTPModel(false);
        }}
      >
        <Form>
          <span className={styles.heading}>We have sent One Time Password to investor's registered email address.</span>
          <InputRow>
            <Input
              name={"otp"}
              title={"Enter Email OTP"}
              onChange={(e) => {
                setProfileFormData((p) => {
                  return { ...p, [e.target.name]: e.target.value };
                });
              }}
              value={profileFormData.otp}
            />
            <Button title={"Submit"} loading={profileFormData.isBusy} onClick={submitRiskProfile} />
          </InputRow>
        </Form>
      </Modal>

      {!submitted ? (
        <div className={styles.container}>
          <Heading text="Private & Confidential -  Please choose answer carefully" type="heading_secondary" />
          <div className={styles.questions}>
            {questionnaire?.questionDetails?.length &&
              questionnaire.questionDetails.map((question, index) => {
                return (
                  <ul key={`UL${index}`}>
                    <div> {`Q${index + 1}. ${question.question}`}</div>
                    {question.answers.map((ans, indexAns) => {
                      return (
                        <li
                          key={"li" + indexAns}
                          onClick={() => {
                            setScore((prev) => {
                              return { ...prev, [index]: ans.score };
                            });
                          }}
                        >
                          <span>
                            <input type="radio" checked={score?.[index] === ans.score} name={index} onChange={() => { }} />
                            {ans.title}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            <InputRow align={"right"}>
              <Button
                title={"Continue"}
                onClick={() => {
                  setSubmitted(true);
                }}
              />
            </InputRow>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <p style={{ fontSize: "1rem", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span>
              Your Score is <span style={{ fontSize: "1.2rem", color: "var(--primary-color)" }}>{total}</span>
            </span>
            <span>
              Based on your score, your recommended risk profile is <span style={{ color: "var(--primary-color)" }}>{recommendedProfile?.title || "NA"}</span>{" "}
            </span>
          </p>
          <table className={styles.profileTable}>
            <thead>
              <tr>
                <th>Points</th>
                <th>Profile Name</th>
                <th>Profile Description</th>
                <th>Assigned</th>
              </tr>
            </thead>
            {questionnaire?.riskProfiles?.length &&
              questionnaire?.riskProfiles.map((profile, index) => {
                return (
                  <tr className={recommendedProfile?.title == profile.title ? styles.selected : ""}>
                    <td>{`${profile.min} to ${profile.max}`}</td>
                    <td>{profile.title}</td>
                    <td>{profile.description}</td>
                    <td>
                      <span style={{ display: "flex", justifyContent: "center" }}>
                        {recommendedProfile?.title == profile.title ? <BsCheck2All size={25} color="var(--primary-color)" /> : <BsXCircle size={25} color="var(--primary-color)" />}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </table>

          <Heading text={"Client Acknowledgement"} />
          <table className={styles.ackTable}>
            <thead>
              <tr>
                <th></th>
                <th style={{ textAlign: "center" }}>Select</th>
              </tr>
            </thead>
            <tr>
              <td>I agree with the category assigned above and understand that this profile will be considered in the advice process</td>
              <td>
                <span className="fullFlex">
                  <input
                    type="radio"
                    name={"clientChoice"}
                    checked={clientAgree}
                    onClick={() => {
                      setClientAgree(true);
                    }}
                    onChange={() => { }}
                  />
                </span>
              </td>
            </tr>
            <tr>
              <td>I disagree with the risk profile assigned above</td>
              <td>
                <span className="fullFlex">
                  <input
                    type="radio"
                    name={"clientChoice"}
                    checked={!clientAgree}
                    onChange={() => { }}
                    onClick={() => {
                      setClientAgree(false);
                      setAgreeToSubmit(false);
                    }}
                  />
                </span>
              </td>
            </tr>
          </table>
          {!clientAgree && (
            <>
              <Heading text={"Variation to risk profile"} />
              <table className={styles.ackTable}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", backgroundColor: "var(--secondary-color)" }}>Requested by client</th>
                  </tr>
                </thead>
                <tr>
                  <td>I disagree with the original risk profile or the adviser proposed variation to the risk profile and request to be placed in the following risk profile.</td>
                </tr>
              </table>
              <Heading text={"New Risk Profile"} />
              <table className={`${styles.profileTable} ${styles.newProfile}`}>
                <thead>
                  <tr>
                    <th>Profile Name</th>
                    <th>Assigned</th>
                  </tr>
                </thead>
                {questionnaire?.riskProfiles?.length &&
                  questionnaire?.riskProfiles
                    .filter((profile) => profile.title != recommendedProfile?.title)
                    .map((profile, index) => {
                      return (
                        <tr className={selectedProfile.title == profile.title ? styles.selected : ""}>
                          <td>{profile.title}</td>

                          <td>
                            <span className="fullFlex">
                              <input
                                type="radio"
                                name={"newChoice"}
                                onClick={() => {
                                  setSelectedProfile(profile);
                                }}
                                onChange={() => { }}
                              />
                            </span>
                          </td>
                        </tr>
                      );
                    })}
              </table>
              <table className={styles.ackTable}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", backgroundColor: "var(--secondary-color)" }}>Acknowledgement</th>
                    <th>Select</th>
                  </tr>
                </thead>
                <tr>
                  <td>I/We agree with the proposed adviser variation to the risk profile</td>
                  <td>
                    <span className="fullFlex">
                      <input
                        type="checkbox"
                        name={"clientChoice3"}
                        onChange={(e) => {
                          setAgreeToSubmit((prev) => e.target.checked);
                        }}
                      />
                    </span>
                  </td>
                </tr>
              </table>
            </>
          )}

          <InputRow align={"right"}>
            <Button
              title={"Go Back"}
              onClick={() => {
                setSubmitted(false);
              }}
            />
            <Button
              disabled={clientAgree ? false : agreeToSubmit ? false : true}
              title={"Submit Assessment"}
              onClick={() => {
                sendOtp();
              }}
            />
          </InputRow>
        </div>
      )}
    </>
  );
}

export default RiskProfile;
