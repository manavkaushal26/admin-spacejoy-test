import { MetaDataType } from "@customTypes/moodboardTypes";
import Filter from "@sections/AssetStore/assetSidepanel/filters/CategoryFilter";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Input, Tree, Typography } from "antd";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { AssetStatus } from "@customTypes/userType";
import { FilterCard, ModifiedDivider } from "../styled";
import SliderFilter from "./filters/SliderFilter";

const { TreeNode } = Tree;

const { Title, Text } = Typography;

interface CategoryMap {
	key: string;
	title: {
		name: string;
		level: string;
	};
	children?: Array<CategoryMap>;
}

interface AssetSidePanelProps {
	metaData: MetaDataType;
	dispatch: React.Dispatch<AssetAction>;
	state: AssetStoreState;
	categoryMap: Array<CategoryMap>;
}

const addLevel = (level: string, elem): string => {
	return `${elem}-${level}`;
};

const AssetSidePanel: React.FC<AssetSidePanelProps> = ({ metaData, dispatch, state, categoryMap }): JSX.Element => {
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
	const [width, setWidthRange] = useState<[number, number]>([0, 30]);
	const [height, setHeightRange] = useState<[number, number]>([0, 30]);
	const [depth, setDepthRange] = useState<[number, number]>([0, 30]);

	const mergedArray: string[] = useMemo(
		() => [
			...state.checkedKeys.category.map<string>(addLevel.bind(null, "category")),
			...state.checkedKeys.subCategory.map<string>(addLevel.bind(null, "subCategory")),
			...state.checkedKeys.verticals.map<string>(addLevel.bind(null, "verticals")),
		],
		[state.checkedKeys]
	);

	const onCheck = (checkedKeys: string[]): void => {
		dispatch({ type: ASSET_ACTION_TYPES.CHECKED_ITEMS, value: checkedKeys });
	};

	const onSearchInput = (e): void => {
		const {
			target: { value },
		} = e;
		dispatch({ type: ASSET_ACTION_TYPES.SEARCH_TEXT, value });
	};

	const afterPriceChange = (): void => {
		const [min, max] = priceRange;
		if (min <= max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.PRICE_RANGE, value: priceRange });
	};

	useEffect(() => {
		afterPriceChange();
	}, priceRange);

	const onPriceRangeChange = (range): void => {
		setPriceRange(range);
	};

	const onPriceSliderValueEntry = (e, type): void => {
		const {
			target: { value },
		} = e;
		const [min, max] = priceRange;
		let correctedValue = parseInt(value, 10);
		if (Number.isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setPriceRange([correctedValue, max]);
		}
		if (type === "max") {
			setPriceRange([min, correctedValue]);
		}
	};

	const afterHeightChange = (): void => {
		const [min, max] = height;
		if (min <= max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.HEIGHT_RANGE, value: height });
	};

	useEffect(() => {
		afterHeightChange();
	}, height);

	const onHeightRangeChange = (range): void => {
		setHeightRange(range);
	};

	const onHeightSliderValueEntry = (e, type): void => {
		const {
			target: { value },
		} = e;
		const [min, max] = priceRange;
		let correctedValue = parseInt(value, 10);
		if (Number.isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setHeightRange([correctedValue, max]);
		}
		if (type === "max") {
			setHeightRange([min, correctedValue]);
		}
	};

	const afterWidthChange = (): void => {
		const [min, max] = width;
		if (min <= max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.WIDTH_RANGE, value: width });
	};

	useEffect(() => {
		afterWidthChange();
	}, width);

	const onWidthRangeChange = (range): void => {
		setWidthRange(range);
	};

	const onWidthSliderValueEntry = (e, type): void => {
		const {
			target: { value },
		} = e;
		const [min, max] = width;
		let correctedValue = parseInt(value, 10);
		if (Number.isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setWidthRange([correctedValue, max]);
		}
		if (type === "max") {
			setWidthRange([min, correctedValue]);
		}
	};

	const afterDepthChange = (): void => {
		const [min, max] = depth;
		if (min <= max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.DEPTH_RANGE, value: depth });
	};

	useEffect(() => {
		afterDepthChange();
	}, depth);

	const onDepthRangeChange = (range): void => {
		setDepthRange(range);
	};

	const onDepthSliderValueEntry = (e, type): void => {
		const {
			target: { value },
		} = e;
		const [min, max] = depth;
		let correctedValue = parseInt(value, 10);
		if (Number.isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setDepthRange([correctedValue, max]);
		}
		if (type === "max") {
			setDepthRange([min, correctedValue]);
		}
	};

	const renderTreeNodes = (options: Array<CategoryMap>): ReactNode => {
		return options.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title.name} key={`${item.title.name}-${item.title.level}`} dataRef={item}>
						{renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode title={item.title.name} key={`${item.title.name}-${item.title.level}`} />;
		});
	};

	const [priceMin, priceMax] = priceRange;
	const [widthMin, widthMax] = width;
	const [heightMin, heightMax] = height;
	const [depthMin, depthMax] = depth;
	return (
		<>
			{metaData && (
				<>
					<CustomDiv py="0.5rem">
						<FilterCard>
							<Text strong>Search by Name</Text>
							<Input allowClear value={state.searchText} onChange={onSearchInput} />
							<Text strong>Category</Text>
							<Tree onCheck={onCheck} checkedKeys={mergedArray} checkable>
								{renderTreeNodes(categoryMap)}
							</Tree>
						</FilterCard>
					</CustomDiv>
					<FilterCard>
						<Title level={4} type="secondary">
							Filter Products
						</Title>
						<ModifiedDivider />
						<Filter
							value={state.retailerFilter}
							name={{ categoryName: "Retailer", dispatchName: ASSET_ACTION_TYPES.RETAILER }}
							options={metaData.retailers.list
								.sort((a, b) => {
									if (a.name.toLowerCase() > b.name.toLowerCase()) {
										return 1;
									}
									if (b.name.toLowerCase() > a.name.toLowerCase()) {
										return -1;
									}
									return 0;
								})
								.map(elem => {
									return { label: elem.name, value: elem.name };
								})}
							dispatch={dispatch}
						/>
						<Filter
							name={{ categoryName: "Status", dispatchName: ASSET_ACTION_TYPES.STATUS }}
							options={Object.keys(AssetStatus).map(key => {
								return { label: key, value: AssetStatus[key] };
							})}
							value={state.status}
							dispatch={dispatch}
						/>
						<Title type="secondary" level={4}>
							Range Filters
						</Title>
						<ModifiedDivider />
						<Text strong>Price</Text>
						<CustomDiv width="100%" type="flex" align="center">
							<SliderFilter
								min={priceMin}
								max={priceMax}
								range={[0, 20000]}
								value={priceRange}
								onValueEntry={onPriceSliderValueEntry}
								onChange={onPriceRangeChange}
								onAfterChange={afterPriceChange}
							/>
						</CustomDiv>
						<Text strong>Width</Text>
						<CustomDiv width="100%" type="flex" align="center">
							<SliderFilter
								min={widthMin}
								max={widthMax}
								range={[0, 30]}
								value={width}
								onValueEntry={onWidthSliderValueEntry}
								onChange={onWidthRangeChange}
								onAfterChange={afterWidthChange}
							/>
						</CustomDiv>
						<Text strong>Height</Text>
						<CustomDiv width="100%" type="flex" align="center">
							<SliderFilter
								min={heightMin}
								max={heightMax}
								range={[0, 30]}
								value={height}
								onValueEntry={onHeightSliderValueEntry}
								onChange={onHeightRangeChange}
								onAfterChange={afterHeightChange}
							/>
						</CustomDiv>
						<Text strong>Depth</Text>
						<CustomDiv width="100%" type="flex" align="center">
							<SliderFilter
								min={depthMin}
								max={depthMax}
								range={[0, 30]}
								value={depth}
								onValueEntry={onDepthSliderValueEntry}
								onChange={onDepthRangeChange}
								onAfterChange={afterDepthChange}
							/>
						</CustomDiv>
					</FilterCard>
				</>
			)}
		</>
	);
};

export default AssetSidePanel;
