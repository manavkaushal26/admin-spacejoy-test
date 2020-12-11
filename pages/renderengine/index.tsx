import { DeleteOutlined } from "@ant-design/icons";
import { createSourceApi, getAllSources, getSingleSource, getSourceCount } from "@api/renderEngineApi";
import Image from "@components/Image";
import ImageSlideshowModal from "@components/ImageSlideshowModal";
import { AllSources } from "@customTypes/renderEngineTypes";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import CreateNewSource from "@sections/RenderEngine/CreateNewSource";
import { ProtectRoute, redirectToLocation } from "@utils/authContext";
import { getValueSafely } from "@utils/commonUtils";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import {
	Button,
	Card,
	Col,
	notification,
	PageHeader,
	Pagination,
	Popconfirm,
	Result,
	Row,
	Spin,
	Typography,
} from "antd";
import moment from "moment";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LoudPaddingDiv } from "../platformanager/index";

const { Text } = Typography;

const RenderEngine: NextPage = () => {
	const [sources, setSources] = useState<AllSources[]>([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [countPerPage, setCountPerPage] = useState(24);
	const [loading, setLoading] = useState(false);
	const [createSourceModalVisible, setCreateSourceModalVisible] = useState<boolean>(false);
	const [total, setTotal] = useState<number>(0);
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
		if (!response.data.err) {
			// console.log("Sources", response.data);
			setSources(response.data.data);
		} else {
			notification.error({ message: "Failed to fetch sources" });
		}
		setLoading(false);
	};

	const onPageSizeChange = (current, size): void => {
		setPageNumber(1);
		setCountPerPage(size);
	};

	const fetchSourceCount = async (): Promise<void> => {
		setLoading(true);

		const endPoint = getSourceCount();

		try {
			const response = await fetcher({
				endPoint,
				method: "GET",
				hasBaseURL: true,
			});
			if (!response.data.err) {
				setTotal(response.data.data);
			} else {
				notification.error({ message: "Failed to fetch source count" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch source count" });
		}

		setLoading(false);
	};
	useEffect(() => {
		fetchSources();
		fetchSourceCount();
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
			if (!response.data.err) {
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
		if (!response.data.err) {
			setSources(prevState => [response.data.data, ...prevState]);
			toggleCreateSourcesModal();
		} else {
			notification.error({ message: "Failed to Create Source" });
		}
		setLoading(false);
	};

	return (
		<PageLayout pageName='Render Engine'>
			<Head>
				<title>Render Engine | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<LoudPaddingDiv>
						<Row gutter={[0, 16]}>
							<Col span={24} style={{ backgroundColor: "white" }}>
								<PageHeader
									onBack={(): void => redirectToLocation({ pathname: "/platformanager" })}
									style={{ paddingLeft: "0px", paddingRight: "0px" }}
									title='All Sources'
									extra={[
										<Button onClick={toggleCreateSourcesModal} key='addSource' type='primary'>
											Add new Source
										</Button>,
									]}
								/>
							</Col>
							<Col span={24}>
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
																title='Are you sure?'
																onCancel={(e): void => {
																	e.stopPropagation();
																}}
																onConfirm={(e): void => {
																	e.stopPropagation();
																	deleteSource(source._id);
																}}
																key='delete'
															>
																<DeleteOutlined onClick={(e): void => e.stopPropagation()} />
															</Popconfirm>,
														]}
														cover={
															<Row>
																<Col span={24}>
																	<Image
																		onClick={(e): void => {
																			e.stopPropagation();
																		}}
																		preview
																		height='157.47px'
																		width='100%'
																		src={`h_157.47,c_pad/${renders[0]}`}
																	/>
																</Col>
															</Row>
														}
													>
														<Card.Meta
															title={source.name}
															description={
																<Row gutter={[4, 4]}>
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
										<Col span={24}>
											<Result status='404' title='No Sources' subTitle='Create a new Source to see it here' />
										</Col>
									)}
								</Row>
							</Col>
							<Col span={24}>
								<Row justify='center'>
									<Pagination
										current={pageNumber}
										total={total}
										onChange={setPageNumber}
										hideOnSinglePage
										pageSize={countPerPage}
										showSizeChanger
										pageSizeOptions={["12", "24", "36", "48"]}
										onShowSizeChange={onPageSizeChange}
									/>
								</Row>
							</Col>
						</Row>
					</LoudPaddingDiv>
					<ImageSlideshowModal
						altText='Render Images'
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

export default ProtectRoute(RenderEngine);
