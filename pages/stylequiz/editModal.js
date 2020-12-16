import { Input, Modal } from "antd";
import React, { useRef } from "react";
export default function EditModal({ isModalVisible, handlModaleOk, handleCancel }) {
	const textareaRef = useRef(null);
	const { TextArea } = Input;

	const onOk = () => {
		const desc = textareaRef?.current?.state?.value ? textareaRef.current.state.value : "";
		handlModaleOk(desc);
		textareaRef.current.state.value = "";
	};

	return (
		<Modal title='Edit Description' visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
			<TextArea placeholder='Add your description...' ref={textareaRef} />
			<br></br>
			<br></br>
		</Modal>
	);
}
