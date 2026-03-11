import React from "react";
import styles from "./style.module.css";
import Modal from "../modal/Modal";
import Button from "../button/Button";

export default function ConfirmModal({ handleCancel = () => {}, handleDelete = () => {}, visible, style, confirmText = "Delete" }) {
    return (
        <Modal zindex={1000} visible={visible} minHeight={"10vh"} maxWidth="20vw" title="Confirm?" onClose={() => handleCancel(false)} modalTransaprent={true} style={{ ...style }}>
            <div className={styles.deleteModal} style={{ ...style }}>
                <p style={{ marginBottom: ".2rem", textAlign: "center" }}>{`Are you sure you want to ${confirmText.toLocaleLowerCase()}?`}</p>
                <div style={{ marginBottom: "1rem" }}>
                    <Button onClick={handleDelete} title={`${confirmText}`} style={{ backgroundColor: "red", color: "white" }} />
                    <Button onClick={() => handleCancel(false)} title={"Cancel"} />
                </div>
            </div>
        </Modal>
    );
}
