import { RoomLabels, RoomTypes, DesignPhases, HumanizeDesignPhases } from "@customTypes/dashboardTypes";
import User, { AssetStatus } from "@customTypes/userType";
import CreateDesignModal from "@sections/DesignExamples/CreateNewDesign";
import DesignListDisplay from "@sections/DesignExamples/DesignListDisplay";
import {
	DesignListAction,
	DesignListDisplayInitialState,
	DesignListDisplayReducer,
} from "@sections/DesignExamples/DesignListDisplay/reducer";
import PageLayout from "@sections/Layout";
import { withAuthVerification } from "@utils/auth";
import { debounce } from "@utils/commonUtils";
import { company } from "@utils/config";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Collapse, Input, Row, Select, Typography } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import React, { useReducer, useState, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

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

	const Router = useRouter();

	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

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
												<Col>Filter by Room Type</Col>
												<Col>
													<Select
														mode="multiple"
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
										<Col sm={12} md={6}>
											<Row>
												<Col>Filter by Status</Col>
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
										<Col sm={24} md={12}>
											<Row>
												<Col>Filter by Phase</Col>
												<Col>
													<Select
														mode="multiple"
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
