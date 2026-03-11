import axios from "axios";
import { useRef, useState } from "react";

export default function CreateFolderPopup({ styles, cancelPopup, userEmail }) {
	const [fileList, setFileList] = useState([]);
	const [counter, setCounter] = useState(0);
	const [failed, setFailed] = useState("");
	const files = useRef();
	const yearRef = useRef();

	function uploadPDF() {
		let body;

		try {
			if (!yearRef.current.value) {
				yearRef.current.focus();
				return;
			}
			fileList.forEach(async (file) => {
				if (file.size <= 1048576) {
					const reader = new FileReader();

					reader.readAsDataURL(file);
					reader.onload = async () => {
						const base64 = reader.result.split("base64,")[1];

						body = {
							name: file.name,
							file: base64,
							email: userEmail,
							date: new Date(`1/1/${yearRef.current.value}`).toLocaleString("en-Us"),
						};

						const response = await axios.post("/api/uploadFile", body);
						if (response.status == 200) {
							setCounter((prev) => {
								const newCounter = prev + 1;
								return newCounter;
							});
						} else {
							setFailed(file.name);
						}
					};
					reader.onerror = (error) => {
						setFailed(body.name);
					};
				} else {
					setFailed(file.name);
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
	function seletPDFs() {
		files.current.click();
	}
	function setSelectedFiles(files) {
		setFileList([]);
		const obj = Array.from(files).map((e) => e);
		setFileList(obj);
	}

	function setDraggediles(e) {
		e.preventDefault();
		e.stopPropagation();
		setSelectedFiles(e.dataTransfer.files);
	}
	return (
		<div className={styles.popupContainer}>
			<div className={styles.createFolderpopup}>
				<div className={styles.inputGroup}>
					<input type="number" placeholder="Enter Year" min={2001} ref={yearRef} />
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setFileList([]);
						}}
						onDrop={setDraggediles}
						onClick={seletPDFs}>
						{fileList.length > 0 ? `${fileList.length} file(s) selected` : `Drag and Drop PDF files here`}
					</div>
					<input
						id="file"
						type="file"
						multiple
						hidden
						ref={files}
						onClick={() => setFileList([])}
						onChange={(e) => {
							setSelectedFiles(e.target.files);
						}}
					/>
				</div>
				<div className={styles.popupButtonGrup}>
					<button className={`${styles.popupButton}`} onClick={uploadPDF}>
						Upload
					</button>
					<button className={`${styles.popupButton}`} onClick={cancelPopup}>
						Close
					</button>
				</div>
				<h2>
					{`${counter}/${fileList.length} file(s) uploaded`}
					<br></br>
					{failed && `Failed to Upload - ${failed}`}
				</h2>
			</div>
		</div>
	);
}
