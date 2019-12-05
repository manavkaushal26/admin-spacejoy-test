import { MetaDataType } from "@customTypes/moodboardTypes";
import Filter from "@sections/AssetStore/assetSidepanel/filters/categoryFilter";
import { AssetAction, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Card, Tree, Typography } from "antd";
import React, { useMemo } from "react";
import { ModifiedDivider } from "../styled";

const { TreeNode } = Tree;

const { Title } = Typography;

interface AssetSidePanelProps {
	metaData: MetaDataType;
	dispatch: React.Dispatch<AssetAction>;
}

const AssetSidePanel: React.FC<AssetSidePanelProps> = ({ metaData, dispatch }): JSX.Element => {

	const categoryMap = useMemo(() => {
		if (metaData) {
			return metaData.categories.list.map(elem => {
				return {
					title: { name: elem.name, level: "category" },
					key: elem._id,
					children: metaData.subcategories.list
						.filter(subElem => {
							return subElem.category === elem._id;
						})
						.map(subElem => {
							return {
								title: { name: subElem.name, level: "subCategory" },
								key: subElem._id,
								children: metaData.verticals.list
									.filter(vert => {
										return vert.subcategory === subElem._id;
									})
									.map(filtVert => {
										return {
											title: { name: filtVert.name, level: "verticals" },
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

	const onCheck = checkedKeys => {
		dispatch({ type: ASSET_ACTION_TYPES.CHECKED_ITEMS, value: checkedKeys });
	};

	const renderTreeNodes = options => {
		return options.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title.name} key={`${item.key}-${item.title.level}`} dataRef={item}>
						{renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode title={item.title.name} key={`${item.key}-${item.title.level}`} />;
		});
	};

	return (
		<>
			{metaData && (
				<>
					<CustomDiv py="0.5em">
						<Card>
							<Tree onCheck={onCheck} checkable>
								{renderTreeNodes(categoryMap)}
							</Tree>
						</Card>
					</CustomDiv>
					<Card>
						<Title level={4} type="secondary">
							Filter Products
						</Title>
						<ModifiedDivider />
						<Filter
							name={{ categoryName: "Retailer", dispatchName: ASSET_ACTION_TYPES.RETAILER }}
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
