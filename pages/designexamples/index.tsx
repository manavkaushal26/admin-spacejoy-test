import { ArrowLeftOutlined } from "@ant-design/icons";
import { DesignPhases, HumanizeDesignPhases, RoomLabels, RoomTypes } from "@customTypes/dashboardTypes";
import { AssetStatus } from "@customTypes/userType";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import CreateDesignModal from "@sections/DesignExamples/CreateNewDesign";
import DesignListDisplay from "@sections/DesignExamples/DesignListDisplay";
import {
	DesignListAction,
	DesignListDisplayInitialState,
	DesignListDisplayReducer,
} from "@sections/DesignExamples/DesignListDisplay/reducer";
import PageLayout from "@sections/Layout";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { debounce } from "@utils/commonUtils";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Collapse, Input, Row, Select, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import React, { useReducer, useState } from "react";
import styled from "styled-components";
const { Title } = Typography;

const MaxWidthDesignPage = styled.div`
	width: 100%;
	max-width: calc(1200px + 1rem);
	margin: auto;
`;

const Padding = styled.div`
	padding: 1rem;
`;

const DesignExamples: NextPage = () => {
	const [createDesignModalVisible, setCreateDesignModalVisible] = useState<boolean>();

	const [state, dispatch] = useReducer(DesignListDisplayReducer, DesignListDisplayInitialState);

	const toggleModal = (): void => {
		setCreateDesignModalVisible(!createDesignModalVisible);
	};

	const onCreate = (designData): void => {
		dispatch({
			type: DesignListAction.UPDATE_DESIGN_STATE,
			value: { designs: [designData, ...state.designs] },
		});
	};

	const handleSearchInput = (value: string): void => {
		dispatch({
			type: DesignListAction.SEARCH_TEXT,
			value: {
				searchText: value,
			},
		});
		dispatch({
			type: DesignListAction.CLEAR,
			value: {},
		});
	};

	const handleSelect = (value, action): void => {
		if (action === DesignListAction.ROOM_TYPE_FILTER) {
			dispatch({
				type: action,
				value: {
					roomTypeFilter: value,
				},
			});
		}
		if (action === DesignListAction.STATUS_FILTER) {
			dispatch({
				type: action,
				value: {
					statusFilter: value,
				},
			});
		}
		if (action === DesignListAction.PHASE_FILTER) {
			dispatch({
				type: action,
				value: {
					phaseFilter: value,
				},
			});
		}
		dispatch({
			type: DesignListAction.CLEAR,
			value: {},
		});
	};

	const debouncedHandleSearch = debounce(handleSearchInput, 500);

	return (
		<PageLayout pageName='Design Examples'>
			<Head>
				<title>Design Examples | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
				<MaxWidthDesignPage>
					<Padding>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<Row style={{ padding: "2rem 0rem" }} justify='space-between'>
									<Col>
										<Title level={3}>
											<Row gutter={[8, 8]}>
												<Col>
													<ArrowLeftOutlined onClick={() => redirectToLocation({ pathname: "/launchpad" })} />
												</Col>
												<Col>Design Examples</Col>
											</Row>
										</Title>
									</Col>
									{/* <Col>
										<SeoKeywords />
									</Col> */}
									<Col>
										<Button type='primary' onClick={toggleModal}>
											Create new Design
										</Button>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Collapse>
									<Collapse.Panel header='Filters' key={1}>
										<Row gutter={[8, 8]}>
											<Col sm={24} md={8}>
												<Row>
													<Col>Search by Name</Col>
													<Col span={24}>
														<Input.Search
															onChange={(e): void => debouncedHandleSearch(e.target.value)}
															onSearch={handleSearchInput}
														/>
													</Col>
												</Row>
											</Col>
											<Col sm={12} md={8}>
												<Row>
													<Col>Filter by Room Type</Col>
													<Col span={24}>
														<Select
															mode='multiple'
															maxTagCount={2}
															value={state.roomTypeFilter}
															onChange={(value): void => handleSelect(value, DesignListAction.ROOM_TYPE_FILTER)}
															style={{ width: "100%" }}
														>
															{Object.keys(RoomTypes).map(key => {
																return (
																	<Select.Option key={key} value={RoomTypes[key]}>
																		{RoomLabels[key]}
																	</Select.Option>
																);
															})}
														</Select>
													</Col>
												</Row>
											</Col>
											<Col sm={12} md={8}>
												<Row>
													<Col>Filter by Status</Col>
													<Col span={24}>
														<Select
															onChange={(value): void => handleSelect(value, DesignListAction.STATUS_FILTER)}
															style={{ width: "100%" }}
														>
															{Object.keys(AssetStatus).map(key => {
																return (
																	<Select.Option key={key} value={AssetStatus[key]}>
																		{key}
																	</Select.Option>
																);
															})}
														</Select>
													</Col>
												</Row>
											</Col>
											<Col sm={24} md={12}>
												<Row>
													<Col>Filter by Phase</Col>
													<Col span={24}>
														<Select
															mode='multiple'
															value={state.phaseFilter}
															maxTagCount={5}
															onChange={(value): void => handleSelect(value, DesignListAction.PHASE_FILTER)}
															style={{ width: "100%" }}
														>
															{Object.keys(DesignPhases).map(key => {
																return (
																	<Select.Option key={key} value={key}>
																		{HumanizeDesignPhases[key]}
																	</Select.Option>
																);
															})}
														</Select>
													</Col>
												</Row>
											</Col>
										</Row>
									</Collapse.Panel>
								</Collapse>
							</Col>
							<Col span={24}>
								<DesignListDisplay state={state} dispatch={dispatch} />
							</Col>
						</Row>
					</Padding>
				</MaxWidthDesignPage>
			</MaxHeightDiv>
			<CreateDesignModal
				createDesignModalVisible={createDesignModalVisible}
				toggleModal={toggleModal}
				onCreate={onCreate}
				designScope='portfolio'
			/>
		</PageLayout>
	);
};

export default ProtectRoute(DesignExamples);
