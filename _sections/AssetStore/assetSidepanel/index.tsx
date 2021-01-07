import { InfoCircleOutlined } from "@ant-design/icons";
import { MetaDataType } from "@customTypes/moodboardTypes";
import { AssetStatus } from "@customTypes/userType";
import Filter from "@sections/AssetStore/assetSidepanel/filters/CategoryFilter";
import {
	colorsExamples,
	combinationExamples,
	nameExamples,
	retailerExamples,
	shapeExamples,
} from "@sections/AssetStore/exampleConstants";
import { AssetAction, AssetStoreState, ASSET_ACTION_TYPES } from "@sections/AssetStore/reducer";
import { SilentDivider } from "@sections/Dashboard/styled";
import { Avatar, Button, Col, Input, List, Popover, Radio, Row, Switch, Tabs, Tree, Typography } from "antd";
import { DataNode } from "antd/lib/tree";
import React, { useEffect, useMemo, useState } from "react";
import { FilterCard } from "../styled";
import SliderFilter from "./filters/SliderFilter";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

type ValueName = "priceRange" | "heightRange" | "depthRange" | "widthRange";

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
								avatar={<Avatar shape='square' style={{ backgroundColor: item.color }} />}
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
	const [filterState, setFilterState] = useState<Record<ValueName, [number, number]>>({
		priceRange: state.priceRange,
		widthRange: state.widthRange,
		depthRange: state.depthRange,
		heightRange: state.heightRange,
	});

	const { priceRange, widthRange, depthRange, heightRange } = filterState;

	useEffect(() => {
		dispatch({ type: ASSET_ACTION_TYPES.UPDATE_RANGE_FILTERS, value: filterState });
	}, [filterState]);

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

	const onRangeValueChange = (value: number, type: "min" | "max", name: ValueName): void => {
		const [min, max] = filterState[name];

		if (type === "min") {
			setFilterState({ ...filterState, [name]: [value, max] });
		}
		if (type === "max") {
			setFilterState({ ...filterState, [name]: [min, value] });
		}
	};

	const onStatusChange = (e): void => {
		const {
			target: { value },
		} = e;
		dispatch({ type: ASSET_ACTION_TYPES.STATUS, value });
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

	const onChange = value => {
		dispatch({ type: ASSET_ACTION_TYPES.WILD_CARD, value });
	};

	const resetFilters = () => {
		dispatch({ type: ASSET_ACTION_TYPES.RESET_FILTERS, value: "" });
		setFilterState({
			priceRange: [0, 50000],
			widthRange: [0, 360],
			depthRange: [0, 360],
			heightRange: [0, 360],
		});
	};

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
											<Row justify='space-between' align='bottom' gutter={[8, 8]}>
												<Col>
													<Row gutter={[4, 4]}>
														<Col>
															<Text strong>Search</Text>
														</Col>
														<Col>
															<Switch
																onChange={onChange}
																checkedChildren='Similar'
																unCheckedChildren='Exact'
																checked={state.wildcard}
															/>
														</Col>
													</Row>
												</Col>
												<Col>
													<Button type='link' onClick={resetFilters}>
														Reset
													</Button>
												</Col>
											</Row>
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
												extra={{
													name: ASSET_ACTION_TYPES.PREFERRED_RETAILER,
													value: state.preferredRetailer,
													type: "switch",
												}}
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
													name='priceRange'
													range={[0, 20000]}
													value={priceRange}
													onChange={onRangeValueChange}
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
													name='widthRange'
													range={[0, 360]}
													value={widthRange}
													onChange={onRangeValueChange}
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
													name='heightRange'
													range={[0, 360]}
													value={heightRange}
													onChange={onRangeValueChange}
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
													name='depthRange'
													range={[0, 360]}
													value={depthRange}
													onChange={onRangeValueChange}
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
