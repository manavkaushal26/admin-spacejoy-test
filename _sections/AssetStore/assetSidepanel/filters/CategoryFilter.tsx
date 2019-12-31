import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Checkbox, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const CheckboxGroup = Checkbox.Group;
const { Text } = Typography;
interface CategoryFilterProps {
	name: {
		categoryName: string;
		dispatchName: ASSET_ACTION_TYPES;
	};
	options: { label: string; value: string }[];
	dispatch: React.Dispatch<AssetAction>;
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

const CategoryFilter: React.FC<CategoryFilterProps> = ({ name, options, dispatch }): JSX.Element => {
	return (
		<>
			<Text strong>{name.categoryName}</Text>
			<CustomDiv my="12px" maxHeight="150px" overY="scroll">
				<BlockCheckboxGroup
					onChange={selectedValues => {
						dispatch({ type: name.dispatchName, value: selectedValues });
					}}
					options={options}
				/>
			</CustomDiv>
		</>
	);
};

export default CategoryFilter;
