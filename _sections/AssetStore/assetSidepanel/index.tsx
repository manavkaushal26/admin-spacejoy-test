import React, { useReducer, useMemo } from "react";
import { MetaDataType } from "@customTypes/moodboardTypes";
import Filter from "@sections/AssetStore/assetSidepanel/filters/categoryFilter";
import { Card, Typography, Tree } from "antd";
import { ModifiedDivider } from "../styled";
import { CustomDiv } from "@sections/Dashboard/styled";
import { getValueSafely } from "@utils/commonUtils";

const { TreeNode } = Tree;

const { Title } = Typography;

interface AssetSidePanelProps {
	metaData: MetaDataType;
}

interface AssetSidePanelState {
	retailerFilter: string[];
	categoryFilter: string[];
	expandedKeys: {
		category: string[];
		subCategory: string[];
		verticals: string[]
	};
}

interface ActionType {
	type: string;
	value: string[];
}

export enum FILTER_ACTION_TYPES {
	RETAILER = "RETAILER",
	CATEGORY = "CATEGORY",
	SUB_CATEGORY = "SUB_CATEGORY",
	EXPAND_TREE = "EXPAND_TREE",
}

export interface FilterReducerType {
	(state: AssetSidePanelState, action): AssetSidePanelState;
}

const reducer: FilterReducerType = (state, action: ActionType) => {
	switch (action.type) {
		case FILTER_ACTION_TYPES.RETAILER:
			return {
				...state,
				retailerFilter: action.value
			};
		case FILTER_ACTION_TYPES.CATEGORY:
			return {
				...state,
				categoryFilter: action.value
			};
		case FILTER_ACTION_TYPES.EXPAND_TREE:
			const expandedKeys = action.value.map((key)=>{
				return key.split('-');
			}).reduce((acc,curr) => {
				const currentSelectionArray = [...acc[curr[1]]];
				currentSelectionArray.push(curr[0]);
				return {
					...acc, 
					[curr[1]]: currentSelectionArray
				};

			}, {
				category: [],
				subCategory: [],
				verticals: [],
			});
			return {
				...state,
				expandedKeys: expandedKeys,
			}
	}
	return state;
};

const initialState: AssetSidePanelState = {
	retailerFilter: [],
	categoryFilter: [],
	expandedKeys: {
		category: [],
		subCategory: [],
		verticals: [],
	},
};

const AssetSidePanel: React.FC<AssetSidePanelProps> = ({ metaData }): JSX.Element => {
	const [state, dispatch] = useReducer<FilterReducerType>(reducer, initialState);

	const categoryMap = useMemo(() => {
		if (metaData) {
			return metaData.categories.list.map(elem => {
				return {
					title: {name: elem.name, level: "category"},
					key: elem._id,
					children: 
						metaData.subcategories.list
							.filter(subElem => {
								return subElem.category === elem._id;
							})
							.map(subElem => {
								return {
									title: {name: subElem.name, level: "subCategory"},
									key: subElem._id,
									children: 
										metaData.verticals.list
											.filter(vert => {
												return vert.subcategory === subElem._id;
											})
											.map(filtVert => {
												return { 
													title: {name: filtVert.name, level: "verticals"},
													key: filtVert._id 
												};
											})
									
								};
							})
					
				};
			});
		}
		return [];
	}, [metaData]);
	
	console.log(categoryMap)

	const onExpand = (expandedKeys) => {
		dispatch({ type: FILTER_ACTION_TYPES.EXPAND_TREE, value: expandedKeys})
	}


	const renderTreeNodes = options =>{
		return options.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title.name} key={`${item.key}-${item.title.level}`} dataRef={item}>
						{renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode title={item.title.name} key={`${item.key}-${item.title.level}`} />;
		});}

	return (
		<>
			{metaData && (
				<>
					<CustomDiv py="12px">
						<Card>
							<Tree onExpand={onExpand} checkable>{renderTreeNodes(categoryMap)}</Tree>
						</Card>
					</CustomDiv>
					<Card>
						<Title level={4} type="secondary">
							Filter Products
						</Title>
						<ModifiedDivider />
						<Filter
							name={{ categoryName: "Retailer", dispatchName: FILTER_ACTION_TYPES.RETAILER }}
							options={metaData.retailers.list.map(elem => {
								return { label: elem.name, value: elem._id };
							})}
							dispatch={dispatch}
						/>
					</Card>
				</>
			)}
		</>
	);
};

export default AssetSidePanel;
