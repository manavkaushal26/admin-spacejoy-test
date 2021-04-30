import { ArrowLeftOutlined } from "@ant-design/icons";
import { MaxHeightDiv } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, Input, Modal, notification, Row, Spin, Table, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { LoudPaddingDiv } from ".";
const { Title } = Typography;

interface SitemapData {
	_id: string;
}

const SitemapManager: NextPage<{
	data: SitemapData[];
}> = ({ data }) => {
	const [urls, setUrls] = useState<SitemapData[]>(data || []);
	const [loading, setLoading] = useState<boolean>(false);
	const [isModalVisible, setModalVisibility] = useState<boolean>(false);
	const router = useRouter();
	const endPoint = "/sitemap";
	const inputRef = useRef(null);
	const getSitemapUrls = async (): Promise<void> => {
		setLoading(true);

		try {
			const response = await fetcher({ endPoint, method: "GET" });

			if (response.statusCode <= 300) {
				setUrls(response.data);
			} else {
				notification.error({ message: "Failed to fetch Active version" });
			}
		} catch (e) {
			notification.error({ message: "Failed to fetch Active version" });
		}
		setLoading(false);
	};

	const deleteUrl = async (el): Promise<void> => {
		setLoading(true);
		const response = await fetcher({ endPoint: `${endPoint}/${el?._id}`, method: "DELETE" });
		getSitemapUrls();
		setLoading(false);
	};

	useEffect(() => {
		getSitemapUrls();
	}, []);

	const handleSave = async () => {
		setLoading(true);
		const response = await fetcher({ endPoint, method: "POST", body: { url: inputRef?.current?.state.value } });
		if (response.statusCode <= 300) {
			notification.success({ message: "URL Saved" });
		} else {
			notification.error({ message: response?.data?.message });
		}
		setLoading(false);
		setModalVisibility(false);
		getSitemapUrls();
	};

	const openModal = () => {
		setModalVisibility(true);
	};

	return (
		<PageLayout pageName='Package Manager'>
			<Head>
				<title>Package Manager | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<Spin spinning={loading}>
				<MaxHeightDiv>
					<br></br>
					<br></br>
					<LoudPaddingDiv>
						<Row>
							<Col>
								<Title level={3}>
									<Row gutter={[8, 8]}>
										<Col>
											<ArrowLeftOutlined onClick={() => router.back()} />
										</Col>
										<Col>Platform Manager</Col>
									</Row>
								</Title>
							</Col>
							<Col span={24}>
								<Button style={{ float: "right" }} type='primary' onClick={openModal}>
									Create
								</Button>
							</Col>
						</Row>
						<br></br>
						<Table loading={loading} rowKey='_id' dataSource={urls} pagination={{ pageSize: 15 }}>
							<Table.Column key='_id' title='URL' dataIndex='url' align='left' render={text => text} />
							<Table.Column key='_id' title='Updated at' dataIndex='updatedAt' align='left' render={text => text} />
							<Table.Column
								key='id'
								title=''
								dataIndex='text'
								render={(_, record) => {
									return <Button onClick={() => deleteUrl(record)}>Delete</Button>;
								}}
							/>
						</Table>
					</LoudPaddingDiv>
				</MaxHeightDiv>
			</Spin>
			<Modal
				visible={isModalVisible}
				footer={[
					<Button key='back' onClick={handleSave}>
						Save
					</Button>,
				]}
				onCancel={() => setModalVisibility(false)}
				width={500}
			>
				<Row>
					<Col>
						<p>Create new URL</p>
						<Input ref={inputRef} />
					</Col>
				</Row>
			</Modal>
		</PageLayout>
	);
};

export default ProtectRoute(SitemapManager);
