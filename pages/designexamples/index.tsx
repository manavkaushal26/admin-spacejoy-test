import User, { Status, AssetStatus } from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React, { useState, useReducer } from "react";
import { Row, Col, Button, Typography, Input, Select, Affix, Collapse } from "antd";
import styled from "styled-components";
import DesignListDisplay from "@sections/DesignExamples/DesignListDisplay";
import CreateDesignModal from "@sections/DesignExamples/CreateNewDesign";
import {
	DesignListDisplayReducer,
	DesignListDisplayInitialState,
	DesignListAction,
} from "@sections/DesignExamples/DesignListDisplay/reducer";
import { debounce } from "@utils/commonUtils";
import { RoomTypes, RoomLabels } from "@customTypes/dashboardTypes";

interface DesignExamplesProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const { Title } = Typography;

const MaxWidthDesignPage = styled.div`
	max-width: calc(1200px + 1rem);
	margin: auto;
`;

const Padding = styled.div`
	padding: 1rem;
`;

const DesignExamples: NextPage<DesignExamplesProps> = ({ isServer, authVerification }) => {
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
	};

	const debouncedHandleSearch = debounce(handleSearchInput, 500);

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Design Examples | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxWidthDesignPage>
				<Padding>
					<Row gutter={[16, 16]}>
						<Col>
							<Row style={{ padding: "2rem 0rem" }} type="flex" justify="space-between">
								<Col>
									<Title level={3}>Design Examples</Title>
								</Col>
								<Col>
									<Button type="primary" onClick={toggleModal}>
										Create new Design
									</Button>
								</Col>
							</Row>
						</Col>
						<Col>
							<Affix offsetTop={64}>
								<Collapse>
									<Collapse.Panel header="Filters" key={1}>
										<Row gutter={[8, 8]}>
											<Col sm={24} md={12}>
												<Row>
													<Col>Search by Name</Col>
													<Col>
														<Input.Search
															onChange={(e): void => debouncedHandleSearch(e.target.value)}
															onSearch={handleSearchInput}
														/>
													</Col>
												</Row>
											</Col>
											<Col sm={12} md={6}>
												<Row>
													<Col>Search by Room Type</Col>
													<Col>
														<Select
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
											<Col sm={12} md={6}>
												<Row>
													<Col>Search by Status</Col>
													<Col>
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
										</Row>
									</Collapse.Panel>
								</Collapse>
							</Affix>
						</Col>
						<Col>
							<DesignListDisplay state={state} dispatch={dispatch} />
						</Col>
					</Row>
				</Padding>
			</MaxWidthDesignPage>
			<CreateDesignModal
				createDesignModalVisible={createDesignModalVisible}
				toggleModal={toggleModal}
				onCreate={onCreate}
				designScope="portfolio"
			/>
		</PageLayout>
	);
};

DesignExamples.getInitialProps = async (ctx: NextPageContext): Promise<DesignExamplesProps> => {
	const { req } = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification };
};

export default withAuthVerification(DesignExamples);
