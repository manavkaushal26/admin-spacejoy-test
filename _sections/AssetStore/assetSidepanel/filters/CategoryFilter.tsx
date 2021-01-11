import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { Checkbox, Col, Row, Switch, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const CheckboxGroup = Checkbox.Group;
const { Text } = Typography;

interface ExtraOption {
	name: ASSET_ACTION_TYPES;
	value: any;
	type: string;
}
interface CategoryFilterProps {
	name: {
		categoryName: string;
		dispatchName: ASSET_ACTION_TYPES;
	};
	extra: ExtraOption;
	options: { label: string; value: string }[];
	dispatch: React.Dispatch<AssetAction>;
	value: string[];
}

const BlockCheckboxGroup = styled(CheckboxGroup)`
	display: block;
	.ant-checkbox-group-item {
		display: block;
		margin: 6px 0px;
		span {
			text-transform: capitalize;
		}
	}
`;

const getExtraElement = (extra: ExtraOption, dispatch: React.Dispatch<AssetAction>) => {
	const onChange = checked => {
		dispatch({ type: extra.name, value: checked });
	};

	if (extra.type === "switch") {
		return (
			<Switch
				onChange={onChange}
				style={{ width: "100px" }}
				checkedChildren='Preferred'
				unCheckedChildren='All'
				checked={extra.value}
			/>
		);
	}
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ name, options, dispatch, value, extra }): JSX.Element => {
	return (
		<Row gutter={[4, 4]}>
			<Col span={24}>
				<Row justify='space-between'>
					<Col>
						<Text strong>{name.categoryName}</Text>
					</Col>
					{extra && getExtraElement(extra, dispatch)}
				</Row>
			</Col>
			<Col span={24} style={{ marginLeft: "12px", marginRight: "12px", maxHeight: "150px", overflowY: "scroll" }}>
				<BlockCheckboxGroup
					value={value}
					onChange={selectedValues => {
						dispatch({ type: name.dispatchName, value: selectedValues });
					}}
					options={options}
				/>
			</Col>
		</Row>
	);
};

export default CategoryFilter;
