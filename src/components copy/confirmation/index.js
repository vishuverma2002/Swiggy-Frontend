import React, { useContext } from "react";
import Modal from "../modal/Modal";
import { Context } from "@/store/store";
import Button from "../button/Button";
import { BsQuestion } from "react-icons/bs";

function Confirmation() {
	const { setConfirm, confirm } = useContext(Context);
	function onClose() {
		setConfirm({ message: "", fn: () => { } });
	}
	return (
		<Modal zindex={20} visible={confirm.message !== ""} onClose={onClose} maxWidth="30rem" title="Confirmation" modalTransaprent={false} fullScreenOverlay={true}>
			<div style={{ display: "flex", flexDirection: "column", gap: "1rem", justifyContent: "center" }}>
				<p style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center', fontSize: "14px", padding: "1rem", textAlign: "center", color: "var(--primary-color)" }}>
					<span style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--primary-color)', borderRadius: '60px', padding: '5px' }}><BsQuestion size={30} /></span>
					{confirm.message}</p>
				<span style={{ display: "flex", justifyContent: "center" }}>
					<Button
						title={"Yes"}
						onClick={() => {
							onClose();
							confirm.fn();
						}}
					/>
					<Button title={"No"} onClick={onClose} />
				</span>
			</div>
		</Modal>
	);
}

export default Confirmation;
