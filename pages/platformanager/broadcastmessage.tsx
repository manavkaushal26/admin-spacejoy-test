import { ArrowLeftOutlined } from "@ant-design/icons";
import { broadcastMessageApi } from "@api/userApi";
import { MaxHeightDiv, SilentDivider } from "@sections/Dashboard/styled";
import PageLayout from "@sections/Layout";
import { ProtectRoute } from "@utils/authContext";
import { company } from "@utils/config";
import fetcher from "@utils/fetcher";
import IndexPageMeta from "@utils/meta";
import { Button, Col, DatePicker, Form, Input, Modal, notification, Row, Typography } from "antd";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { LoudPaddingDiv } from ".";

const { Title, Text } = Typography;
const formatToSend = data => {
	const dataToSend = { message: "", start: "", end: "" };
	dataToSend.message = data.message;
	dataToSend.start = data.dateRange[0].toISOString();
	dataToSend.end = data.dateRange[1].toISOString();
	return dataToSend;
};
const BroadcastMessage: NextPage = () => {
	const router = useRouter();

	const sendData = async data => {
		console.log("here", data);
		const endPoint = broadcastMessageApi();
		try {
			const result = await fetcher({ endPoint, method: "POST", body: formatToSend(data) });
			if (result.statusCode <= 300) {
				notification.success({ message: "Message sent to users" });
			} else {
				throw result.data.error;
			}
		} catch (e) {
			notification.error({ message: e.message });
		}
	};

	const confirmData = data => {
		Modal.confirm({ title: "Send message to users?", onOk: () => sendData(data) });
	};

	return (
		<PageLayout pageName='Coupon Manager'>
			<Head>
				<title>Broadcast Message | {company.product}</title>
				{IndexPageMeta}
			</Head>
			<MaxHeightDiv>
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
											<Col>Broadcast chat</Col>
										</Row>
									</Title>
									<Text strong>Warning: Please use this module with caution as actual customers will be contacted</Text>
								</Col>
							</Row>
						</Col>
						<Col span={24}>
							<SilentDivider />
						</Col>
						<Col span={24}>
							<Form labelCol={{ span: 24 }} initialValues={{ message: "", dateRange: [] }} onFinish={confirmData}>
								<Row>
									<Col span={24}>
										<Form.Item name='message' label='Message to customer' rules={[{ required: true }]}>
											<Input.TextArea />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item name='dateRange' label='Send to projects created between:' rules={[{ required: true }]}>
											<DatePicker.RangePicker />
										</Form.Item>
									</Col>
									<Col span={24}>
										<Row justify='end'>
											<Button type='primary' htmlType='submit'>
												Send
											</Button>
										</Row>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				</LoudPaddingDiv>
			</MaxHeightDiv>
		</PageLayout>
	);
};

export default ProtectRoute(BroadcastMessage);
