import { MetaDataType } from "@customTypes/moodboardTypes";
import Filter from "@sections/AssetStore/assetSidepanel/filters/CategoryFilter";
import { AssetAction, ASSET_ACTION_TYPES, AssetStoreState } from "@sections/AssetStore/reducer";
import { CustomDiv } from "@sections/Dashboard/styled";
import { Card, Tree, Typography, Input } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import { ModifiedDivider, StyledInput, MarginCorrectedSlider, FilterCard } from "../styled";
import SliderFilter from "./filters/SliderFilter";

const { TreeNode } = Tree;

const { Title, Text } = Typography;

interface AssetSidePanelProps {
	metaData: MetaDataType;
	dispatch: React.Dispatch<AssetAction>;
}

const AssetSidePanel: React.FC<AssetSidePanelProps> = ({ metaData, dispatch }): JSX.Element => {
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
	const [width, setWidthRange] = useState<[number, number]>([0, 30]);
	const [height, setHeightRange] = useState<[number, number]>([0, 30]);
	const [depth, setDepthRange] = useState<[number, number]>([0, 30]);

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

	const onSearchInput = e => {
		const {
			target: { value }
		} = e;
		dispatch({ type: ASSET_ACTION_TYPES.SEARCH_TEXT, value: value });
	};

	const afterPriceChange = () => {
		const [min, max] = priceRange;
		if (min < max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.PRICE_RANGE, value: priceRange });
	};

	useEffect(() => {
		afterPriceChange();
	}, priceRange);

	const onPriceRangeChange = range => {
		setPriceRange(range);
	};

	const onPriceSliderValueEntry = (e, type) => {
		const {
			target: { value }
		} = e;
		const [min, max] = priceRange;
		let correctedValue = parseInt(value);
		if (isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setPriceRange([correctedValue, max]);
		}
		if (type === "max") {
			setPriceRange([min, correctedValue]);
		}
	};

	const afterHeightChange = () => {
		const [min, max] = height;
		if (min < max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.HEIGHT_RANGE, value: height });
	};

	useEffect(() => {
		afterHeightChange();
	}, height);

	const onHeightRangeChange = range => {
		setHeightRange(range);
	};

	const onHeightSliderValueEntry = (e, type) => {
		const {
			target: { value }
		} = e;
		const [min, max] = priceRange;
		let correctedValue = parseInt(value);
		if (isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setHeightRange([correctedValue, max]);
		}
		if (type === "max") {
			setHeightRange([min, correctedValue]);
		}
	};

	const afterWidthChange = () => {
		const [min, max] = width;
		if (min < max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.WIDTH_RANGE, value: width });
	};

	useEffect(() => {
		afterWidthChange();
	}, width);

	const onWidthRangeChange = range => {
		setWidthRange(range);
	};

	const onWidthSliderValueEntry = async (e, type) => {
		const {
			target: { value }
		} = e;
		const [min, max] = width;
		let correctedValue = parseInt(value);
		if (isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setWidthRange([correctedValue, max]);
		}
		if (type === "max") {
			setWidthRange([min, correctedValue]);
		}
	};

	const afterDepthChange = () => {
		const [min, max] = depth;
		if (min < max && max !== 0) dispatch({ type: ASSET_ACTION_TYPES.DEPTH_RANGE, value: depth });
	};

	useEffect(() => {
		afterDepthChange();
	}, depth);

	const onDepthRangeChange = range => {
		setDepthRange(range);
	};

	const onDepthSliderValueEntry = (e, type) => {
		const {
			target: { value }
		} = e;
		const [min, max] = depth;
		let correctedValue = parseInt(value);
		if (isNaN(correctedValue) || correctedValue < 0) {
			correctedValue = 0;
		}
		if (type === "min") {
			setDepthRange([correctedValue, max]);
		}
		if (type === "max") {
			setDepthRange([min, correctedValue]);
		}
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

	const [priceMin, priceMax] = priceRange;
	const [widthMin, widthMax] = width;
	const [heightMin, heightMax] = height;
	const [depthMin, depthMax] = depth;

	return (
		<>
			{metaData && (
				<>
					<CustomDiv py="0.5em">
						<FilterCard>
							<Text strong>Search by Name</Text>
							<Input allowClear onChange={onSearchInput} />
							<Text strong>Category</Text>
							<Tree onCheck={onCheck} checkable>
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
							name={{ categoryName: "Retailer", dispatchName: ASSET_ACTION_TYPES.RETAILER }}
							options={metaData.retailers.list.map(elem => {
								return { label: elem.name, value: elem._id };
							})}
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
