import { Input, Modal } from "antd";
import React, { useRef } from "react";
export default function EditModal({
	isModalVisible,
	handlModaleOk,
	handleCancel,
	selectedResource,
	handleDescChange,
	data,
}) {
	const textareaRef = useRef(null);
	const { TextArea } = Input;

	const onOk = () => {
		const desc = textareaRef?.current?.state?.value ? textareaRef.current.state.value : "";
		handlModaleOk(desc);
		textareaRef.current.state.value = "";
	};

	const handleChange = e => {
		handleDescChange(e.target.value);
	};
	const currValue = data?.filter(item => item?.id === selectedResource?.id)[0]?.description || "";

	return (
		<Modal title='Edit Description' visible={isModalVisible} onOk={onOk} onCancel={handleCancel} okText='Save'>
			<TextArea
				style={{ height: 120 }}
				placeholder='Add your description...'
				value={currValue}
				ref={textareaRef}
				onChange={handleChange}
			/>
			<br></br>
			<br></br>
		</Modal>
	);
}
