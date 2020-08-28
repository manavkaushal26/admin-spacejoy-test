import { ArrowLeftOutlined } from "@ant-design/icons";
import { getMetaDataApi } from "@api/designApi";
import { getAllCollections, getAllCollectionsMeta } from "@api/metaApi";
import Image from "@components/Image";
import { CollectionBase } from "@customTypes/collectionTypes";
import { MetaDataType } from "@customTypes/moodboardTypes";
import CreateEditCollection from "@sections/collections/CreateEditCollection";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Card, Col, notification, Pagination, Row, Typography } from "antd";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const { Title } = Typography;
const LoudPaddingDiv = styled.div`
	padding: 2rem 1.15rem;
	@media only screen and (max-width: 1200px) {
		padding: 2rem 1.15rem;
	}
	max-width: 1200px;
	margin: auto;
	width: 100%;
`;

const CollectionsMeta: NextPage<{
	metaData: MetaDataType;
}> = ({ metaData }) => {
	const [collections, setCollections] = useState<CollectionBase[]>([]);
	const [createEditModalVisible, setCreateEditModalVisible] = useState<boolean>(false);
	const [editCollectionId, setEditCollectionId] = useState<string>(null);
	const [pageSize, setPageSize] = useState<number>(12);
	const [pageNo, setPageNo] = useState<number>(1);
	const [collectionMeta, setCollectionMeta] = useState<{ count: number }>({ count: 0 });
	const [metadata, setMetadata] = useState<MetaDataType>(metaData);

	useEffect(() => {
		const fetchMetaData = async () => {
			if (!metaData) {
				const endpoint = getMetaDataApi();
				const response = await fetcher({ endPoint: endpoint, method: "GET" });
				if (response.statusCode <= 300) {
					setMetadata(response.data);
				}
			}
		};
		if (!metaData) fetchMetaData();
	}, []);

	const onClick: (id?: string, type?: "open" | "close") => void = (id = null, type = "open") => {
		if (type === "open") {
			setEditCollectionId(id);
			setCreateEditModalVisible(true);
		} else {
			setEditCollectionId(null);
			setCreateEditModalVisible(false);
		}
	};

	const fetchCollectionMeta = async (): Promise<void> => {
		const endPoint = getAllCollectionsMeta();
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			setCollectionMeta(response.data.data);
		} else {
			notification.error({ message: "Failed to fetch collections metadata" });
		}
	};

	const fetchCollection = async (): Promise<void> => {
		const endPoint = `${getAllCollections()}?skip=${pageSize * (pageNo - 1)}&limit=${pageSize}`;
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.statusCode <= 300) {
			setCollections(response.data.data);
			fetchCollectionMeta();
		} else {
			notification.error({ message: "Failed to fetch collections" });
		}
	};

	const onSave: (data: CollectionBase, newEntry: boolean) => void = (data, newEntry) => {
		if (newEntry) {
			setCollections([data, ...collections]);
		} else {
			setCollections(prevData =>
				prevData.map(collection => {
					if (collection._id === data._id) {
						return { ...data };
					}
					return { ...collection };
				})
			);
		}
	};

	const onPageSizeChange = (current, size): void => {
		setPageNo(1);
		setPageSize(size);
	};

	useEffect(() => {
		fetchCollection();
	}, [pageNo, pageSize]);
	const router = useRouter();
	return (
		<PageLayout pageName='Collections'>
			<Head>
				<title>Collections | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<LoudPaddingDiv>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Row justify='space-between'>
							<Col>
								<Title level={3}>
									<Row gutter={[8, 8]}>
										<Col>
											<ArrowLeftOutlined onClick={() => router.back()} />
										</Col>
										<Col>Collections</Col>
									</Row>
								</Title>
							</Col>
							<Col>
								<Button type='primary' onClick={(): void => onClick()}>
									Create New Collection
								</Button>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[8, 8]}>
							{collections.map(collection => {
								return (
									<Col key={collection._id} sm={12} md={8} lg={6}>
										<Card
											style={{ background: collection.bg || "white" }}
											hoverable
											onClick={(): void => onClick(collection._id, "open")}
											cover={<Image onClick={e => e.stopPropagation()} src={collection.cdnThumbnail} preview />}
										>
											<Card.Meta title={collection.name} />
										</Card>
									</Col>
								);
							})}
						</Row>
					</Col>
					<Col span={24}>
						<Row justify='center'>
							<Pagination
								current={pageNo}
								total={collectionMeta.count}
								onChange={setPageNo}
								hideOnSinglePage
								pageSize={pageSize}
								showSizeChanger
								pageSizeOptions={["12", "24", "36", "48"]}
								onShowSizeChange={onPageSizeChange}
							/>
						</Row>
					</Col>
				</Row>
			</LoudPaddingDiv>
			<CreateEditCollection
				onSave={onSave}
				id={editCollectionId}
				isOpen={createEditModalVisible}
				onClose={onClick}
				metadata={metadata}
			/>
		</PageLayout>
	);
};

export const getServerSideProps: GetServerSideProps<{
	metaData?: MetaDataType;
}> = async ctx => {
	try {
		const endpoint = getMetaDataApi();
		const response = await fetcher({ ctx, endPoint: endpoint, method: "GET" });
		if (response.statusCode === 200) {
			return { props: { metaData: response.data } };
		} else {
			throw new Error();
		}
	} catch (e) {
		return { props: {} };
	}
};
export default ProtectRoute(CollectionsMeta);
