import React, { useState, useEffect } from "react";
import PageLayout from "@sections/Layout";
import { company } from "@utils/config";
import Head from "next/head";
import { NextPage } from "next";
import User, { Role } from "@customTypes/userType";
import IndexPageMeta from "@utils/meta";
import { Row, Typography, Col, notification, Card, Button, Pagination } from "antd";
import { CollectionBase } from "@customTypes/collectionTypes";
import { getAllCollections, getAllCollectionsMeta } from "@api/metaApi";
import fetcher from "@utils/fetcher";
import Image from "@components/Image";
import styled from "styled-components";
import CreateEditCollection from "@sections/collections/CreateEditCollection";

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
	isServer: boolean;
	authVerification: Partial<User>;
}> = ({ isServer, authVerification }) => {
	const [collections, setCollections] = useState<CollectionBase[]>([]);
	const [createEditModalVisible, setCreateEditModalVisible] = useState<boolean>(false);
	const [editCollectionId, setEditCollectionId] = useState<string>(null);
	const [pageSize, setPageSize] = useState<number>(10);
	const [pageNo, setPageNo] = useState<number>(1);
	const [collectionMeta, setCollectionMeta] = useState<{ count: number }>({ count: 0 });

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
		if (response.status === "success") {
			setCollectionMeta(response.data);
		} else {
			notification.error({ message: "Failed to fetch collections metadata" });
		}
	};

	const fetchCollection = async (): Promise<void> => {
		const endPoint = `${getAllCollections()}?skip=${pageSize * (pageNo - 1)}&limit=${pageSize}`;
		const response = await fetcher({ endPoint, method: "GET" });
		if (response.status === "success") {
			setCollections(response.data);
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

	return (
		<PageLayout pageName="Metamanger" isServer={isServer} authVerification={authVerification}>
			<Head>
				<title>Collections | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<LoudPaddingDiv>
				<Row gutter={[8, 8]}>
					<Col span={24}>
						<Row type="flex" justify="space-between">
							<Col>
								<Title>Collections</Title>
							</Col>
							<Col>
								<Button type="primary" onClick={(): void => onClick()}>
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
											style={{ background: collection.bg }}
											hoverable
											onClick={(): void => onClick(collection._id, "open")}
											cover={<Image nolazy src={collection.cdnThumbnail} />}
										>
											<Card.Meta title={collection.name} />
										</Card>
									</Col>
								);
							})}
						</Row>
					</Col>
					<Col span={24}>
						<Row type="flex" justify="center">
							<Pagination
								current={pageNo}
								total={collectionMeta.count}
								onChange={setPageNo}
								hideOnSinglePage
								pageSize={pageSize}
								showSizeChanger
								pageSizeOptions={["10", "20", "30", "40"]}
								onShowSizeChange={onPageSizeChange}
							/>
						</Row>
					</Col>
				</Row>
			</LoudPaddingDiv>
			<CreateEditCollection onSave={onSave} id={editCollectionId} isOpen={createEditModalVisible} onClose={onClick} />
		</PageLayout>
	);
};

CollectionsMeta.getInitialProps = async ({
	req,
}): Promise<{
	isServer: boolean;
	authVerification: Partial<User>;
}> => {
	const isServer = !!req;
	const authVerification = {
		name: "",
		role: Role.Guest,
	};
	return { isServer, authVerification };
};
export default CollectionsMeta;
