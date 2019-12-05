import { getAddRemoveAssetApi, getMetaDataApi, getMoodboardApi } from "@api/designApi";
import { ExtendedJSXFC } from "@customTypes/extendedReactComponentTypes";
import User from "@customTypes/userType";
import AssetCartModal from "@sections/AssetStore/assetCart";
import AssetMainPanel from "@sections/AssetStore/assetMainpanel";
import Sidebar from "@sections/AssetStore/assetSidepanel";
import { CustomDiv, MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { withAuthSync, withAuthVerification } from "@utils/auth";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import { Button, Col, Row, Spin, Typography } from "antd";
import { NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { AssetStoreState, ASSET_ACTION_TYPES, reducer } from "../_sections/AssetStore/reducer";

const {Title} = Typography;

interface MoodboardProps {
	isServer: boolean;
	authVerification: Partial<User>;
	designId: string;
	assetEntryId: string;
	projectId: string;
}

const initialState: AssetStoreState = {
	metaData: null,
	moodboard: null,
	loading: true,
	retailerFilter: [],
	checkedKeys: {
		category: [],
		subCategory: [],
		verticals: []
	},
	selectedAsset: '',
	cartOpen: false,
};

const Overlay = styled(MaxHeightDiv)`
position: fixed;
z-index: 1022;
	width: 100vw;
	background-color: rgba(0,0,0,0.1);
`;

const moodboard: ExtendedJSXFC<MoodboardProps> = ({
	isServer,
	authVerification,
	projectId,
	designId,
	assetEntryId
}): JSX.Element => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const Router = useRouter();

	const fetchMetaData = async (): Promise<void> => {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ endPoint: endpoint, method: "GET" });
		if (response.statusCode === 200) {
			dispatch({ type: ASSET_ACTION_TYPES.METADATA, value: response.data });
		}
	};

	const fetchMoodBoard = async () => {
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: true });
		const endPoint = getMoodboardApi(designId);
		const responseData = await fetcher({ endPoint: endPoint, method: "GET" });
		if (responseData.data) {
			dispatch({ type: ASSET_ACTION_TYPES.MOODBOARD, value: responseData.data });
		}
		dispatch({ type: ASSET_ACTION_TYPES.LOADING_STATUS, value: false });
	};

	const refetchMoodBoard = () => {
		fetchMoodBoard();
	};

	useEffect(() => {
		fetchMetaData();
		fetchMoodBoard();
	}, []);

	const addRemoveAsset: (action: "ADD" | "DELETE", assetId: string, aeid?: string) => void = async (
		action,
		assetId,
		aeid = ""
	) => {
		const endpoint = getAddRemoveAssetApi(designId, aeid);

		if (action === "ADD") {
			await fetcher({
				endPoint: endpoint,
				method: "POST",
				body: {
					data: {
						assetArr: [assetId]
					}
				}
			});
		} else if (action === "DELETE") {
			await fetcher({
				endPoint: endpoint,
				method: "DELETE",
				body: {
					data: {
						assetArr: [assetId]
					}
				}
			});
		}
		if (assetEntryId === assetId) {
			Router.push(
				{ pathname: "/assetstore", query: { designId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}`
			);
		}
		await refetchMoodBoard();
	};

	const goToButtonClick = () => {
		if (assetEntryId) {
			Router.push(
				{ pathname: "/assetstore", query: { designId, projectId } },
				`/assetstore/pid/${projectId}/did/${designId}`
			);
			return;
		}
		Router.push(
			{ pathname: "/dashboard", query: { designId, pid: projectId } },
			`/dashboard/pid/${projectId}/did/${designId}`
		);
	};

	const toggleCart = () => {
		dispatch({type: ASSET_ACTION_TYPES.TOGGLE_CART, value: null})
	}

	return (
		<PageLayout isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Asset Store | {company.product}</title>
			</Head>
			<Spin spinning={state.loading}>

			<Row type={"flex"} align="top">
				<Col sm={8} md={6} lg={6} xl={5}>
					<MaxHeightDiv>
						<CustomDiv width="100%" px="8px" overY="scroll">
							<CustomDiv pt="0.5em" pb="4px" width="100%">
								<Button onClick={goToButtonClick} block type="primary">
									{assetEntryId ? "Go to Primary Asset Selection" : " Go to Dashboard"}
								</Button>
							</CustomDiv>
							<CustomDiv pt="0.5em" pb="4px" width="100%">
								<Button onClick={toggleCart} block type="default">
									Open Cart
								</Button>
							</CustomDiv>
							<Sidebar dispatch={dispatch} metaData={state.metaData} />
						</CustomDiv>
					</MaxHeightDiv>
				</Col>
				<Col sm={16} md={18} lg={18} xl={19}>
					<MaxHeightDiv>
						<AssetMainPanel
							projectId={projectId}
							dispatch={dispatch}
							state={state}
							assetEntryId={assetEntryId}
							designId={designId}
							moodboard={state.moodboard}
							addRemoveAsset={addRemoveAsset}
						/>
					</MaxHeightDiv>
				</Col>
			</Row>
			</Spin>
			<AssetCartModal dataLoading={state.loading} addRemoveAsset={addRemoveAsset} cartOpen={state.cartOpen} dispatch={dispatch} moodboard={state.moodboard}/>
		</PageLayout>
	);
};

moodboard.getInitialProps = async (ctx: NextPageContext) => {
	const {
		req,
		query: { designId, assetEntryId, projectId }
	} = ctx;
	const isServer = !!req;
	const authVerification = {
		name: "",
		email: ""
	};
	return { isServer, authVerification, projectId, designId, assetEntryId };
};

export default withAuthVerification(withAuthSync(moodboard));
