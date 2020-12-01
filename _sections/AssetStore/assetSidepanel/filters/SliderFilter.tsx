import { Col, Input, InputNumber, Row } from "antd";
import React from "react";
type ValueName = "priceRange" | "heightRange" | "depthRange" | "widthRange";
interface SliderFilterInterface {
	range: [number, number];
	value: [number, number];
	onChange: (updatedValue: number, type: "min" | "max", name: ValueName) => void;
	name: ValueName;
}

const SliderFilter: React.FC<SliderFilterInterface> = ({ range, value, onChange, name }) => {
	const [minVal, maxVal] = range;
	const [min, max] = value;

	const onValueChange = (value, type) => {
		let changedValue = value < 0 ? 0 : value;

		if (type === "min") {
			if (value < max) {
				changedValue = value;
			} else {
				changedValue = max;
			}
		} else {
			if (value > min) {
				changedValue = value;
			} else {
				changedValue = min;
			}
		}
		onChange(changedValue, type, name);
	};

	return (
		<Row>
			<Col span={10}>
				<InputNumber
					style={{ width: "100%" }}
					value={min}
					min={minVal}
					max={maxVal}
					onChange={value => onValueChange(value, "min")}
				/>
			</Col>
			<Col span={4}>
				<Input style={{ textAlign: "center" }} placeholder='~' value='~' disabled />
			</Col>
			<Col span={10}>
				<InputNumber
					style={{ width: "100%" }}
					value={max}
					min={minVal}
					max={maxVal}
					onChange={value => onValueChange(value, "max")}
				/>
			</Col>
		</Row>
	);
};

export default SliderFilter;
