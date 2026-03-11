import Modal from "../modal/Modal";
import InputRow from "../input_row/InputRow";
import FileSelector from "../file_selector/FileSelector";
import Button from "../button/Button";
import { useEffect, useState } from "react";

function FileSelectModal({ onUpload = () => { }, visible = false, fileType = "csv", onClose = () => { }, fullScreenOverlay = false }) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState(false);
	const [uploaded, setUploaded] = useState(false);
	useEffect(() => { setError(false); }, []);
	const [file, setFile] = useState(null);
	function handleFileChange(file) {
		setFile(file);
		setError(false);
	}
	async function handleUploadTemplate(e) {
		try {
			e.preventDefault();

			if (!file) {
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 500);
				return;
			}

			setUploading(true);
			let status = await onUpload(file);
			if (status) {
				setUploaded(true);
				setTimeout(() => {
					setUploaded(false);
				}, 3000);
			} else {
				setError(true);
				setTimeout(() => {
					setError(false);
				}, 3000);
			}
			setUploading(false);
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	}
	return (
		<Modal title="Upload Bulk" visible={visible} maxWidth="30rem" onClose={onClose} modalTransaprent={true} fullScreenOverlay={fullScreenOverlay}>
			<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
				<FileSelector checkFileType={true} onFileSelect={handleFileChange} loading={uploading} fileType={fileType} isError={error} uploaded={uploaded} />
				<InputRow align={'center'}>
					<Button title="Upload" btnType="btnPrimary" onClick={handleUploadTemplate} />
				</InputRow>
			</div>
		</Modal>
	);
}

export default FileSelectModal;
