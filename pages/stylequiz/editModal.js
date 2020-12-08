import { Input, Modal, Switch } from "antd";
import React, { useEffect, useRef, useState } from "react";
export default function EditModal({ isModalVisible, handlModaleOk, selectedResource, handleCancel, data }) {
	const textareaRef = useRef(null);
	const [isChecked, setChecked] = useState(false);

	useEffect(() => {
		setChecked(selectedResource?.isActive);
	}, [selectedResource]);

	const { TextArea } = Input;
	const handleToggle = (checked, id) => {
		data.forEach(el => {
			if (id === el.id) {
				el.isActive = checked;
			}
		});
		setChecked(checked);
	};

	const onOk = () => {
		const desc = textareaRef?.current?.state?.value ? textareaRef.current.state.value : "";
		handlModaleOk(isChecked, desc, data);
		textareaRef.current.state.value = "";
	};

	return (
		<Modal title='Edit Description' visible={isModalVisible} onOk={onOk} onCancel={handleCancel}>
			<TextArea placeholder='Add your description...' ref={textareaRef} />
			<br></br>
			<br></br>
			<div>
				<p>Is Active</p>
				<Switch checked={isChecked} onChange={checked => handleToggle(checked, selectedResource?.id)} />
			</div>
		</Modal>
	);
}
