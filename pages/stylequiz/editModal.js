import { Input, Modal, Switch } from "antd";
import React, { useRef, useState } from "react";
export default function EditModal({ isModalVisible, handlModaleOk, selectedResource, handleCancel }) {
	const textareaRef = useRef(null);
	const [isChecked, setChecked] = useState(false);
	const desc = textareaRef?.current?.state?.value ? textareaRef.current.state.value : "";
	const { TextArea } = Input;
	const handleToggle = checked => {
		setChecked(checked);
	};

	const onOk = () => {
		handlModaleOk(isChecked, desc);
		textareaRef.current.state.value = "";
	};

	return (
		<Modal title='Edit Description' visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
			<TextArea ref={textareaRef} />
			<div>
				<p>Is Active</p>
				<Switch checked={selectedResource?.isActive} onChange={checked => handleToggle(checked)} />
			</div>
		</Modal>
	);
}
