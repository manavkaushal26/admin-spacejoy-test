import React from "react";
import { Row, Col, Select, Typography } from "antd";

const { Text } = Typography;

interface SelectField {
	name: string;
	value: string | string[] | number[];
	options: Record<string, string>[];
	label: string;
	onChange: (name, value) => void;
	optionValueNameField?: string;
	optionValueField?: string;
}

const SelectField: React.FC<SelectField> = ({
	name,
	label,
	value,
	options,
	optionValueNameField,
	optionValueField,
	onChange,
}) => {
	const handleChange = (selectedValue): void => {
		onChange(name, selectedValue);
	};

	return (
		<Row gutter={[4, 4]}>
			<Col span={24}>
				<Text strong>{label}</Text>
			</Col>
			<Col span={24}>
				<Select style={{ width: "100%" }} value={value} onChange={handleChange}>
					{options.map(option => {
						return (
							<Select.Option key={option._id} value={option["_id" || optionValueField]}>
								{option["name" || optionValueNameField]}
							</Select.Option>
						);
					})}
				</Select>
			</Col>
		</Row>
	);
};

export default SelectField;
