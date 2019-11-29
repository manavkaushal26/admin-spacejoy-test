import React, { Dispatch, ReducerAction } from "react";
import { Checkbox, Typography } from "antd";
import { CustomDiv } from "@sections/Dashboard/styled";
import styled from "styled-components";
import { ModifiedDivider } from "../../styled";
import { FILTER_ACTION_TYPES, FilterReducerType } from "..";

const CheckboxGroup = Checkbox.Group;
const { Text } = Typography;
interface CategoryFilterProps {
	name: {
        categoryName: string;
        dispatchName: FILTER_ACTION_TYPES;
    };
    options: { label: string; value: string }[];
    dispatch: Dispatch<ReducerAction<FilterReducerType>>
}

const BlockCheckboxGroup = styled(CheckboxGroup)`
	display: block;
	.ant-checkbox-group-item {
		display: block;
		margin: 8px 0px;
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
				<BlockCheckboxGroup onChange={(selectedValues) => {dispatch({type:name.dispatchName, value:selectedValues})}} options={options} />
			</CustomDiv>
		</>
	);
};

export default CategoryFilter;
