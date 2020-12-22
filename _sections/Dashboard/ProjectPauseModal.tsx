import { Input, Modal } from "antd";
import React, { useState } from "react";

interface ProjectPauseModal {
	onOk: (comment: string) => void;
	visible: boolean;
	onCancel: () => void;
	currentPauseStatus: boolean;
}

const PauseProjectModal: React.FC<ProjectPauseModal> = ({ onOk, visible, onCancel, currentPauseStatus }) => {
	const [currentComment, setCurrentComment] = useState("");
	const clearInput = () => {
		setCurrentComment("");
	};
	const isOkBtnDisabled = currentPauseStatus ? false : currentComment.length === 0;
	return (
		<Modal
			title='Add Comments'
			onOk={(): void => {
				clearInput();
				onOk(currentComment);
			}}
			okButtonProps={{
				disabled: isOkBtnDisabled,
			}}
			onCancel={(): void => {
				clearInput();
				onCancel();
			}}
			visible={visible}
		>
			<Input onChange={e => setCurrentComment(e.target.value)} value={currentComment} />
		</Modal>
	);
};

export default PauseProjectModal;
