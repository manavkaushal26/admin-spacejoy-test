import React, { useState, useEffect } from "react";
import User from "@customTypes/userType";
import PageLayout from "@sections/Layout";
import { company } from "@utils/config";

import { NextPageContext, NextPage } from "next";
import IndexPageMeta from "@utils/meta";
import Head from "next/head";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import {
	Row,
	Col,
	Typography,
	Card,
	Pagination,
	Spin,
	notification,
	PageHeader,
	Button,
	Result,
	Popconfirm,
	Icon,
} from "antd";
import { getAllSources, createSourceApi, getSingleSource } from "@api/renderEngineApi";
import fetcher from "@utils/fetcher";
import { AllSources } from "@customTypes/renderEngineTypes";
import Image from "@components/Image";
import { getValueSafely } from "@utils/commonUtils";
import moment from "moment";
import { withAuthVerification } from "@utils/auth";
import { useRouter } from "next/router";
import CreateNewSource from "@sections/RenderEngine/CreateNewSource";
import ImageSlideshowModal from "@components/ImageSlideshowModal";
import { LoudPaddingDiv } from "../platformanager/index";

const { Text } = Typography;

interface RenderEngineProps {
	isServer: boolean;
	authVerification: Partial<User>;
}

const RenderEngine: NextPage<RenderEngineProps> = ({ isServer, authVerification }) => {
	const [sources, setSources] = useState<AllSources[]>([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [countPerPage, setCountPerPage] = useState(40);
	const [loading, setLoading] = useState(false);
	const [createSourceModalVisible, setCreateSourceModalVisible] = useState<boolean>(false);

	const [previewVisible, setPreviewVisible] = useState<boolean>(false);
	const [previewImages, setPreviewImages] = useState<string[]>([]);

	const handleImageClick = (previewImagesList?: string[]): void => {
		if (previewVisible) {
			setPreviewVisible(false);
			setPreviewImages([]);
			return;
		}
		setPreviewVisible(true);
		setPreviewImages(previewImagesList);
	};

	const router = useRouter();

	const fetchSources = async (): Promise<void> => {
		setLoading(true);
		const endPoint = `${getAllSources()}&skip=${countPerPage * (pageNumber - 1)}&limit=${countPerPage}`;
		const response = await fetcher({ endPoint, hasBaseURL: true, method: "GET" });
		if (!response.err) {
			// console.log("Sources", response.data);
			setSources(response.data);
		} else {
			notification.error({ message: "Failed to fetch sources" });
		}
		setLoading(false);
	};

	const onPageSizeChange = (current, size): void => {
		setPageNumber(1);
		setCountPerPage(size);
	};

	useEffect(() => {
		fetchSources();
	}, [pageNumber, countPerPage]);

	const redirectToSource = (srcId): void => {
		router.push({ pathname: "/renderengine/sourcepage", query: { srcId } }, `/renderengine/src/${srcId}`);
	};

	const toggleCreateSourcesModal = (): void => {
		setCreateSourceModalVisible(prevState => !prevState);
	};

	const deleteSource = async (id: string): Promise<void> => {
		const endPoint = `${getSingleSource(id)}?hard=true`;
		try {
			const response = await fetcher({ endPoint, method: "DELETE", hasBaseURL: true });
			if (!response.err) {
				const filteredSources = sources.filter(source => {
					return source._id !== id;
				});
				setSources(filteredSources);
			} else {
				throw Error();
			}
		} catch (e) {
			notification.error({ message: "Failed to delete Source" });
		}
	};

	const onCreate = async (state: Record<string, string>): Promise<void> => {
		setLoading(true);
		const endPoint = createSourceApi();

		const response = await fetcher({
			endPoint,
			method: "POST",
			body: {
				data: state,
			},
			hasBaseURL: true,
		});
		if (!response.err) {
			setSources(prevState => [response.data, ...prevState]);
			toggleCreateSourcesModal();
		} else {
			notification.error({ message: "Failed to Create Source" });
		}
		setLoading(false);
	};

	return (
		<PageLayout isServer={isServer} authVerification={authVerification} pageName="Render Engine">
			<Head>
				<title>Render Engine | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row gutter={[0, 16]}>
							<Col style={{ backgroundColor: "white" }}>
								<PageHeader
									onBack={(): void => router.back()}
									style={{ paddingLeft: "0px", paddingRight: "0px" }}
									title="All Sources"
									extra={[
										<Button onClick={toggleCreateSourcesModal} key="addSource" type="primary">
											Add new Source
										</Button>,
									]}
								/>
							</Col>
							<Col>
								<Row gutter={[16, 16]}>
									{sources.length !== 0 ? (
										sources.map(source => {
											const renders = getValueSafely(
												() => {
													if (source.renders.length === 0) {
														throw Error();
													} else {
														return source.renders;
													}
												},
												process.env.NODE_ENV === "production"
													? ["/v1581057410/admin/designImagePlaceholder.jpg"]
													: ["/v1581057545/admin/designImagePlaceholder.jpg"]
											);

											return (
												<Col key={source._id} sm={12} md={8} lg={6}>
													<Card
														onClick={(): void => redirectToSource(source._id)}
														hoverable
														actions={[
															<Popconfirm
																title="Are you sure?"
																onCancel={(e): void => {
																	e.stopPropagation();
																}}
																onConfirm={(e): void => {
																	e.stopPropagation();
																	deleteSource(source._id);
																}}
																key="delete"
															>
																<Icon type="delete" onClick={(e): void => e.stopPropagation()} />
															</Popconfirm>,
														]}
														cover={
															<Row>
																<Col span={24}>
																	<Image
																		onClick={(e): void => {
																			e.stopPropagation();
																			handleImageClick(renders);
																		}}
																		nolazy
																		width="100%"
																		src={renders[0]}
																	/>
																</Col>
															</Row>
														}
													>
														<Card.Meta
															title={source.name}
															description={
																<Row style={{ flexFlow: "row", whiteSpace: "pre", overflow: "hidden" }} gutter={[4, 4]}>
																	<Col span={24}>
																		<Text strong>Created at: </Text>
																		<Text> {moment(source.createdAt).format("D-MMM-YYYY")}</Text>
																	</Col>
																	<Col span={24}>
																		<Text strong>No of jobs: </Text>
																		<Text>{source.jobs?.length || 0}</Text>
																	</Col>
																</Row>
															}
														/>
													</Card>
												</Col>
											);
										})
									) : (
										<Result status="404" title="No Sources" subTitle="Create a new Source to see it here" />
									)}
								</Row>
							</Col>
							<Col>
								<Pagination
									current={pageNumber}
									total={sources.length}
									onChange={setPageNumber}
									hideOnSinglePage
									pageSize={countPerPage}
									showSizeChanger
									pageSizeOptions={["10", "20", "30", "40"]}
									onShowSizeChange={onPageSizeChange}
								/>
							</Col>
						</Row>
					</LoudPaddingDiv>
					<ImageSlideshowModal
						altText="Render Images"
						previewImages={previewImages}
						previewVisible={previewVisible}
						handleCancel={handleImageClick}
					/>
				</MaxHeightDiv>
			</Spin>
			<CreateNewSource
				isOpen={createSourceModalVisible}
				onCreate={onCreate}
				toggleModal={toggleCreateSourcesModal}
				loading={loading}
			/>
		</PageLayout>
	);
};

RenderEngine.getInitialProps = async (ctx: NextPageContext): Promise<RenderEngineProps> => {
	const { req } = ctx;
	const isServer = !!req;

	const authVerification = {
		name: "",
		email: "",
	};
	return { isServer, authVerification };
};

export default withAuthVerification(RenderEngine);
