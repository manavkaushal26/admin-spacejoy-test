import { PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import { getMetaDataApi, getMoodboardApi } from "@api/designApi";
import { AssetType, MoodboardAsset } from "@customTypes/moodboardTypes";
import User from "@customTypes/userType";
import AssetCartModal from "@sections/AssetStore/assetCart";
import AssetMainPanel from "@sections/AssetStore/assetMainpanel";
import Sidebar from "@sections/AssetStore/assetSidepanel";
import NewAssetModal from "@sections/AssetStore/newAssetModal";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import { PaddedDiv } from "@sections/Header/styled";
import PageLayout from "@sections/Layout";
import { withAuthVerification, redirectToLocation } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, message, Row, Spin } from "antd";
import { NextPage, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import styled from "styled-components";
import { assetStoreInitialState, ASSET_ACTION_TYPES, reducer } from "@sections/AssetStore/reducer";

interface AssetStoreProps {
	isServer: boolean;
	authVerification: Partial<User>;
	designId: string;
	assetEntryId: string;
	projectId: string;
}

interface CategoryMap {
	key: string;
	title: {
		name: string;
		level: string;
	};
	children?: Array<CategoryMap>;
}

const ParentContainer = styled.div`
	display: flex;
	flex-wrap: wrap;

	> * {
		flex-grow: 1;
		flex-shrink: 1;
	}
`;
const SidebarContainer = styled.div`
	flex-basis: 35ch;
	flex-grow: 1;
	@media only screen and (max-width: 768px) {
		flex-basis: 30ch;
	}
`;
const MainContentContainer = styled.div`
	flex-basis: 0;
	flex-grow: 999;
	min-width: 50%;
`;

const FAB = styled.button`
	position: absolute;
	bottom: 1.5rem;
	right: 1.5rem;
	width: 56px;
	height: 56px;
	font-size: 2.2rem;
	border-radius: 28px;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
	border-width: 0px;
	background-color: #f44336;
	cursor: pointer;
	> i {
		display: flex;
		justify-content: center;
		color: white;
	}
`;

const AssetStore: NextPage<AssetStoreProps> = ({
	isServer,
	authVerification,
	projectId,
	designId,
	assetEntryId,
}): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, assetStoreInitialState);
	const Router = useRouter();
	const [editAssetData, setEditAssetData] = useState<AssetType>(null);
	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });

		if (response.statusCode === 200) {
			dispatch({ type: ASSET_ACTION_TYPES.METADATA, value: response.data });
		}
	};

	useEffect(() => {
		if (!authVerification.name) {
			Router.push("/auth", "/auth/login");
		}
	}, [authVerification]);

	const fetchMoodBoard = async (): Promise<void> => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
		const endPoint = getMoodboardApi(designId);
		const responseData = await fetcher({ endPoint, method: "GET" });
		if (responseData.statusCode <= 300) {
			dispatch({ type: ASSET_ACTION_TYPES.MOODBOARD, value: responseData.data.moodboard });
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	useEffect(() => {
		if (projectId) {
			if (assetEntryId) {
				message.warn("In Recommendation Selection Mode");
			} else message.warn("Primary Asset Selection mode");
		}
	}, [assetEntryId]);

	useEffect(() => {
		fetchMetaData();
		if (!!projectId && !!designId) fetchMoodBoard();
	}, []);

	const addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, aeid?: string) => void = async (
		action,
		assetId,
		aeid = ""
	) => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });

		const endpoint = getMoodboardApi(designId, aeid);
		let response: { status: string; data: { moodboard: MoodboardAsset[] } } = null;
		if (action === "ADD") {
			response = await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assets: [assetId],
						assetUrls: [],
					},
				},
			});
		} else if (action === "DELETE") {
			response = await fetcher({
				endPoint: endpoint,
				method: "DELETE",
				body: {
					data: {
						assets: [assetId],
						assetUrls: [],
					},
				},
			});
		}
		if (response.data.moodboard) {
			dispatch({ type: ASSET_ACTION_TYPES.MOODBOARD, value: response.data.moodboard });
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	const goToButtonClick = (): void => {
		if (assetEntryId) {
			Router.push(
				{ pathname: "/assetstore", query: { designId, projectId } },
				`/dashboard/pid/${projectId}/did/${designId}`
			);
			return;
		}
		if (!!projectId && !!designId) {
			Router.push(
				{ pathname: "/dashboard", query: { designId, pid: projectId } },
				`/dashboard/pid/${projectId}/did/${designId}`
			);
			return;
		}
		Router.back();
	};

	const toggleCart = (): void => {
		dispatch({ type: ASSET_ACTION_TYPES.TOGGLE_CART, value: null });
	};

	const toggleNewAssetModal = (): void => {
		redirectToLocation({
			pathname: "/assetstore/assetdetails",
			query: {
				entry: window.location.pathname,
			},
			url: `/assetstore/assetdetails?entry=${window.location.pathname}`,
		});
	};

	const editAsset = (assetData: AssetType): void => {
		redirectToLocation({
			pathname: "/assetstore/assetdetails",
			query: {
				assetId: assetData._id,
				entry: window.location.pathname,
			},
			url: `/assetstore/assetdetails?entry=${window.location.pathname}&assetId=${assetData._id}`,
		});
	};

	const categoryMap: Array<CategoryMap> = useMemo(() => {
		if (state.metaData) {
			return state.metaData.categories.list.map(elem => {
				return {
					title: { name: elem.name, level: "category" },
					key: elem._id,
					children: state.metaData.subcategories.list
						.filter(subElem => {
							return subElem.category === elem._id;
						})
						.map(subElem => {
							return {
								title: { name: subElem.name, level: "subCategory" },
								key: subElem._id,
								children: state.metaData.verticals.list
									.filter(vert => {
										return vert.subcategory === subElem._id;
									})
									.map(filtVert => {
										return {
											title: { name: filtVert.name, level: "verticals" },
											key: filtVert._id,
										};
									}),
							};
						}),
				};
			});
		}
		return [];
	}, [state.metaData]);

	const themeIdToNameMap = useMemo(() => {
		if (state.metaData) {
			return state.metaData.themes.list.reduce((acc, theme) => {
				return { ...acc, [theme._id]: theme.name };
			}, {});
		}
		return {};
	}, [state.metaData]);

	return (
		<PageLayout pageName='Asset Store' isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Asset Store | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={state.loading}>
				<ParentContainer>
					<SidebarContainer>
						<MaxHeightDiv style={{ flexDirection: "column" }}>
							<Row>
								<Col span={24}>
									<Row gutter={[8, 8]}>
										<Col span={24}>
											<Button icon={<RollbackOutlined />} onClick={goToButtonClick} block type='primary'>
												{assetEntryId ? "Go to Primary Asset Selection" : " Go Back"}
											</Button>
										</Col>
										{designId && (
											<Col span={24}>
												<Button onClick={toggleCart} block type='default'>
													Open Cart
												</Button>
											</Col>
										)}
									</Row>
								</Col>
								<Col span={24}>
									<Sidebar state={state} dispatch={dispatch} metaData={state.metaData} categoryMap={categoryMap} />
								</Col>
							</Row>
						</MaxHeightDiv>
					</SidebarContainer>
					<MainContentContainer>
						<MaxHeightDiv>
							<PaddedDiv>
								<AssetMainPanel
									themeIdToNameMap={themeIdToNameMap}
									editAsset={editAsset}
									projectId={projectId}
									dispatch={dispatch}
									state={state}
									assetEntryId={assetEntryId}
									designId={designId}
									moodboard={state.moodboard}
									addRemoveAsset={addRemoveAsset}
								/>
							</PaddedDiv>
						</MaxHeightDiv>
					</MainContentContainer>
				</ParentContainer>
				<FAB onClick={toggleNewAssetModal}>
					<PlusOutlined style={{ color: "white" }} />
				</FAB>
			</Spin>

			<NewAssetModal
				dispatchAssetStore={dispatch}
				assetData={editAssetData}
				setAssetData={setEditAssetData}
				metadata={state.metaData}
				categoryMap={categoryMap}
				toggleNewAssetModal={toggleNewAssetModal}
				isOpen={state.newAssetModalVisible}
			/>
			{state.moodboard && (
				<AssetCartModal
					designId={designId}
					projectId={projectId}
					dataLoading={state.loading}
					addRemoveAsset={addRemoveAsset}
					cartOpen={state.cartOpen}
					dispatch={dispatch}
					moodboard={state.moodboard}
					selectedAssetId={assetEntryId}
				/>
			)}
		</PageLayout>
	);
};

AssetStore.getInitialProps = (
	ctx: NextPageContext
): {
	isServer: boolean;
	authVerification: Partial<User>;
	projectId: string;
	designId: string;
	assetEntryId: string;
} => {
	const {
		req,
		query: { designId: did, assetEntryId: aeid, projectId: pid },
	} = ctx;
	const isServer = !!req;
	const authVerification = {
		name: "",
		email: "",
	};

	const designId: string = did as string;
	const assetEntryId: string = aeid as string;
	const projectId: string = pid as string;
	return { isServer, authVerification, projectId, designId, assetEntryId };
};

export default withAuthVerification(AssetStore);
