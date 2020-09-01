import { InfoCircleOutlined } from "@ant-design/icons";
import { MetaDataType } from "@customTypes/moodboardTypes";
import { AssetStatus } from "@customTypes/userType";
import Filter from "@sections/AssetStore/assetSidepanel/filters/CategoryFilter";
import {
	colorsExamples,
	combinationExamples,
	nameExamples,
	retailerExamples,
	shapeExamples
} from "@sections/AssetStore/exampleConstants";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { Avatar, Col, Input, List, Popover, Radio, Row, Tabs, Tree, Typography } from "antd";
import { DataNode } from "antd/lib/tree";
import React, { useEffect, useMemo, useState } from "react";
import { FilterCard } from "../styled";
import SliderFilter from "./filters/SliderFilter";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
const SearchExamples = () => {
	return (
		<Tabs defaultActiveKey='1'>
			<TabPane tab='By Name' key='1'>
				<List
					grid={{ gutter: 8, column: 3 }}
					itemLayout='horizontal'
					dataSource={nameExamples}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta title={item.title} />
						</List.Item>
					)}
				/>
			</TabPane>
			<TabPane tab='By Color' key='2'>
				<List
					grid={{ gutter: 8, column: 3 }}
					itemLayout='horizontal'
					dataSource={colorsExamples}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar style={{ backgroundColor: item.color }} />}
								title={<Text copyable>{item.title}</Text>}
							/>
						</List.Item>
					)}
				/>
			</TabPane>
			<TabPane tab='By Retailer' key='3'>
				<List
					grid={{ gutter: 8, column: 3 }}
					itemLayout='horizontal'
					dataSource={retailerExamples}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta title={item.title} />
						</List.Item>
					)}
				/>
			</TabPane>
			<TabPane tab='By Shape' key='4'>
				<List
					grid={{ gutter: 8, column: 3 }}
					itemLayout='horizontal'
					dataSource={shapeExamples}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta title={item.title} />
						</List.Item>
					)}
				/>
			</TabPane>
			<TabPane tab='Or Combinations' key='5'>
				<List
					grid={{ gutter: 8, column: 3 }}
					itemLayout='horizontal'
					dataSource={combinationExamples}
					renderItem={item => (
						<List.Item>
							<List.Item.Meta title={item.title} />
						</List.Item>
					)}
				/>
			</TabPane>
		</Tabs>
	);
};

const AssetSidePanel: React.FC<AssetSidePanelProps> = ({ metaData, dispatch, state, categoryMap }): JSX.Element => {
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
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

	const onStatusChange = (e): void => {
		const {
			target: { value },
		} = e;
		dispatch({ type: ASSET_ACTION_TYPES.STATUS, value });
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

	const renderTreeNodes = (options: Array<CategoryMap>): DataNode[] => {
		return options.map(item => {
			if (item.children) {
				return {
					key: `${item.title.name}-${item.title.level}`,
					title: item.title.name,
					children: renderTreeNodes(item.children),
				};
			}
			return { key: `${item.title.name}-${item.title.level}`, title: item.title.name };
		});
	};

	const [priceMin, priceMax] = priceRange;
	const [widthMin, widthMax] = width;
	const [heightMin, heightMax] = height;
	const [depthMin, depthMax] = depth;
	return (
		<>
			{metaData && (
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<FilterCard>
							<Row gutter={[4, 4]}>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Search</Text>
										</Col>
										<Col span={24}>
											<Row gutter={[4, 4]} align='middle'>
												<Col style={{ flexGrow: 1 }}>
													<Input
														allowClear
														value={state.searchText}
														onChange={onSearchInput}
														placeholder='Search by Name, Retailer, Color, Shape etc.,'
													/>
												</Col>
												<Col>
													<Popover content={SearchExamples} title='Examples'>
														<InfoCircleOutlined />
													</Popover>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Category</Text>
										</Col>
										<Col span={24}>
											<Tree
												checkStrictly
												onCheck={onCheck}
												checkedKeys={mergedArray}
												checkable
												treeData={renderTreeNodes(categoryMap)}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</FilterCard>
					</Col>
					<Col span={24}>
						<FilterCard>
							<Row gutter={[4, 4]}>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Title level={4} type='secondary'>
												Filter Products
											</Title>
										</Col>
										<Col span={24}>
											<SilentDivider />
										</Col>
										<Col span={24}>
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
										</Col>
										<Col span={24}>
											<Row gutter={[2, 2]}>
												<Col span={24}>
													<Text strong>Status</Text>
												</Col>
												<Col span={24}>
													<Radio.Group name='status' onChange={onStatusChange} value={state.status}>
														{Object.entries(AssetStatus).map(([name, value]) => {
															return (
																<Radio
																	key={value}
																	style={{
																		display: "block",
																		height: "30px",
																		lineHeight: "30px",
																	}}
																	value={value}
																>
																	{name}
																</Radio>
															);
														})}
														<Radio value=''>All</Radio>
													</Radio.Group>
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</FilterCard>
					</Col>
					<Col span={24}>
						<FilterCard>
							<Row gutter={[8, 8]}>
								<Col span={24}>
									<Title type='secondary' level={4}>
										Range Filters
									</Title>
								</Col>
								<Col span={24}>
									<SilentDivider />
								</Col>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Price</Text>
										</Col>
										<Col span={24}>
											<Row gutter={[2, 2]}>
												<SliderFilter
													min={priceMin}
													max={priceMax}
													range={[0, 20000]}
													value={priceRange}
													onValueEntry={onPriceSliderValueEntry}
													onChange={onPriceRangeChange}
													onAfterChange={afterPriceChange}
												/>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Width</Text>
										</Col>
										<Col span={24}>
											<Row align='middle'>
												<SliderFilter
													min={widthMin}
													max={widthMax}
													range={[0, 30]}
													value={width}
													onValueEntry={onWidthSliderValueEntry}
													onChange={onWidthRangeChange}
													onAfterChange={afterWidthChange}
												/>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Height</Text>
										</Col>
										<Col span={24}>
											<Row gutter={[2, 2]}>
												<SliderFilter
													min={heightMin}
													max={heightMax}
													range={[0, 30]}
													value={height}
													onValueEntry={onHeightSliderValueEntry}
													onChange={onHeightRangeChange}
													onAfterChange={afterHeightChange}
												/>
											</Row>
										</Col>
									</Row>
								</Col>
								<Col span={24}>
									<Row gutter={[2, 2]}>
										<Col span={24}>
											<Text strong>Depth</Text>
										</Col>
										<Col span={24}>
											<Row align='middle'>
												<SliderFilter
													min={depthMin}
													max={depthMax}
													range={[0, 30]}
													value={depth}
													onValueEntry={onDepthSliderValueEntry}
													onChange={onDepthRangeChange}
													onAfterChange={afterDepthChange}
												/>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</FilterCard>
					</Col>
				</Row>
			)}
		</>
	);
};

export default AssetSidePanel;
