import React from "react";
import { Row, Col, Typography, Input } from "antd";

interface InputField {
	value: string | number;
	onChange: (name, value) => void;
	name: string;
	label: string;
}

const { Text } = Typography;

const InputField: React.FC<InputField> = ({ name, label, value, onChange }) => {
	const handleChange = (e): void => {
		const {
			target: { value: changedValue },
		} = e;
		onChange(name, changedValue);
	};

	return (
		<Row gutter={[4, 4]}>
			<Col span={24}>
				<Text strong>{label}</Text>
			</Col>
			<Col>
				<Input name={name} value={value} onChange={handleChange} />
			</Col>
		</Row>
	);
};

export default InputField;
